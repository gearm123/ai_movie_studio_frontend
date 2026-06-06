import type { BeatDraft, VisualStyle } from "../types/project";
import "./BeatEditor.css";

interface BeatEditorProps {
  beats: BeatDraft[];
  visualStyle: VisualStyle;
  onBeatVisualChange: (beatIndex: number, file: File | null) => void;
}

export function BeatEditor({ beats, visualStyle, onBeatVisualChange }: BeatEditorProps) {
  if (visualStyle !== "custom") {
    const visualLabel =
      visualStyle === "still"
        ? "Text to image — AI still per beat."
        : "Text to video — AI animated clip per beat.";

    return (
      <section className="beat-editor" aria-labelledby="beat-editor-title">
        <div className="beat-editor__header">
          <p className="beat-editor__step">Step 3 of 3</p>
          <h2 id="beat-editor-title" className="beat-editor__title">
            Ready to generate
          </h2>
          <p className="beat-editor__copy">
            You chose {visualStyle === "still" ? "text to image" : "text to video"} on the setup
            page. The backend runs the pipeline from those settings and generates visuals — no
            beat-by-beat editing needed here.
          </p>
        </div>
        <div className="beat-editor__info-card" role="status">
          <p>
            <strong>Visual mode:</strong> {visualLabel}
          </p>
          <p>
            <strong>Figure blueprint</strong> from setup (template or new name) drives narration and
            punctuation contracts on the backend.
          </p>
        </div>
      </section>
    );
  }

  const uploadedCount = beats.filter((beat) => beat.custom_visual_url).length;

  return (
    <section className="beat-editor" aria-labelledby="beat-editor-title">
      <div className="beat-editor__header">
        <p className="beat-editor__step">Step 3 of 3</p>
        <h2 id="beat-editor-title" className="beat-editor__title">
          Upload one image per beat
        </h2>
        <p className="beat-editor__copy">
          You chose custom images on the setup page. Upload a still for every beat below — the
          video uses your files instead of AI text-to-image or text-to-video.
        </p>
        <p className="beat-editor__progress" aria-live="polite">
          {uploadedCount} of {beats.length} beats have an image
        </p>
      </div>

      <ol className="beat-editor__list">
        {beats.map((beat) => (
          <li key={beat.index} className="beat-editor__item beat-editor__item--custom">
            <div className="beat-editor__custom-head">
              <strong>Beat {beat.index}</strong>
              {beat.custom_visual_name ? (
                <span className="beat-editor__file-name">{beat.custom_visual_name}</span>
              ) : (
                <span className="beat-editor__file-name beat-editor__file-name--empty">
                  Required — choose an image
                </span>
              )}
            </div>
            <div className="beat-editor__custom-body">
              {beat.custom_visual_url ? (
                <img
                  className="beat-editor__preview"
                  src={beat.custom_visual_url}
                  alt={`Beat ${beat.index} visual preview`}
                />
              ) : (
                <div className="beat-editor__preview beat-editor__preview--empty" aria-hidden="true">
                  beat_{String(beat.index).padStart(2, "0")}
                </div>
              )}
              <label className="beat-editor__upload">
                <span>{beat.custom_visual_url ? "Replace image" : "Upload image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    onBeatVisualChange(beat.index, file);
                    event.target.value = "";
                  }}
                />
              </label>
              {beat.custom_visual_url ? (
                <button
                  type="button"
                  className="beat-editor__clear"
                  onClick={() => onBeatVisualChange(beat.index, null)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
