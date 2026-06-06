import type { LandingPageProps } from "./types";
import "./LandingPageBrowser.css";

export function LandingPageBrowser({ onStart }: LandingPageProps) {
  return (
    <div className="landing-browser">
      <div className="landing-browser__glow landing-browser__glow--left" aria-hidden="true" />
      <div className="landing-browser__glow landing-browser__glow--right" aria-hidden="true" />
      <main className="landing-browser__main">
        <img
          className="landing-browser__logo"
          src="/brand_logo.png"
          alt="AI Movie Studio"
        />
        <div className="landing-browser__actions">
          <p className="landing-browser__eyebrow">AI Movie Studio</p>
          <button type="button" className="landing-browser__cta" onClick={onStart}>
            Generate Video
          </button>
        </div>
      </main>
    </div>
  );
}
