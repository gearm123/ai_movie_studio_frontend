import type { MovieProjectDraft } from "../types/project";
import { getMovieType, getNarrator, getOutputResolution, getVisualStyleOption } from "../constants/parameters";
import { BeatEditor } from "./BeatEditor";
import { BeatSelector } from "./BeatSelector";
import { PunctuationNotice } from "./PunctuationNotice";
import "./ProjectPanel.css";

interface ProjectPanelProps {
  draft: MovieProjectDraft;
  onBeatCountChange: (beatCount: number) => void;
  onBeatTextChange: (beatIndex: number, text: string) => void;
  onBack: () => void;
}

export function ProjectPanel({
  draft,
  onBeatCountChange,
  onBeatTextChange,
  onBack,
}: ProjectPanelProps) {
  const beatsFilled = draft.beats.map((beat) => Boolean(beat.narration.trim()));

  return (
    <div className="project-panel">
      <div className="project-panel__top">
        <div>
          <h2 className="project-panel__title">Your movie script</h2>
        </div>
        <button type="button" className="project-panel__back" onClick={onBack}>
          Back to setup
        </button>
      </div>

      <div className="project-panel__structure">
        <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
      </div>

      <div className="project-panel__workspace">
        <BeatEditor beats={draft.beats} onBeatTextChange={onBeatTextChange} />
      </div>

      <aside className="project-panel__aside">
        <PunctuationNotice />
        <div className="project-panel__summary">
          <p className="project-panel__summary-label">Movie summary</p>
          <dl className="project-panel__summary-list">
            <div>
              <dt>Movie type</dt>
              <dd>{getMovieType(draft.settings.movie_type).label}</dd>
            </div>
            <div>
              <dt>Narrator</dt>
              <dd>{getNarrator(draft.settings.narrator).label}</dd>
            </div>
            <div>
              <dt>Movie style</dt>
              <dd>{getVisualStyleOption(draft.settings.visual_style).label}</dd>
            </div>
            <div>
              <dt>Output resolution</dt>
              <dd>{getOutputResolution(draft.settings.output_resolution).label}</dd>
            </div>
            <div>
              <dt>Beats with text</dt>
              <dd>
                {beatsFilled.filter(Boolean).length} / {draft.beatCount}
              </dd>
            </div>
          </dl>
          <button type="button" className="project-panel__cta" disabled>
            Generate movie — backend connection next
          </button>
        </div>
      </aside>
    </div>
  );
}
