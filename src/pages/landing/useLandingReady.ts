import { useEffect, useState } from "react";
import { preloadBrandLogo } from "./brandLogo";

const READY_TIMEOUT_MS = 10_000;

function waitForLandingFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts?.ready) {
    return Promise.resolve();
  }
  return document.fonts.ready.then(() => undefined);
}

/** Waits for brand logo + primary fonts before revealing the landing page. */
export function useLandingReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        setReady(true);
      }
    }, READY_TIMEOUT_MS);

    void Promise.allSettled([preloadBrandLogo(), waitForLandingFonts()]).then(() => {
      if (!cancelled) {
        window.clearTimeout(timeoutId);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}
