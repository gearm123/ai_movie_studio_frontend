import "./BeatTimeline.css";

interface BeatTimelineProps {
  beatCount: number;
  activeBeatIndex: number;
  beatsFilled: boolean[];
  voiceToneLabels: string[];
  onSelectBeat: (index: number) => void;
}

export function BeatTimeline({
  beatCount,
  activeBeatIndex,
  beatsFilled,
  voiceToneLabels,
  onSelectBeat,
}: BeatTimelineProps) {
  return (
    <section className="beat-timeline" aria-label="Beat timeline">
      <div className="beat-timeline__header">
        <h3 className="beat-timeline__title">Timeline</h3>
        <p className="beat-timeline__hint">Select a beat to edit narration and parameters.</p>
      </div>
      <ol className="beat-timeline__track">
        {Array.from({ length: beatCount }, (_, index) => {
          const beatIndex = index + 1;
          const isActive = beatIndex === activeBeatIndex;
          const hasContent = beatsFilled[index];
          const toneLabel =
            voiceToneLabels[index] ||
            (hasContent ? "Draft" : "Empty");
          return (
            <li key={beatIndex} style={{ animationDelay: `${index * 40}ms` }}>
              <button
                type="button"
                className={
                  isActive
                    ? "beat-timeline__beat beat-timeline__beat--active"
                    : "beat-timeline__beat"
                }
                onClick={() => onSelectBeat(beatIndex)}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="beat-timeline__index">{beatIndex}</span>
                <span className="beat-timeline__bar" />
                <span className="beat-timeline__status">
                  {toneLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
