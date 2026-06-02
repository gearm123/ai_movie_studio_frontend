import type { ReactNode } from "react";
import "./StudioLayout.css";

interface StudioLayoutProps {
  children: ReactNode;
}

export function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <div className="studio-shell">
      <div className="studio-glow studio-glow--left" aria-hidden="true" />
      <div className="studio-glow studio-glow--right" aria-hidden="true" />
      <header className="studio-header">
        <div className="studio-brand">
          <span className="studio-brand__mark" aria-hidden="true">
            ▶
          </span>
          <div>
            <p className="studio-brand__eyebrow">Production suite</p>
            <h1 className="studio-brand__title">AI Movie Studio</h1>
          </div>
        </div>
        <p className="studio-header__tagline">
          Plan short-form films beat by beat — visuals, narration, and final cut in one pipeline.
        </p>
      </header>
      <main className="studio-main">{children}</main>
      <footer className="studio-footer">
        <span>Step 1 of many</span>
        <span className="studio-footer__dot" aria-hidden="true" />
        <span>Structure your story</span>
      </footer>
    </div>
  );
}
