import type { LandingPageProps } from "./types";
import { LandingBrandLogo } from "./LandingBrandLogo";
import "./LandingPageBrowser.css";

export function LandingPageBrowser({ onStart }: LandingPageProps) {
  return (
    <div className="landing-browser">
      <div className="landing-browser__glow landing-browser__glow--left" aria-hidden="true" />
      <div className="landing-browser__glow landing-browser__glow--right" aria-hidden="true" />
      <main className="landing-browser__main">
        <LandingBrandLogo className="landing-browser__logo" />
        <div className="landing-browser__actions">
          <h1 className="landing-browser__eyebrow">AI Movie Studio</h1>
          <button type="button" className="landing-browser__cta" onClick={onStart}>
            Generate Video
          </button>
        </div>
      </main>
    </div>
  );
}
