import type { ReactNode } from "react";
import type { AppStep } from "../types/steps";
import "./StudioLayout.css";

interface StudioLayoutProps {
  step: AppStep;
  children: ReactNode;
}

const STEP_FOOTER: Record<Exclude<AppStep, "landing">, string> = {
  setup: "Whole-movie settings",
  beats: "Beat-by-beat editing",
};

export function StudioLayout({ step, children }: StudioLayoutProps) {
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
      </header>
      <main className="studio-main">{children}</main>
      <footer className="studio-footer">
        <span>{STEP_FOOTER[step as Exclude<AppStep, "landing">]}</span>
      </footer>
    </div>
  );
}
