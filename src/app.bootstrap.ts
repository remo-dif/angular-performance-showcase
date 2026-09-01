import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

type WebVitalName = "LCP" | "INP" | "CLS";
type WebVitalRating = "good" | "needs-improvement" | "poor";

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

const reportWebVitals = (metric: WebVitalMetric): void => {
  console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
};

function trackCoreWebVitals(): void {
  if (!("PerformanceObserver" in window)) {
    return;
  }

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LargestContentfulPaintEntry[];
      const lastEntry = entries.at(-1);
      if (!lastEntry) {
        return;
      }

      const value = lastEntry.renderTime || lastEntry.loadTime;
      reportWebVitals({
        name: "LCP",
        value,
        rating: value < 2500 ? "good" : value < 4000 ? "needs-improvement" : "poor",
      });
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch {
    // LCP not supported.
  }

  let inpValue = 0;
  try {
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as InteractionPerformanceEntry[];
      for (const entry of entries) {
        inpValue = Math.max(inpValue, entry.duration);
        reportWebVitals({
          name: "INP",
          value: inpValue,
          rating: inpValue < 200 ? "good" : inpValue < 500 ? "needs-improvement" : "poor",
        });
      }
    });
    const inpObserverOptions: InteractionObserverOptions = {
      type: "event",
      buffered: true,
      durationThreshold: 40,
    };
    inpObserver.observe(inpObserverOptions);
  } catch {
    // INP not supported.
  }

  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      reportWebVitals({
        name: "CLS",
        value: clsValue,
        rating: clsValue < 0.1 ? "good" : clsValue < 0.25 ? "needs-improvement" : "poor",
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch {
    // CLS not supported.
  }
}

export function bootstrapApp(): Promise<void> {
  const bootstrapStart = performance.now();

  return bootstrapApplication(AppComponent, appConfig)
    .then(() => {
      const bootstrapEnd = performance.now();
      console.log(
        `[Performance] Bootstrap time: ${(bootstrapEnd - bootstrapStart).toFixed(2)}ms`,
      );
      trackCoreWebVitals();
    })
    .then(() => undefined);
}
