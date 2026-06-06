import type { ReactNode } from "react";
import { ResponsiveView } from "../viewports";
import type { AppStep } from "../types/steps";
import { StudioLayoutBrowser } from "./StudioLayoutBrowser";
import { StudioLayoutPhone } from "./StudioLayoutPhone";

interface StudioLayoutProps {
  step: AppStep;
  children: ReactNode;
}

export function StudioLayout({ step, children }: StudioLayoutProps) {
  return (
    <ResponsiveView
      browser={
        <StudioLayoutBrowser step={step}>{children}</StudioLayoutBrowser>
      }
      phone={<StudioLayoutPhone step={step}>{children}</StudioLayoutPhone>}
    />
  );
}
