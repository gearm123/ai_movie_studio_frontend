import type { ReactNode } from "react";
import type { AppStep } from "../types/steps";
import "./StudioLayoutBrowser.css";

interface StudioLayoutBrowserProps {
  step: AppStep;
  children: ReactNode;
}

const STEP_FOOTER: Partial<Record<Exclude<AppStep, "landing">, string>> = {
  beats: "Beat-by-beat editing",
};

export function StudioLayoutBrowser({ step, children }: StudioLayoutBrowserProps) {
  return (
    <div className="studio-browser">
      <div className="studio-browser__glow studio-browser__glow--left" aria-hidden="true" />
      <div className="studio-browser__glow studio-browser__glow--right" aria-hidden="true" />
      <header className="studio-browser__header">
        <div className="studio-browser__brand">
          <span className="studio-browser__mark" aria-hidden="true">
            ▶
          </span>
          <div>
            <p className="studio-browser__eyebrow">Production suite</p>
            <h1 className="studio-browser__title">AI Movie Studio</h1>
          </div>
        </div>
      </header>
      <main className="studio-browser__main">{children}</main>
      <footer className="studio-browser__footer">
        {STEP_FOOTER[step as Exclude<AppStep, "landing">] ? (
          <span>{STEP_FOOTER[step as Exclude<AppStep, "landing">]}</span>
        ) : null}
      </footer>
    </div>
  );
}
