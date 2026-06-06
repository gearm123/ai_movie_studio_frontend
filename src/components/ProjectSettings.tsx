import type { ProjectSettings } from "../types/project";

import {

  FIGURE_STYLE_PRESETS,

  VOICE_OPTIONS,

  getVisualStyleOption,

} from "../constants/parameters";

import { VisualStyleSelector } from "./VisualStyleSelector";

import { NumberField, SelectField, TextField } from "./ParameterField";

import "./ProjectSettings.css";



interface ProjectSettingsPanelProps {

  settings: ProjectSettings;

  onChange: (patch: Partial<ProjectSettings>) => void;

}



export function ProjectSettingsPanel({ settings, onChange }: ProjectSettingsPanelProps) {

  const visualOption = getVisualStyleOption(settings.visual_style);



  return (

    <section className="project-settings" aria-labelledby="project-settings-title">

      <h2 id="project-settings-title" className="project-settings__title">

        Video settings

      </h2>

      <p className="project-settings__copy">

        These match the local CLI flags for figure videos: topic, style preset, voice, duration, and

        visual path.

      </p>



      <div className="project-settings__grid">

        <TextField

          label="Historical figure / topic"

          hint="CLI topic slug — e.g. ragnar, kahalani, my_mysteriosgrandfather"

          value={settings.topic}

          placeholder="ragnar"

          onChange={(value) => onChange({ topic: value })}

        />

        <SelectField

          label="Video style"

          hint="Maps to --style-preset (TikTok is the default local style)"

          value={settings.style_preset}

          options={FIGURE_STYLE_PRESETS.map((preset) => ({ value: preset.key, label: preset.title }))}

          onChange={(value) => onChange({ style_preset: value })}

        />

        <SelectField

          label="Narration voice"

          hint="Maps to CLI --voice"

          value={settings.voice}

          options={VOICE_OPTIONS.map((voice) => ({ value: voice.key, label: voice.label }))}

          onChange={(value) => onChange({ voice: value })}

        />

        <NumberField

          label="Video duration (sec)"

          hint="Maps to CLI --duration"

          value={settings.duration}

          min={4}

          max={120}

          step={1}

          onChange={(value) => onChange({ duration: value })}

        />

      </div>



      <div className="project-settings__visual">

        <h3 className="project-settings__section-title">Visuals per beat</h3>

        <VisualStyleSelector

          value={settings.visual_style}

          onChange={(visual_style) => onChange({ visual_style })}

        />

        <p className="project-settings__visual-meta">{visualOption.description}</p>

      </div>



      <details className="project-settings__advanced">

        <summary>Advanced composition options</summary>

        <fieldset className="project-settings__toggles">

          <legend className="sr-only">Composition toggles</legend>

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

      </details>

    </section>

  );

}


