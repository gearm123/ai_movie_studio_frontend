import { ResponsiveView } from "../../viewports";
import { LandingPageBrowser } from "./LandingPageBrowser";
import { LandingPageLoading } from "./LandingPageLoading";
import { LandingPagePhone } from "./LandingPagePhone";
import { useLandingReady } from "./useLandingReady";
import type { LandingPageProps } from "./types";
import "./LandingPageShell.css";

export function LandingPage(props: LandingPageProps) {
  const ready = useLandingReady();

  return (
    <>
      {!ready ? <LandingPageLoading /> : null}
      <div
        className={ready ? "landing-page-shell landing-page-shell--ready" : "landing-page-shell"}
        aria-hidden={!ready}
      >
        <ResponsiveView
          browser={<LandingPageBrowser {...props} />}
          phone={<LandingPagePhone {...props} />}
        />
      </div>
    </>
  );
}

export type { LandingPageProps } from "./types";
