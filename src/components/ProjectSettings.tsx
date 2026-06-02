import type { ProjectSettings } from "../types/project";
import {
  DELIVERY_PROFILES,
  NARRATORS,
  OUTPUT_MODES,
  STYLE_PRESETS,
  getNarrator,
  getVisualStyleOption,
} from "../constants/parameters";
import { VisualStyleSelector } from "./VisualStyleSelector";
import { NumberField, SelectField, TextField } from "./ParameterField";
import "./ProjectSettings.css";

interface ProjectSettingsPanelProps {
  settings: ProjectSettings;
  beatCount: number;
  onChange: (patch: Partial<ProjectSettings>) => void;
}

export function ProjectSettingsPanel({ settings, beatCount, onChange }: ProjectSettingsPanelProps) {
  const selectedNarrator = getNarrator(settings.narrator);

  return (
    <section className="project-settings" aria-labelledby="project-settings-title">
      <h2 id="project-settings-title" className="project-settings__title">
        Project parameters
      </h2>
      <p className="project-settings__copy">
        Matches backend CLI / job settings. Backend wiring comes in a later step.
      </p>

      <div className="project-settings__narration">
        <h3 className="project-settings__section-title">Narration</h3>
        <SelectField
          label="Narrator"
          hint={selectedNarrator.description}
          value={settings.narrator}
          options={NARRATORS.map((narrator) => ({
            value: narrator.key,
            label: narrator.label,
          }))}
          onChange={(value) => onChange({ narrator: value })}
        />
        <p className="project-settings__narrator-meta">
          Backend voice id: <code>{settings.voice}</code>
          {NARRATORS.length === 1 ? " · More narrators can be added later." : null}
        </p>
      </div>

      <div className="project-settings__visual">
        <h3 className="project-settings__section-title">Visual style</h3>
        <VisualStyleSelector
          value={settings.visual_style}
          onChange={(visual_style) => onChange({ visual_style })}
        />
        <p className="project-settings__visual-meta">
          {getVisualStyleOption(settings.visual_style).description}
          {" "}
          Backend: <code>SKIP_IMAGE_TO_VIDEO={settings.skip_image_to_video ? "1" : "0"}</code>
        </p>
      </div>

      <div className="project-settings__grid">
        <TextField
          label="Topic / figure"
          hint="CLI topic slug, e.g. my_mysteriosgrandfather"
          value={settings.topic}
          placeholder="my_mysteriosgrandfather"
          onChange={(value) => onChange({ topic: value })}
        />
        <SelectField
          label="Style preset"
          value={settings.style_preset}
          options={STYLE_PRESETS.map((preset) => ({ value: preset.key, label: preset.title }))}
          onChange={(value) => onChange({ style_preset: value })}
        />
        <SelectField
          label="Output mode"
          value={settings.mode}
          options={OUTPUT_MODES.map((mode) => ({ value: mode.key, label: mode.label }))}
          onChange={(value) => onChange({ mode: value as ProjectSettings["mode"] })}
        />
        <NumberField
          label="Target duration (sec)"
          hint={`Approx. ${beatCount} beats × ~4s in UI preview`}
          value={settings.duration}
          min={4}
          max={120}
          step={1}
          onChange={(value) => onChange({ duration: value })}
        />
        <SelectField
          label="Delivery profile"
          hint="NARRATION_DELIVERY_PROFILE — global narration pacing"
          value={settings.delivery_profile}
          options={DELIVERY_PROFILES.map((profile) => ({
            value: profile.key,
            label: profile.label,
          }))}
          onChange={(value) =>
            onChange({ delivery_profile: value as ProjectSettings["delivery_profile"] })
          }
        />
      </div>

      <fieldset className="project-settings__toggles">
        <legend>Composition toggles</legend>
        <label className="project-settings__toggle">
          <input
            type="checkbox"
            checked={settings.interpolate}
            onChange={(event) => onChange({ interpolate: event.target.checked })}
          />
          <span>Frame interpolation in compose</span>
        </label>
        <label className="project-settings__toggle">
          <input
            type="checkbox"
            checked={settings.brand_show}
            onChange={(event) => onChange({ brand_show: event.target.checked })}
          />
          <span>Brand show intro</span>
        </label>
        <label className="project-settings__toggle">
          <input
            type="checkbox"
            checked={settings.to_be_continued}
            onChange={(event) => onChange({ to_be_continued: event.target.checked })}
          />
          <span>To be continued outro card</span>
        </label>
        <label className="project-settings__toggle">
          <input
            type="checkbox"
            checked={settings.israel_war_hero}
            onChange={(event) => onChange({ israel_war_hero: event.target.checked })}
          />
          <span>Israel war hero identity still</span>
        </label>
      </fieldset>
    </section>
  );
}
