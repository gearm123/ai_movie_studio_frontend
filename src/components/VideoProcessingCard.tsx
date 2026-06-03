import type { JobRecord, JobStatus } from "../api/types";
import "./VideoProcessingCard.css";

interface VideoProcessingCardProps {
  phase: "submitting" | "polling" | "loading_video";
  job: JobRecord | null;
  elapsedSeconds: number;
  logTail: string | null;
}

const STEP_LABELS = [
  "Send request to server",
  "Plan story & beats",
  "Generate visuals & narration",
  "Compose final video",
] as const;

function stepIndex(status: JobStatus | undefined, phase: VideoProcessingCardProps["phase"]): number {
  if (phase === "submitting") {
    return 0;
  }
  if (phase === "loading_video") {
    return 3;
  }
  if (status === "queued") {
    return 1;
  }
  if (status === "running") {
    return 2;
  }
  return 1;
}

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function headline(phase: VideoProcessingCardProps["phase"], status: JobStatus | undefined): string {
  if (phase === "submitting") {
    return "Starting your movie…";
  }
  if (phase === "loading_video") {
    return "Almost done — loading your video…";
  }
  if (status === "queued") {
    return "Your video is queued";
  }
  return "Your video is being processed";
}

function subcopy(phase: VideoProcessingCardProps["phase"]): string {
  if (phase === "loading_video") {
    return "The movie finished rendering. We are fetching it for playback.";
  }
  return "Please keep this tab open. This can take several minutes on the server. Do not click Generate again.";
}

export function VideoProcessingCard({ phase, job, elapsedSeconds, logTail }: VideoProcessingCardProps) {
  const activeStep = stepIndex(job?.status, phase);

  return (
    <section
      className="video-processing"
      aria-live="polite"
      aria-busy="true"
      aria-label="Video processing status"
    >
      <div className="video-processing__pulse" aria-hidden="true" />
      <div className="video-processing__inner">
        <div className="video-processing__spinner" aria-hidden="true" />

        <div className="video-processing__head">
          <p className="video-processing__eyebrow">Processing</p>
          <h3 className="video-processing__title">{headline(phase, job?.status)}</h3>
          <p className="video-processing__copy">{subcopy(phase)}</p>
        </div>

        <div className="video-processing__meta">
          <span className="video-processing__elapsed">
            Elapsed: <strong>{formatElapsed(elapsedSeconds)}</strong>
          </span>
          {job?.id ? (
            <span className="video-processing__job-id">Job {job.id.slice(0, 8)}</span>
          ) : null}
        </div>

        <ol className="video-processing__steps">
          {STEP_LABELS.map((label, index) => {
            const state =
              index < activeStep ? "done" : index === activeStep ? "active" : "pending";
            return (
              <li
                key={label}
                className={`video-processing__step video-processing__step--${state}`}
              >
                <span className="video-processing__step-mark" aria-hidden="true">
                  {state === "done" ? "✓" : index + 1}
                </span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>

        {logTail ? (
          <details className="video-processing__log-details">
            <summary>Pipeline activity</summary>
            <pre className="video-processing__log">{logTail}</pre>
          </details>
        ) : null}
      </div>
    </section>
  );
}
