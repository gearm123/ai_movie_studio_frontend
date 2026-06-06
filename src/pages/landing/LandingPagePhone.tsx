import type { LandingPageProps } from "./types";
import "./LandingPagePhone.css";

export function LandingPagePhone({ onStart }: LandingPageProps) {
  return (
    <div className="landing-phone">
      <div className="landing-phone__glow landing-phone__glow--left" aria-hidden="true" />
      <div className="landing-phone__glow landing-phone__glow--right" aria-hidden="true" />
      <main className="landing-phone__main">
        <img
          className="landing-phone__logo"
          src="/brand_logo.png"
          alt="AI Movie Studio"
        />
        <div className="landing-phone__actions">
          <p className="landing-phone__eyebrow">AI Movie Studio</p>
          <button type="button" className="landing-phone__cta" onClick={onStart}>
            Generate Video
          </button>
        </div>
      </main>
    </div>
  );
}
