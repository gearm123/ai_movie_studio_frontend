import type { MovieProjectDraft } from "../types/project";
import { getNarrator, getVisualStyleOption } from "../constants/parameters";
import { BeatEditor } from "./BeatEditor";
import { BeatSelector } from "./BeatSelector";
import { BeatStoryboard } from "./BeatStoryboard";
import "./ProjectPanel.css";

interface ProjectPanelProps {
  draft: MovieProjectDraft;
  activeBeatIndex: number;
  onBeatCountChange: (beatCount: number) => void;
  onSelectBeat: (index: number) => void;
  onBeatUpdate: (beatIndex: number, patch: Partial<MovieProjectDraft["beats"][number]>) => void;
  onBeatAudioParamChange: (
    beatIndex: number,
    key: keyof MovieProjectDraft["beats"][number]["audio_params"],
    value: string,
  ) => void;
  onBeatCompositionParamChange: (
    beatIndex: number,
    key: keyof MovieProjectDraft["beats"][number]["composition"],
    value: string,
  ) => void;
  onBack: () => void;
}

export function ProjectPanel({
  draft,
  activeBeatIndex,
  onBeatCountChange,
  onSelectBeat,
  onBeatUpdate,
  onBeatAudioParamChange,
  onBeatCompositionParamChange,
  onBack,
}: ProjectPanelProps) {
  const activeBeat = draft.beats.find((beat) => beat.index === activeBeatIndex) ?? draft.beats[0];
  const beatsFilled = draft.beats.map((beat) => Boolean(beat.narration.trim()));

  return (
    <div className="project-panel">
      <div className="project-panel__top">
        <div>
          <p className="project-panel__step">Step 3 of 3</p>
          <h2 className="project-panel__title">Edit beats</h2>
        </div>
        <button type="button" className="project-panel__back" onClick={onBack}>
          Back to setup
        </button>
      </div>

      <div className="project-panel__structure">
        <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
      </div>

      <div className="project-panel__workspace">
        {activeBeat ? (
          <BeatEditor
            beat={activeBeat}
            beatCount={draft.beatCount}
            stylePreset={draft.settings.style_preset}
            narratorKey={draft.settings.narrator}
            projectVisualStyle={draft.settings.visual_style}
            onUpdate={(patch) => onBeatUpdate(activeBeat.index, patch)}
            onAudioParamChange={(key, value) =>
              onBeatAudioParamChange(activeBeat.index, key, value)
            }
            onCompositionParamChange={(key, value) =>
              onBeatCompositionParamChange(activeBeat.index, key, value)
            }
          />
        ) : null}
      </div>

      <aside className="project-panel__aside">
        <BeatStoryboard
          beats={draft.beats}
          activeBeatIndex={activeBeatIndex}
          projectVisualStyle={draft.settings.visual_style}
          onSelectBeat={onSelectBeat}
        />
        <div className="project-panel__summary">
          <p className="project-panel__summary-label">Movie summary</p>
          <dl className="project-panel__summary-list">
            <div>
              <dt>Narrator</dt>
              <dd>{getNarrator(draft.settings.narrator).label}</dd>
            </div>
            <div>
              <dt>Movie style</dt>
              <dd>{getVisualStyleOption(draft.settings.visual_style).label}</dd>
            </div>
            <div>
              <dt>Beats with narration</dt>
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
