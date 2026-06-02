import "./BeatTimeline.css";

interface BeatTimelineProps {
  beatCount: number;
}

export function BeatTimeline({ beatCount }: BeatTimelineProps) {
  return (
    <section className="beat-timeline" aria-label="Beat timeline preview">
      <div className="beat-timeline__header">
        <h3 className="beat-timeline__title">Timeline preview</h3>
        <p className="beat-timeline__hint">Each block is one beat in your film.</p>
      </div>
      <ol className="beat-timeline__track">
        {Array.from({ length: beatCount }, (_, index) => (
          <li key={index} className="beat-timeline__beat" style={{ animationDelay: `${index * 60}ms` }}>
            <span className="beat-timeline__index">{index + 1}</span>
            <span className="beat-timeline__bar" />
          </li>
        ))}
      </ol>
    </section>
  );
}
