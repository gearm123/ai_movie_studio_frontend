import type { MovieType, ProjectSettings } from "../types/project";
import { MOVIE_TYPES, getMovieType } from "../constants/parameters";
import { ProjectSettingsPanel } from "../components/ProjectSettings";
import { SelectField } from "../components/ParameterField";
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
  const movieType = getMovieType(settings.movie_type);

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
      </div>

      <ProjectSettingsPanel settings={settings} onChange={onChange} />

      <div className="project-setup__actions">
        <button type="button" className="project-setup__back" onClick={onBack}>
          Back
        </button>
        <button type="button" className="project-setup__continue" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}
