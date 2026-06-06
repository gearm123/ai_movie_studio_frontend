import type { VisualStyle } from "../types/project";
import { VISUAL_STYLE_OPTIONS } from "../constants/parameters";
import "./VisualStyleSelector.css";

interface VisualStyleSelectorProps {
  value: VisualStyle;
  onChange: (style: VisualStyle) => void;
  compact?: boolean;
  /** setup = centered cards for whole-video configuration on page 2 */
  layout?: "default" | "setup";
}

const STYLE_ICONS: Record<VisualStyle, string> = {
  still: "🖼",
  animation: "▶",
  custom: "📁",
};

export function VisualStyleSelector({
  value,
  onChange,
  compact = false,
  layout = "default",
}: VisualStyleSelectorProps) {
  const layoutClass =
    layout === "setup"
      ? "visual-style-selector visual-style-selector--setup"
      : compact
        ? "visual-style-selector visual-style-selector--compact"
        : "visual-style-selector";

  return (
    <div className={layoutClass} role="radiogroup" aria-label="Visual mode">
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
              {STYLE_ICONS[option.key]}
            </span>
            <span className="visual-style-selector__text">
              <strong>{option.label}</strong>
              {!compact && layout !== "setup" ? <span>{option.description}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
