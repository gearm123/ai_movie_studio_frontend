import type { LandingPageProps } from "./types";
import "./LandingPagePhone.css";

export function LandingPagePhone({ onStart }: LandingPageProps) {
  return (
    <div className="landing-phone">
      <div className="landing-phone__glow landing-phone__glow--left" aria-hidden="true" />
      <div className="landing-phone__glow landing-phone__glow--right" aria-hidden="true" />
      <main className="landing-phone__main">
        <div className="landing-phone__brand">
          <img
            className="landing-phone__logo"
            src="/brand_logo.png"
            alt="AI Movie Studio"
          />
          <p className="landing-phone__eyebrow">AI Movie Studio</p>
        </div>
        <button type="button" className="landing-phone__cta" onClick={onStart}>
          Generate Video
        </button>
      </main>
    </div>
  );
}
