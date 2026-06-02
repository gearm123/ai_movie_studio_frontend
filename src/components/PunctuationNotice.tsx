import { PUNCTUATION_MARKUP } from "../constants/parameters";
import "./PunctuationNotice.css";

export function PunctuationNotice() {
  return (
    <aside className="punctuation-notice" aria-label="Narration punctuation guidance">
      <p className="punctuation-notice__title">Punctuation guides the voice</p>
      <p className="punctuation-notice__copy">
        Commas, periods, ellipses, and question marks shape pauses and emphasis in XTTS narration.
        Use them deliberately — they are part of the performance, not decoration. Pair wording with the
        beat&apos;s narration tone (voice reference WAV) for the intended emotional read.
      </p>
      <ul className="punctuation-notice__tags">
        {PUNCTUATION_MARKUP.map((item) => (
          <li key={item.tag}>
            <code>{item.tag}</code>
            <span>{item.seconds}s pause</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
