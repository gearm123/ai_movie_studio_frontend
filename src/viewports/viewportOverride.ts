import { VIEWPORT_OVERRIDE_STORAGE_KEY, type ViewportKind } from "./constants";

/** Dev-only forced viewport from query string or localStorage. */
export function readViewportOverride(): ViewportKind | null {
  if (import.meta.env.PROD || typeof window === "undefined") {
    return null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get("viewport");
  if (fromQuery === "phone" || fromQuery === "browser") {
    return fromQuery;
  }

  const fromStorage = localStorage.getItem(VIEWPORT_OVERRIDE_STORAGE_KEY);
  if (fromStorage === "phone" || fromStorage === "browser") {
    return fromStorage;
  }

  return null;
}

export function persistViewportOverride(viewport: ViewportKind | null): void {
  if (import.meta.env.PROD || typeof window === "undefined") {
    return;
  }
  if (viewport === null) {
    localStorage.removeItem(VIEWPORT_OVERRIDE_STORAGE_KEY);
    return;
  }
  localStorage.setItem(VIEWPORT_OVERRIDE_STORAGE_KEY, viewport);
}
