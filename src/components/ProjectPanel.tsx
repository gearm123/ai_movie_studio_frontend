import type { MovieProjectDraft } from "../types/project";
import { getMovieType, getNarrator, getVisualStyleOption } from "../constants/parameters";
import { useMovieJob } from "../hooks/useMovieJob";
import { isBackendUrlConfigured } from "../config/api";
import { BeatEditor } from "./BeatEditor";
import { BeatSelector } from "./BeatSelector";
import { MovieJobPanel } from "./MovieJobPanel";
import { PunctuationNotice } from "./PunctuationNotice";
import { VideoProcessingCard } from "./VideoProcessingCard";
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
  const {
    job,
    phase,
    error,
    logTail,
    elapsedSeconds,
    videoUrl,
    isBusy,
    isProcessing,
    startGeneration,
    reset,
  } = useMovieJob();
  const canGenerate = isBackendUrlConfigured();

  const showMainProcessing =
    phase === "submitting" || phase === "polling" || phase === "loading_video";

  return (
    <div className="project-panel">
      <div className="project-panel__top">
        <div>
          <h2 className="project-panel__title">Your movie script</h2>
          {isProcessing ? (
            <p className="project-panel__processing-note">Video generation in progress</p>
          ) : null}
        </div>
        <button type="button" className="project-panel__back" onClick={onBack} disabled={isBusy}>
          Back to setup
        </button>
      </div>

      <div className="project-panel__structure">
        <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
      </div>

      <div
        className={
          isProcessing
            ? "project-panel__workspace project-panel__workspace--dimmed"
            : "project-panel__workspace"
        }
      >
        {showMainProcessing ? (
          <VideoProcessingCard
            phase={phase}
            job={job}
            elapsedSeconds={elapsedSeconds}
            logTail={logTail}
          />
        ) : null}
        <BeatEditor beats={draft.beats} onBeatTextChange={onBeatTextChange} />
      </div>

      <aside className="project-panel__aside">
        <PunctuationNotice />
        <div className="project-panel__summary">
          <p className="project-panel__summary-label">Movie summary</p>
          <dl className="project-panel__summary-list">
            <div>
              <dt>Topic</dt>
              <dd>{draft.settings.topic.trim() || "—"}</dd>
            </div>
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
              <dt>Beats with text</dt>
              <dd>
                {beatsFilled.filter(Boolean).length} / {draft.beatCount}
              </dd>
            </div>
          </dl>
          <MovieJobPanel
            job={job}
            phase={phase}
            error={error}
            logTail={logTail}
            elapsedSeconds={elapsedSeconds}
            videoUrl={videoUrl}
            isBusy={isBusy}
            isProcessing={isProcessing}
            canGenerate={canGenerate}
            onGenerate={() => void startGeneration(draft)}
            onReset={reset}
          />
        </div>
      </aside>
    </div>
  );
}
