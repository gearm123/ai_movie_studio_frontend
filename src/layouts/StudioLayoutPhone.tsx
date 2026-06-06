import type { ReactNode } from "react";
import type { AppStep } from "../types/steps";
import "./StudioLayoutPhone.css";

interface StudioLayoutPhoneProps {
  step: AppStep;
  children: ReactNode;
}

const STEP_FOOTER: Record<Exclude<AppStep, "landing">, string> = {
  setup: "Whole-movie settings",
  beats: "Beat-by-beat editing",
};

export function StudioLayoutPhone({ step, children }: StudioLayoutPhoneProps) {
  return (
    <div className="studio-phone">
      <div className="studio-phone__glow studio-phone__glow--left" aria-hidden="true" />
      <header className="studio-phone__header">
        <div className="studio-phone__brand">
          <span className="studio-phone__mark" aria-hidden="true">
            ▶
          </span>
          <div>
            <p className="studio-phone__eyebrow">Production suite</p>
            <h1 className="studio-phone__title">AI Movie Studio</h1>
          </div>
        </div>
      </header>
      <main className="studio-phone__main">{children}</main>
      <footer className="studio-phone__footer">
        <span>{STEP_FOOTER[step as Exclude<AppStep, "landing">]}</span>
      </footer>
    </div>
  );
}
