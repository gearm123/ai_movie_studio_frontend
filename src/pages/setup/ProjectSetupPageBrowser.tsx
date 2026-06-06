import { ProjectSettingsPanel } from "../../components/ProjectSettings";
import type { ProjectSetupPageProps } from "./types";
import { validateSetupSettings } from "../../utils/jobRequest";
import "./ProjectSetupPageBrowser.css";

export function ProjectSetupPageBrowser({
  settings,
  onChange,
  onBack,
  onContinue,
  setupError,
}: ProjectSetupPageProps) {
  return (
    <section className="setup-browser" aria-labelledby="setup-browser-title">
      <div className="setup-browser__header">
        <p className="setup-browser__step">Step 2 of 3</p>
        <h2 id="setup-browser-title" className="setup-browser__title">
          Configure your video
        </h2>
        <p className="setup-browser__copy">
          These settings become the backend pipeline command — style, voice, duration, and visual
          mode. Pick an existing figure template to reuse its blueprint, or enter a new figure name
          to create one; the next step shapes that blueprint.
        </p>
      </div>

      <ProjectSettingsPanel settings={settings} onChange={onChange} />

      <div className="setup-browser__footer">
        {setupError ? (
          <p className="setup-browser__error" role="alert">
            {setupError}
          </p>
        ) : null}
        <div className="setup-browser__actions">
          <button type="button" className="setup-browser__back" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="setup-browser__continue"
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
