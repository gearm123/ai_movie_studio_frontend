import type { MovieType, ProjectSettings } from "../types/project";
import {
  MOVIE_TYPES,
  NARRATORS,
  STYLE_PRESETS,
  getMovieType,
  getNarrator,
  getVisualStyleOption,
} from "../constants/parameters";
import { MovieStyleToggle } from "../components/MovieStyleToggle";
import { SelectField, TextField } from "../components/ParameterField";
import "./ProjectSetupPage.css";

interface ProjectSetupPageProps {
  settings: ProjectSettings;
  onChange: (patch: Partial<ProjectSettings>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ProjectSetupPage({
  settings,
  onChange,
  onBack,
  onContinue,
}: ProjectSetupPageProps) {
  const narrator = getNarrator(settings.narrator);
  const movieType = getMovieType(settings.movie_type);
  const visualStyle = getVisualStyleOption(settings.visual_style);

  return (
    <section className="project-setup" aria-labelledby="project-setup-title">
      <div className="project-setup__header">
        <p className="project-setup__step">Step 2 of 3</p>
        <h2 id="project-setup-title" className="project-setup__title">
          Set up your movie
        </h2>
        <p className="project-setup__copy">
          Choose settings that apply to the whole video. Beat-by-beat editing comes next.
        </p>
      </div>

      <div className="project-setup__card">
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

        <SelectField
          label="Narrator"
          hint={narrator.description}
          value={settings.narrator}
          options={NARRATORS.map((item) => ({
            value: item.key,
            label: item.label,
          }))}
          onChange={(value) => onChange({ narrator: value })}
        />

        <div className="project-setup__field">
          <span className="project-setup__field-label">Movie style</span>
          <p className="project-setup__field-hint">{visualStyle.description}</p>
          <MovieStyleToggle
            value={settings.visual_style}
            onChange={(visual_style) => onChange({ visual_style })}
          />
        </div>

        <TextField
          label="Topic / figure"
          hint="Optional — e.g. my_mysteriosgrandfather"
          value={settings.topic}
          placeholder="my_mysteriosgrandfather"
          onChange={(value) => onChange({ topic: value })}
        />

        <SelectField
          label="Style preset"
          value={settings.style_preset}
          options={STYLE_PRESETS.map((preset) => ({
            value: preset.key,
            label: preset.title,
          }))}
          onChange={(value) => onChange({ style_preset: value })}
        />
      </div>

      <div className="project-setup__actions">
        <button type="button" className="project-setup__back" onClick={onBack}>
          Back
        </button>
        <button type="button" className="project-setup__continue" onClick={onContinue}>
          Continue to beats
        </button>
      </div>
    </section>
  );
}
