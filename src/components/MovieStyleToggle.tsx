import type { VisualStyle } from "../types/project";
import "./MovieStyleToggle.css";

interface MovieStyleToggleProps {
  value: VisualStyle;
  onChange: (value: VisualStyle) => void;
}

export function MovieStyleToggle({ value, onChange }: MovieStyleToggleProps) {
  return (
    <div className="movie-style-toggle" role="group" aria-label="Movie visual style">
      <button
        type="button"
        className={
          value === "image"
            ? "movie-style-toggle__btn movie-style-toggle__btn--active"
            : "movie-style-toggle__btn"
        }
        aria-pressed={value === "image"}
        onClick={() => onChange("image")}
      >
        Still image
      </button>
      <button
        type="button"
        className={
          value === "video"
            ? "movie-style-toggle__btn movie-style-toggle__btn--active"
            : "movie-style-toggle__btn"
        }
        aria-pressed={value === "video"}
        onClick={() => onChange("video")}
      >
        Video
      </button>
    </div>
  );
}
