import { ProjectSettingsPanel } from "../../components/ProjectSettings";
import type { ProjectSetupPageProps } from "./types";
import { validateSetupSettings } from "../../utils/jobRequest";
import "./ProjectSetupPagePhone.css";

export function ProjectSetupPagePhone({
  settings,
  onChange,
  onBack,
  onContinue,
  setupError,
}: ProjectSetupPageProps) {
  return (
    <section className="setup-phone" aria-labelledby="setup-phone-title">
      <div className="setup-phone__header">
        <p className="setup-phone__step">Step 2 of 3</p>
        <h2 id="setup-phone-title" className="setup-phone__title">
          Configure your video
        </h2>
        <p className="setup-phone__copy">
          These settings become the backend pipeline command — style, voice, duration, and visual
          mode. Pick an existing figure template to reuse its blueprint, or enter a new figure name
          to create one; the next step shapes that blueprint.
        </p>
      </div>

      <ProjectSettingsPanel settings={settings} onChange={onChange} />

      <div className="setup-phone__footer">
        {setupError ? (
          <p className="setup-phone__error" role="alert">
            {setupError}
          </p>
        ) : null}
        <div className="setup-phone__actions">
          <button type="button" className="setup-phone__back" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="setup-phone__continue"
            onClick={onContinue}
            disabled={Boolean(validateSetupSettings(settings))}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
