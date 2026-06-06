import type { BeatDraft, VisualStyle } from "../types/project";
import { getVisualStyleOption } from "../constants/parameters";
import { BeatPreview } from "./BeatPreview";
import "./BeatStoryboard.css";

interface BeatStoryboardProps {
  beats: BeatDraft[];
  activeBeatIndex: number;
  projectVisualStyle: VisualStyle;
  onSelectBeat: (index: number) => void;
}

export function BeatStoryboard({
  beats,
  activeBeatIndex,
  projectVisualStyle,
  onSelectBeat,
}: BeatStoryboardProps) {
  const styleLabel = getVisualStyleOption(projectVisualStyle).label;

  return (
    <section className="beat-storyboard" aria-label="Beat storyboard preview">
      <div className="beat-storyboard__header">
        <h3 className="beat-storyboard__title">Storyboard</h3>
        <p className="beat-storyboard__hint">
          {projectVisualStyle === "still"
            ? "Still image beats with narration."
            : projectVisualStyle === "animation"
              ? "Animated video beats with narration."
              : "Custom still per beat — no AI visuals."}
        </p>
      </div>
      <ol className="beat-storyboard__list">
        {beats.map((beat) => {
          const isActive = beat.index === activeBeatIndex;
          return (
            <li key={beat.index}>
              <button
                type="button"
                className={
                  isActive
                    ? "beat-storyboard__card beat-storyboard__card--active"
                    : "beat-storyboard__card"
                }
                onClick={() => onSelectBeat(beat.index)}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="beat-storyboard__card-head">
                  <span>Beat {beat.index}</span>
                  <span>{styleLabel}</span>
                </div>
                <BeatPreview
                  beatIndex={beat.index}
                  visualStyle={projectVisualStyle}
                  narration={beat.narration}
                  visualPrompt={beat.visual_prompt}
                  compact
                />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
