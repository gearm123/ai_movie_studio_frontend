import { useEffect, useState } from "react";
import { PHONE_MAX_WIDTH, VIEWPORT_MEDIA_QUERY, type ViewportKind } from "./constants";
import { readViewportOverride } from "./viewportOverride";

function readViewportFromMedia(): ViewportKind {
  if (typeof window === "undefined") {
    return "browser";
  }
  return window.matchMedia(VIEWPORT_MEDIA_QUERY).matches ? "phone" : "browser";
}

function resolveViewport(): ViewportKind {
  return readViewportOverride() ?? readViewportFromMedia();
}

/** Returns `browser` or `phone` so pages can render separate UI trees. */
export function useViewport(): ViewportKind {
  const [viewport, setViewport] = useState<ViewportKind>(resolveViewport);

  useEffect(() => {
    const media = window.matchMedia(VIEWPORT_MEDIA_QUERY);
    const onChange = () => setViewport(resolveViewport());
    onChange();
    media.addEventListener("change", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  return viewport;
}

export function isPhoneViewport(width = window.innerWidth): boolean {
  const override = readViewportOverride();
  if (override) {
    return override === "phone";
  }
  return width <= PHONE_MAX_WIDTH;
}
