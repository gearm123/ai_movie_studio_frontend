import type { MovieType } from "../../types/project";
import { MOVIE_TYPES, getMovieType } from "../../constants/parameters";
import { ProjectSettingsPanel } from "../../components/ProjectSettings";
import { SelectField } from "../../components/ParameterField";
import type { ProjectSetupPageProps } from "./types";
import "./ProjectSetupPagePhone.css";

export function ProjectSetupPagePhone({
  settings,
  onChange,
  onBack,
  onContinue,
}: ProjectSetupPageProps) {
  const movieType = getMovieType(settings.movie_type);

  return (
    <section className="setup-phone" aria-labelledby="setup-phone-title">
      <div className="setup-phone__header">
        <p className="setup-phone__step">Step 2 of 3</p>
        <h2 id="setup-phone-title" className="setup-phone__title">
          Set up your movie
        </h2>
        <p className="setup-phone__copy">
          Choose settings that apply to the whole video. Beat-by-beat editing comes next.
        </p>
      </div>

      <div className="setup-phone__card">
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

      <div className="setup-phone__actions">
        <button type="button" className="setup-phone__back" onClick={onBack}>
          Back
        </button>
        <button type="button" className="setup-phone__continue" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}
