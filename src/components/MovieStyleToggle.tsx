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
          value === "still"
            ? "movie-style-toggle__btn movie-style-toggle__btn--active"
            : "movie-style-toggle__btn"
        }
        aria-pressed={value === "still"}
        onClick={() => onChange("still")}
      >
        Still image
      </button>
      <button
        type="button"
        className={
          value === "animation"
            ? "movie-style-toggle__btn movie-style-toggle__btn--active"
            : "movie-style-toggle__btn"
        }
        aria-pressed={value === "animation"}
        onClick={() => onChange("animation")}
      >
        Animation
      </button>
      <button
        type="button"
        className={
          value === "custom"
            ? "movie-style-toggle__btn movie-style-toggle__btn--active"
            : "movie-style-toggle__btn"
        }
        aria-pressed={value === "custom"}
        onClick={() => onChange("custom")}
      >
        Custom
      </button>
    </div>
  );
}
