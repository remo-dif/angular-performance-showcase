import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Simple in-memory cache
const cache = new Map<string, { response: HttpResponse<any>, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }
  
  // Check if request should be cached (add query param ?cache=false to bypass)
  if (req.params.has('cache') && req.params.get('cache') === 'false') {
    return next(req);
  }
  
  const cachedResponse = cache.get(req.urlWithParams);
  
  // Return cached response if fresh
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
    console.log(`[Cache] HIT: ${req.urlWithParams}`);
    return new Observable(observer => {
      observer.next(cachedResponse.response);
      observer.complete();
    });
  }
  
  // Cache miss - fetch and cache
  console.log(`[Cache] MISS: ${req.urlWithParams}`);
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          response: event,
          timestamp: Date.now()
        });
      }
    })
  );
};

// Export cache management functions
export const clearCache = (): void => {
  cache.clear();
  console.log('[Cache] Cleared all cached responses');
};

export const getCacheStats = () => ({
  size: cache.size,
  keys: Array.from(cache.keys())
});

import { Observable } from 'rxjs';
