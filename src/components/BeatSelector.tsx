import { STUDIO_CONFIG, estimateDurationSeconds } from "../constants/studio";
import "./BeatSelector.css";

interface BeatSelectorProps {
  beatCount: number;
  onChange: (beatCount: number) => void;
}

export function BeatSelector({ beatCount, onChange }: BeatSelectorProps) {
  const { minBeats, maxBeats } = STUDIO_CONFIG;
  const estimatedDuration = estimateDurationSeconds(beatCount);

  return (
    <section className="beat-selector" aria-labelledby="beat-selector-title">
      <div className="beat-selector__intro">
        <p className="beat-selector__step">01 — Story structure</p>
        <h2 id="beat-selector-title" className="beat-selector__title">
          How many beats in your movie?
        </h2>
        <p className="beat-selector__copy">
          Each beat is one narrative moment: a visual shot paired with narration. More beats give
          richer storytelling; fewer beats keep the pace tight.
        </p>
      </div>

      <div className="beat-selector__control">
        <div className="beat-selector__value-row">
          <button
            type="button"
            className="beat-selector__stepper"
            onClick={() => onChange(beatCount - 1)}
            disabled={beatCount <= minBeats}
            aria-label="Decrease beat count"
          >
            −
          </button>

          <div className="beat-selector__display">
            <span className="beat-selector__count">{beatCount}</span>
            <span className="beat-selector__label">{beatCount === 1 ? "beat" : "beats"}</span>
          </div>

          <button
            type="button"
            className="beat-selector__stepper"
            onClick={() => onChange(beatCount + 1)}
            disabled={beatCount >= maxBeats}
            aria-label="Increase beat count"
          >
            +
          </button>
        </div>

        <label className="beat-selector__slider-label" htmlFor="beat-count-slider">
          Drag to adjust
        </label>
        <input
          id="beat-count-slider"
          className="beat-selector__slider"
          type="range"
          min={minBeats}
          max={maxBeats}
          step={1}
          value={beatCount}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <div className="beat-selector__range-labels">
          <span>{minBeats} min</span>
          <span>{maxBeats} max</span>
        </div>
      </div>

      <div className="beat-selector__meta">
        <div className="beat-selector__meta-card">
          <span className="beat-selector__meta-label">Estimated runtime</span>
          <strong className="beat-selector__meta-value">~{estimatedDuration}s</strong>
        </div>
        <div className="beat-selector__meta-card">
          <span className="beat-selector__meta-label">Format</span>
          <strong className="beat-selector__meta-value">Vertical short</strong>
        </div>
      </div>
    </section>
  );
}
