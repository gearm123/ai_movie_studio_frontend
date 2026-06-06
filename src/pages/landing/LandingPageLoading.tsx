import "./LandingPageLoading.css";

export function LandingPageLoading() {
  return (
    <div className="landing-page-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="landing-page-loading__pulse" aria-hidden="true" />
      <p className="landing-page-loading__label">Loading studio…</p>
    </div>
  );
}
