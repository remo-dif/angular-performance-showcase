import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { cachingInterceptor } from './core/interceptors/caching.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimized Zone.js configuration
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true
    }),
    
    // Router with performance optimizations
    provideRouter(
      routes,
      withComponentInputBinding(), // Bind route params to component inputs
      withViewTransitions(), // Native view transitions API
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    
    // HTTP with fetch API and caching interceptor
    provideHttpClient(
      withFetch(), // Use native fetch instead of XMLHttpRequest
      withInterceptors([cachingInterceptor])
    ),
    
    // Animations
    provideAnimations()
  ]
};
