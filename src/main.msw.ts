import { isDevMode } from "@angular/core";
import { bootstrapApp } from "./app.bootstrap";

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
  .then(() => bootstrapApp())
  .catch((err) => console.error(err));
