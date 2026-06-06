import "./LandingPage.css";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="landing-page">
      <div className="landing-page__glow landing-page__glow--left" aria-hidden="true" />
      <div className="landing-page__glow landing-page__glow--right" aria-hidden="true" />
      <main className="landing-page__main">
        <img
          className="landing-page__logo"
          src="/brand_logo.png"
          alt="AI Movie Studio"
        />
        <p className="landing-page__eyebrow">AI Movie Studio</p>
        <button type="button" className="landing-page__cta" onClick={onStart}>
          Generate video
        </button>
      </main>
    </div>
  );
}
