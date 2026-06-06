import {
  FIGURE_STYLE_PRESETS,
  VOICE_OPTIONS,
  getMovieType,
  getVisualStyleOption,
  isBundledCustomTopic,
} from "../../constants/parameters";
import { useMovieJob } from "../../hooks/useMovieJob";
import { isBackendUrlConfigured } from "../../config/api";
import { BeatEditor } from "../../components/BeatEditor";
import { BeatSelector } from "../../components/BeatSelector";
import { MovieJobPanel } from "../../components/MovieJobPanel";
import { PunctuationNotice } from "../../components/PunctuationNotice";
import { VideoProcessingCard } from "../../components/VideoProcessingCard";
import type { ProjectPanelProps } from "./types";
import "./ProjectPanelBrowser.css";

function stylePresetLabel(key: string): string {
  return FIGURE_STYLE_PRESETS.find((preset) => preset.key === key)?.title ?? key;
}

function voiceLabel(key: string): string {
  return VOICE_OPTIONS.find((voice) => voice.key === key)?.label ?? key;
}

export function ProjectPanelBrowser({
  draft,
  onBeatCountChange,
  onBeatVisualChange,
  onBack,
}: ProjectPanelProps) {
  const isCustom = draft.settings.visual_style === "custom";
  const customVisualsReady = isCustom
    ? isBundledCustomTopic(draft.settings.topic) ||
      draft.beats.every((beat) => Boolean(beat.custom_visual_url))
    : true;

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
    <div className="beats-browser">
      <div className="beats-browser__top">
        <div>
          <h2 className="beats-browser__title">{isCustom ? "Custom template" : "Generate video"}</h2>
          {isProcessing ? (
            <p className="beats-browser__processing-note">Video generation in progress</p>
          ) : null}
        </div>
        <button type="button" className="beats-browser__back" onClick={onBack} disabled={isBusy}>
          Back to setup
        </button>
      </div>

      {isCustom ? (
        <div className="beats-browser__structure">
          <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
        </div>
      ) : null}

      <div
        className={
          isProcessing
            ? "beats-browser__workspace beats-browser__workspace--dimmed"
            : "beats-browser__workspace"
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
        <BeatEditor
          beats={draft.beats}
          visualStyle={draft.settings.visual_style}
          onBeatVisualChange={onBeatVisualChange}
        />
      </div>

      <aside className="beats-browser__aside">
        {isCustom ? <PunctuationNotice /> : null}
        <div className="beats-browser__summary">
          <p className="beats-browser__summary-label">Movie summary</p>
          <dl className="beats-browser__summary-list">
            <div>
              <dt>Topic</dt>
              <dd>{draft.settings.topic.trim() || "—"}</dd>
            </div>
            <div>
              <dt>Movie type</dt>
              <dd>{getMovieType(draft.settings.movie_type).label}</dd>
            </div>
            <div>
              <dt>Video style</dt>
              <dd>{stylePresetLabel(draft.settings.style_preset)}</dd>
            </div>
            <div>
              <dt>Voice</dt>
              <dd>{voiceLabel(draft.settings.voice)}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{draft.settings.duration}s</dd>
            </div>
            <div>
              <dt>Visuals</dt>
              <dd>{getVisualStyleOption(draft.settings.visual_style).label}</dd>
            </div>
            {isCustom ? (
              <div>
                <dt>Beat visuals</dt>
                <dd>
                  {isBundledCustomTopic(draft.settings.topic)
                    ? "Server assets"
                    : `${draft.beats.filter((beat) => beat.custom_visual_url).length} / ${draft.beatCount}`}
                </dd>
              </div>
            ) : null}
          </dl>
          {!customVisualsReady && isCustom ? (
            <p className="beats-browser__summary-note">
              Add an image for every beat, or use a bundled topic like my_mysteriosgrandfather.
            </p>
          ) : null}
          <MovieJobPanel
            job={job}
            phase={phase}
            error={error}
            logTail={logTail}
            elapsedSeconds={elapsedSeconds}
            videoUrl={videoUrl}
            isBusy={isBusy}
            isProcessing={isProcessing}
            canGenerate={canGenerate && customVisualsReady}
            onGenerate={() => void startGeneration(draft)}
            onReset={reset}
          />
        </div>
      </aside>
    </div>
  );
}
