import type { BeatDraft, VisualStyle } from "../types/project";
import { TextAreaField } from "./ParameterField";
import "./BeatEditor.css";

interface BeatEditorProps {
  beats: BeatDraft[];
  visualStyle: VisualStyle;
  showCustomVisuals: boolean;
  onBeatTextChange: (beatIndex: number, text: string) => void;
  onBeatVisualChange: (beatIndex: number, file: File | null) => void;
}

export function BeatEditor({
  beats,
  visualStyle,
  showCustomVisuals,
  onBeatTextChange,
  onBeatVisualChange,
}: BeatEditorProps) {
  const beatsWithText = beats.filter((beat) => beat.narration.trim()).length;
  const uploadedCount = beats.filter((beat) => beat.custom_visual_url).length;

  return (
    <section className="beat-editor" aria-labelledby="beat-editor-title">
      <div className="beat-editor__header">
        <p className="beat-editor__step">Step 3 of 3</p>
        <h2 id="beat-editor-title" className="beat-editor__title">
          Write your beats
        </h2>
        <p className="beat-editor__copy">
          Setup choices are remembered in the summary. Add beat-by-beat story detail here — together
          with your figure name or template, this builds your figure blueprint.
        </p>
        <p className="beat-editor__progress" aria-live="polite">
          {beatsWithText} of {beats.length} beats have text
          {showCustomVisuals ? ` · ${uploadedCount} of ${beats.length} have an image` : null}
        </p>
      </div>

      <ol className="beat-editor__list">
        {beats.map((beat) => {
          const wordCount = beat.narration.trim() ? beat.narration.trim().split(/\s+/).length : 0;

          return (
            <li key={beat.index} className="beat-editor__item">
              <TextAreaField
                label={`Beat ${beat.index}`}
                hint="Narration for this moment in the story. Punctuation controls pacing."
                value={beat.narration}
                placeholder="Write what happens in this beat…"
                rows={4}
                onChange={(value) => onBeatTextChange(beat.index, value)}
              />
              <p className="beat-editor__word-count">{wordCount} words</p>

              {showCustomVisuals ? (
                <div className="beat-editor__custom">
                  <div className="beat-editor__custom-head">
                    <span className="beat-editor__custom-label">Beat image</span>
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
                      <div
                        className="beat-editor__preview beat-editor__preview--empty"
                        aria-hidden="true"
                      >
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
                </div>
              ) : null}

              {visualStyle === "custom" && !showCustomVisuals ? (
                <p className="beat-editor__bundled-note">
                  Custom images for this template are bundled on the server — text beats are still
                  saved for your blueprint.
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
