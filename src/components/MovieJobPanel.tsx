import type { JobRecord } from "../api/types";
import "./MovieJobPanel.css";

interface MovieJobPanelProps {
  job: JobRecord | null;
  phase: "idle" | "submitting" | "polling" | "ready" | "error";
  error: string | null;
  videoUrl: string | null;
  isBusy: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  queued: "Queued",
  running: "Generating…",
  succeeded: "Complete",
  failed: "Failed",
};

export function MovieJobPanel({
  job,
  phase,
  error,
  videoUrl,
  isBusy,
  onGenerate,
  onReset,
}: MovieJobPanelProps) {
  const showVideo = phase === "ready" && videoUrl;

  return (
    <div className="movie-job">
      <button
        type="button"
        className="movie-job__cta"
        onClick={onGenerate}
        disabled={isBusy}
      >
        {phase === "submitting" ? "Starting…" : phase === "polling" ? "Generating…" : "Generate movie"}
      </button>

      {error ? (
        <p className="movie-job__error" role="alert">
          {error}
        </p>
      ) : null}

      {job ? (
        <p className="movie-job__status">
          Status: <strong>{STATUS_LABEL[job.status] ?? job.status}</strong>
          {job.id ? <span className="movie-job__id"> · {job.id.slice(0, 8)}</span> : null}
        </p>
      ) : null}

      {showVideo ? (
        <div className="movie-job__player-wrap">
          <p className="movie-job__player-label">Your movie</p>
          <video className="movie-job__player" src={videoUrl} controls playsInline />
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
