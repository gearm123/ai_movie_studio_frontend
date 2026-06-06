import {
  FIGURE_STYLE_PRESETS,
  getFigureDisplayLabel,
  getMovieType,
  getVoiceLabel,
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
  if (!key || key === "auto") return getVoiceLabel("gary");
  return getVoiceLabel(key);
}

export function ProjectPanelBrowser({
  draft,
  onBeatCountChange,
  onBeatTextChange,
  onBeatVisualChange,
  onBack,
}: ProjectPanelProps) {
  const isCustom = draft.settings.visual_style === "custom";
  const showCustomVisuals = isCustom && !isBundledCustomTopic(draft.settings.topic);
  const beatsWithText = draft.beats.filter((beat) => beat.narration.trim()).length;
  const customVisualsReady = showCustomVisuals
    ? draft.beats.every((beat) => Boolean(beat.custom_visual_url))
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
          <h2 className="beats-browser__title">Your movie script</h2>
          {isProcessing ? (
            <p className="beats-browser__processing-note">Video generation in progress</p>
          ) : null}
        </div>
        <button type="button" className="beats-browser__back" onClick={onBack} disabled={isBusy}>
          Back to setup
        </button>
      </div>

      <div className="beats-browser__structure">
        <BeatSelector beatCount={draft.beatCount} onChange={onBeatCountChange} />
      </div>

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
          showCustomVisuals={showCustomVisuals}
          onBeatTextChange={onBeatTextChange}
          onBeatVisualChange={onBeatVisualChange}
        />
      </div>

      <aside className="beats-browser__aside">
        <PunctuationNotice />
        <div className="beats-browser__summary">
          <p className="beats-browser__summary-label">From setup</p>
          <dl className="beats-browser__summary-list">
            <div>
              <dt>{draft.settings.figure_source === "template" ? "Template" : "Figure"}</dt>
              <dd>{getFigureDisplayLabel(draft.settings)}</dd>
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
          </dl>

          <p className="beats-browser__summary-label">Beat progress</p>
          <dl className="beats-browser__summary-list">
            <div>
              <dt>Beats with text</dt>
              <dd>
                {beatsWithText} / {draft.beatCount}
              </dd>
            </div>
            {showCustomVisuals ? (
              <div>
                <dt>Beat images</dt>
                <dd>
                  {draft.beats.filter((beat) => beat.custom_visual_url).length} / {draft.beatCount}
                </dd>
              </div>
            ) : null}
          </dl>

          {!customVisualsReady && showCustomVisuals ? (
            <p className="beats-browser__summary-note">
              Upload one image for every beat before generating.
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
