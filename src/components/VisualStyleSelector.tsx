import type { VisualStyle } from "../types/project";
import { VISUAL_STYLE_OPTIONS } from "../constants/parameters";
import "./VisualStyleSelector.css";

interface VisualStyleSelectorProps {
  value: VisualStyle;
  onChange: (style: VisualStyle) => void;
  compact?: boolean;
}

export function VisualStyleSelector({ value, onChange, compact = false }: VisualStyleSelectorProps) {
  return (
    <div
      className={compact ? "visual-style-selector visual-style-selector--compact" : "visual-style-selector"}
      role="radiogroup"
      aria-label="Visual style"
    >
      {VISUAL_STYLE_OPTIONS.map((option) => {
        const selected = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={selected}
            className={
              selected
                ? "visual-style-selector__option visual-style-selector__option--active"
                : "visual-style-selector__option"
            }
            onClick={() => onChange(option.key)}
          >
            <span className="visual-style-selector__icon" aria-hidden="true">
              {option.key === "image" ? "🖼" : "▶"}
            </span>
            <span className="visual-style-selector__text">
              <strong>{option.label}</strong>
              {!compact ? <span>{option.description}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
