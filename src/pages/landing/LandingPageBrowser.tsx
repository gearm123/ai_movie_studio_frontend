import type { LandingPageProps } from "./types";
import "./LandingPageBrowser.css";

export function LandingPageBrowser({ onStart }: LandingPageProps) {
  return (
    <div className="landing-browser">
      <div className="landing-browser__glow landing-browser__glow--left" aria-hidden="true" />
      <div className="landing-browser__glow landing-browser__glow--right" aria-hidden="true" />
      <main className="landing-browser__main">
        <div className="landing-browser__brand">
          <img
            className="landing-browser__logo"
            src="/brand_logo.png"
            alt="AI Movie Studio"
          />
          <p className="landing-browser__eyebrow">AI Movie Studio</p>
        </div>
        <button type="button" className="landing-browser__cta" onClick={onStart}>
          Generate Video
        </button>
      </main>
    </div>
  );
}
