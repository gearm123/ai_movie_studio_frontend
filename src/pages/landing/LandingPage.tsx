import { ResponsiveView } from "../../viewports";
import { LandingPageBrowser } from "./LandingPageBrowser";
import { LandingPagePhone } from "./LandingPagePhone";
import type { LandingPageProps } from "./types";

export function LandingPage(props: LandingPageProps) {
  return (
    <ResponsiveView
      browser={<LandingPageBrowser {...props} />}
      phone={<LandingPagePhone {...props} />}
    />
  );
}

export type { LandingPageProps } from "./types";
