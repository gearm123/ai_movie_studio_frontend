import type { VisualStyle } from "../types/project";
import { getVisualStyleOption } from "../constants/parameters";
import "./BeatPreview.css";

interface BeatPreviewProps {
  beatIndex: number;
  visualStyle: VisualStyle;
  narration: string;
  visualPrompt: string;
  compact?: boolean;
}

function excerpt(text: string, max = 120): string {
  const trimmed = text.trim();
  if (!trimmed) return "No narration yet…";
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

export function BeatPreview({
  beatIndex,
  visualStyle,
  narration,
  visualPrompt,
  compact = false,
}: BeatPreviewProps) {
  const styleOption = getVisualStyleOption(visualStyle);
  const isVideo = visualStyle === "video";

  return (
    <div className={compact ? "beat-preview beat-preview--compact" : "beat-preview"}>
      <div
        className={
          isVideo
            ? "beat-preview__frame beat-preview__frame--video"
            : "beat-preview__frame beat-preview__frame--image"
        }
        aria-hidden="true"
      >
        <div className="beat-preview__frame-inner">
          <span className="beat-preview__frame-badge">{styleOption.label}</span>
          <span className="beat-preview__frame-label">
            {visualPrompt.trim() || `Beat ${beatIndex} visual`}
          </span>
          {isVideo ? <span className="beat-preview__motion-lines" /> : null}
        </div>
      </div>
      <div className="beat-preview__narration">
        <span className="beat-preview__narration-label">Narration</span>
        <p>{excerpt(narration, compact ? 80 : 140)}</p>
      </div>
    </div>
  );
}
