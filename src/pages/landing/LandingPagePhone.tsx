import type { LandingPageProps } from "./types";
import { LandingBrandLogo } from "./LandingBrandLogo";
import "./LandingPagePhone.css";

export function LandingPagePhone({ onStart }: LandingPageProps) {
  return (
    <div className="landing-phone">
      <div className="landing-phone__glow landing-phone__glow--left" aria-hidden="true" />
      <div className="landing-phone__glow landing-phone__glow--right" aria-hidden="true" />
      <main className="landing-phone__main">
        <LandingBrandLogo className="landing-phone__logo" />
        <div className="landing-phone__actions">
          <h1 className="landing-phone__eyebrow">AI Movie Studio</h1>
          <button type="button" className="landing-phone__cta" onClick={onStart}>
            Generate Video
          </button>
        </div>
      </main>
    </div>
  );
}
