import type { ReactNode } from "react";
import { useViewport } from "./useViewport";

interface ResponsiveViewProps {
  browser: ReactNode;
  phone: ReactNode;
}

/** Picks the browser or phone UI tree based on viewport width. */
export function ResponsiveView({ browser, phone }: ResponsiveViewProps) {
  const viewport = useViewport();
  return viewport === "phone" ? phone : browser;
}
