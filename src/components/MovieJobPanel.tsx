import type { JobRecord } from "../api/types";
import "./MovieJobPanel.css";

interface MovieJobPanelProps {
  job: JobRecord | null;
  phase: "idle" | "submitting" | "polling" | "loading_video" | "ready" | "error";
  error: string | null;
  logTail: string | null;
  elapsedSeconds: number;
  videoUrl: string | null;
  isBusy: boolean;
  isProcessing: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

export function MovieJobPanel({
  job,
  phase,
  error,
  logTail,
  elapsedSeconds,
  videoUrl,
  isBusy,
  isProcessing,
  onGenerate,
  onReset,
}: MovieJobPanelProps) {
  const showVideo = phase === "ready" && videoUrl;

  return (
    <div className="movie-job">
      {isProcessing ? (
        <p className="movie-job__processing-sidebar">
          Generating… <strong>{elapsedSeconds}s</strong> — see progress in the main panel.
        </p>
      ) : null}

      {!isProcessing ? (
        <button
          type="button"
          className="movie-job__cta"
          onClick={onGenerate}
          disabled={isBusy}
        >
          Generate movie
        </button>
      ) : null}

      {error ? (
        <p className="movie-job__error" role="alert">
          {error}
        </p>
      ) : null}

      {phase === "error" && job ? (
        <p className="movie-job__status movie-job__status--failed">
          Last status: <strong>Failed</strong>
          {job.id ? <span className="movie-job__id"> · job {job.id.slice(0, 8)}</span> : null}
        </p>
      ) : null}

      {phase === "error" && logTail ? (
        <pre className="movie-job__log" aria-label="Pipeline log excerpt">
          {logTail}
        </pre>
      ) : null}

      {showVideo ? (
        <div className="movie-job__player-wrap">
          <p className="movie-job__player-label">Your movie is ready</p>
          <video className="movie-job__player" src={videoUrl} controls playsInline autoPlay />
          <a className="movie-job__download" href={videoUrl} download="movie.mp4">
            Download MP4
          </a>
        </div>
      ) : null}

      {phase === "ready" || phase === "error" ? (
        <button type="button" className="movie-job__reset" onClick={onReset}>
          Start over
        </button>
      ) : null}
    </div>
  );
}
