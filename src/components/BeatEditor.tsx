import type { BeatDraft } from "../types/project";
import { TextAreaField } from "./ParameterField";
import "./BeatEditor.css";

interface BeatEditorProps {
  beats: BeatDraft[];
  onBeatTextChange: (beatIndex: number, text: string) => void;
}

export function BeatEditor({ beats, onBeatTextChange }: BeatEditorProps) {
  return (
    <section className="beat-editor" aria-labelledby="beat-editor-title">
      <div className="beat-editor__header">
        <p className="beat-editor__step">Step 3 of 3</p>
        <h2 id="beat-editor-title" className="beat-editor__title">
          Write your beats
        </h2>
        <p className="beat-editor__copy">
          One block of text per beat. Use punctuation for pacing — the backend will split this into
          narration, visuals, and audio when you generate.
        </p>
      </div>

      <ol className="beat-editor__list">
        {beats.map((beat) => {
          const wordCount = beat.narration.trim() ? beat.narration.trim().split(/\s+/).length : 0;
          return (
            <li key={beat.index} className="beat-editor__item">
              <TextAreaField
                label={`Beat ${beat.index}`}
                hint="Narration for this moment in the story."
                value={beat.narration}
                placeholder="Write what happens in this beat…"
                rows={4}
                onChange={(value) => onBeatTextChange(beat.index, value)}
              />
              <p className="beat-editor__word-count">{wordCount} words</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
