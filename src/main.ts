import { isDevMode } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

type WebVitalName = 'LCP' | 'INP' | 'CLS';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  rating: WebVitalRating;
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  loadTime: number;
  renderTime: number;
}

interface InteractionPerformanceEntry extends PerformanceEntry {
  duration: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

type InteractionObserverOptions = PerformanceObserverInit & {
  durationThreshold: number;
};

// Web Vitals Performance Monitoring
const reportWebVitals = (metric: WebVitalMetric): void => {
  // In production, send to analytics
  console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
};

// Measure app bootstrap time
const bootstrapStart = performance.now();

async function enableMocking(): Promise<void> {
  if (!isDevMode()) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking()
  .then(() => bootstrapApplication(AppComponent, appConfig))
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
      const entries = list.getEntries() as LargestContentfulPaintEntry[];
      const lastEntry = entries.at(-1);
      if (!lastEntry) {
        return;
      }

      const value = lastEntry.renderTime || lastEntry.loadTime;
      reportWebVitals({
        name: 'LCP',
        value,
        rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor'
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch {
    // LCP not supported
  }

  // Interaction to Next Paint (INP)
  let inpValue = 0;
  try {
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as InteractionPerformanceEntry[];
      for (const entry of entries) {
        inpValue = Math.max(inpValue, entry.duration);
        reportWebVitals({
          name: 'INP',
          value: inpValue,
          rating: inpValue < 200 ? 'good' : inpValue < 500 ? 'needs-improvement' : 'poor'
        });
      }
    });
    const inpObserverOptions: InteractionObserverOptions = {
      type: 'event',
      buffered: true,
      durationThreshold: 40,
    };
    inpObserver.observe(inpObserverOptions);
  } catch {
    // INP not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
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
  } catch {
    // CLS not supported
  }
}
