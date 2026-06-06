import type { FigureSource, MovieType, ProjectSettings } from "../types/project";
import {
  FIGURE_TEMPLATE_SELECT_OPTIONS,
  FIGURE_STYLE_PRESETS,
  MOVIE_TYPES,
  VOICE_OPTIONS,
  getMovieType,
} from "../constants/parameters";
import { VisualStyleSelector } from "./VisualStyleSelector";
import { NumberField, SelectField, TextField } from "./ParameterField";
import "./ProjectSettings.css";

interface ProjectSettingsPanelProps {
  settings: ProjectSettings;
  onChange: (patch: Partial<ProjectSettings>) => void;
}

export function ProjectSettingsPanel({ settings, onChange }: ProjectSettingsPanelProps) {
  const movieType = getMovieType(settings.movie_type);

  return (
    <section className="project-settings" aria-labelledby="project-settings-title">
      <h2 id="project-settings-title" className="sr-only">
        Video configuration
      </h2>

      <div className="project-settings__section">
        <h3 className="project-settings__section-title">Movie</h3>
        <div className="project-settings__grid project-settings__grid--single">
          <SelectField
            label="Movie type"
            hint={movieType.description}
            value={settings.movie_type}
            options={MOVIE_TYPES.map((item) => ({
              value: item.key,
              label: item.label,
            }))}
            onChange={(value) => onChange({ movie_type: value as MovieType })}
          />
        </div>
      </div>

      <div className="project-settings__section">
        <h3 className="project-settings__section-title">Story &amp; narration</h3>
        <div className="project-settings__grid">
          <div className="project-settings__figure">
            <fieldset className="project-settings__figure-fieldset">
              <legend className="project-settings__figure-legend">Figure</legend>
              <div
                className="project-settings__figure-mode"
                role="radiogroup"
                aria-label="Figure source"
              >
                <label className="project-settings__figure-mode-option">
                  <input
                    type="radio"
                    name="figure-source"
                    checked={settings.figure_source === "new"}
                    onChange={() => onChange({ figure_source: "new" satisfies FigureSource, topic: "" })}
                  />
                  <span>New figure blueprint</span>
                </label>
                <label className="project-settings__figure-mode-option">
                  <input
                    type="radio"
                    name="figure-source"
                    checked={settings.figure_source === "template"}
                    onChange={() =>
                      onChange({ figure_source: "template" satisfies FigureSource, topic: "" })
                    }
                  />
                  <span>Use existing template</span>
                </label>
              </div>
              {settings.figure_source === "new" ? (
                <TextField
                  label="Figure name"
                  hint="Creates a new figure blueprint for you — narration and punctuation contracts are built on the backend."
                  value={settings.topic}
                  placeholder="e.g. Eleanor Roosevelt"
                  onChange={(value) => onChange({ topic: value })}
                />
              ) : (
                <SelectField
                  label="Figure template"
                  hint="Pre-built blueprint with fixed narration and punctuation contracts — for reference, not re-generating the same video."
                  value={settings.topic}
                  options={FIGURE_TEMPLATE_SELECT_OPTIONS}
                  onChange={(value) => onChange({ topic: value })}
                />
              )}
            </fieldset>
          </div>
          <SelectField
            label="Video style"
            hint="Overall look and pacing — TikTok is the default"
            value={settings.style_preset}
            options={FIGURE_STYLE_PRESETS.map((preset) => ({ value: preset.key, label: preset.title }))}
            onChange={(value) => onChange({ style_preset: value })}
          />
          <SelectField
            label="Narration voice"
            hint="More voices will be added soon"
            value={settings.voice || "gary"}
            options={VOICE_OPTIONS.map((voice) => ({ value: voice.key, label: voice.label }))}
            onChange={(value) => onChange({ voice: value })}
          />
          <NumberField
            label="Video duration (sec)"
            hint="Total runtime for the whole video"
            value={settings.duration}
            min={4}
            max={120}
            step={1}
            onChange={(value) => onChange({ duration: value })}
          />
        </div>
      </div>

      <div className="project-settings__section project-settings__section--visual">
        <div className="project-settings__section-head">
          <h3 className="project-settings__section-title">Visual mode</h3>
          <p className="project-settings__section-hint">
            Text to image, text to video, or custom images (one upload per beat on the next page).
          </p>
        </div>
        <VisualStyleSelector
          value={settings.visual_style}
          onChange={(visual_style) => onChange({ visual_style })}
          layout="setup"
        />
      </div>

      <details className="project-settings__advanced">
        <summary>Advanced composition options</summary>
        <fieldset className="project-settings__toggles">
          <legend className="sr-only">Composition toggles</legend>
          <label className="project-settings__toggle">
            <input
              type="checkbox"
              checked={settings.to_be_continued}
              onChange={(event) => onChange({ to_be_continued: event.target.checked })}
            />
            <span>To be continued outro card</span>
          </label>
        </fieldset>
      </details>
    </section>
  );
}
