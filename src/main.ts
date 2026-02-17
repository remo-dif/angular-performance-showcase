import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Web Vitals Performance Monitoring
const reportWebVitals = (metric: any) => {
  // In production, send to analytics
  console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
  
  // Could send to analytics service:
  // analytics.track('web-vital', {
  //   name: metric.name,
  //   value: metric.value,
  //   rating: metric.rating,
  //   id: metric.id
  // });
};

// Measure app bootstrap time
const bootstrapStart = performance.now();

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    const bootstrapEnd = performance.now();
    console.log(`[Performance] Bootstrap time: ${(bootstrapEnd - bootstrapStart).toFixed(2)}ms`);
  })
  .catch((err) => console.error(err));

// Track Core Web Vitals (would use web-vitals library in production)
if ('PerformanceObserver' in window) {
  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      reportWebVitals({
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor'
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }
  
  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        reportWebVitals({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : 'needs-improvement'
        });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }
  
  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      reportWebVitals({
        name: 'CLS',
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }
}
