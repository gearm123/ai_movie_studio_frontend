import type { MovieProjectDraft } from "../types/project";
import { BeatSelector } from "./BeatSelector";
import { BeatTimeline } from "./BeatTimeline";
import "./ProjectPanel.css";

interface ProjectPanelProps {
  draft: MovieProjectDraft;
  onBeatCountChange: (beatCount: number) => void;
}

export function ProjectPanel({ draft, onBeatCountChange }: ProjectPanelProps) {
  return (
    <div className="project-panel">
      <div className="project-panel__primary">
        <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
      </div>
      <aside className="project-panel__aside">
        <BeatTimeline beatCount={draft.beatCount} />
        <div className="project-panel__next">
          <p className="project-panel__next-label">Coming next</p>
          <ul className="project-panel__next-list">
            <li>Choose your subject &amp; style</li>
            <li>Generate narration &amp; visuals</li>
            <li>Review and export your movie</li>
          </ul>
          <button type="button" className="project-panel__cta" disabled>
            Continue — more parameters soon
          </button>
        </div>
      </aside>
    </div>
  );
}
