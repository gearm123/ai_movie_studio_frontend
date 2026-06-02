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
        <p className="landing-page__eyebrow">AI Movie Studio</p>
        <h1 className="landing-page__title">Generate video</h1>
        <button type="button" className="landing-page__cta" onClick={onStart}>
          Generate video
        </button>
      </main>
    </div>
  );
}
