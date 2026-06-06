import type { BeatDraft, VisualStyle } from "../types/project";
import "./BeatEditor.css";

interface BeatEditorProps {
  beats: BeatDraft[];
  visualStyle: VisualStyle;
  onBeatVisualChange: (beatIndex: number, file: File | null) => void;
}

export function BeatEditor({ beats, visualStyle, onBeatVisualChange }: BeatEditorProps) {
  if (visualStyle !== "custom") {
    return (
      <section className="beat-editor" aria-labelledby="beat-editor-title">
        <div className="beat-editor__header">
          <p className="beat-editor__step">Step 3 of 3</p>
          <h2 id="beat-editor-title" className="beat-editor__title">
            Ready to generate
          </h2>
          <p className="beat-editor__copy">
            For still and animation modes the backend plans beats from your figure topic — same as
            running the local CLI. Review your settings in the sidebar, then generate.
          </p>
        </div>
        <div className="beat-editor__info-card" role="status">
          <p>
            <strong>Topic:</strong> drives the story blueprint and narration contracts.
          </p>
          <p>
            <strong>Duration:</strong> total runtime passed as <code>--duration</code>.
          </p>
          <p>
            <strong>Visuals:</strong>{" "}
            {visualStyle === "still"
              ? "text-to-image still per beat."
              : "native text-to-video clip per beat."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="beat-editor" aria-labelledby="beat-editor-title">
      <div className="beat-editor__header">
        <p className="beat-editor__step">Step 3 of 3</p>
        <h2 id="beat-editor-title" className="beat-editor__title">
          Add visuals for each beat
        </h2>
        <p className="beat-editor__copy">
          Custom templates skip AI image generation. Upload one still per beat, or use a bundled
          figure like <code>my_mysteriosgrandfather</code> with images already on the server.
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
                <span className="beat-editor__file-name beat-editor__file-name--empty">No image yet</span>
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
                <span>{beat.custom_visual_url ? "Replace image" : "Choose image"}</span>
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
