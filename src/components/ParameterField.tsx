import type { ReactNode } from "react";
import "./ParameterField.css";

interface ParameterFieldProps {
  label: string;
  hint?: string;
  styleNote?: string;
  children: ReactNode;
}

export function ParameterField({ label, hint, styleNote, children }: ParameterFieldProps) {
  return (
    <label className="parameter-field">
      <span className="parameter-field__label-row">
        <span className="parameter-field__label">{label}</span>
        {styleNote ? <span className="parameter-field__badge">{styleNote}</span> : null}
      </span>
      {hint ? <span className="parameter-field__hint">{hint}</span> : null}
      {children}
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  hint?: string;
  styleNote?: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SelectField({ label, hint, styleNote, value, options, onChange }: SelectFieldProps) {
  return (
    <ParameterField label={label} hint={hint} styleNote={styleNote}>
      <select
        className="parameter-field__control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || "__empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </ParameterField>
  );
}

interface TextFieldProps {
  label: string;
  hint?: string;
  styleNote?: string;
  value: string;
  placeholder?: string;
  listId?: string;
  onChange: (value: string) => void;
}

export function TextField({
  label,
  hint,
  styleNote,
  value,
  placeholder,
  listId,
  onChange,
}: TextFieldProps) {
  return (
    <ParameterField label={label} hint={hint} styleNote={styleNote}>
      <input
        className="parameter-field__control"
        type="text"
        value={value}
        placeholder={placeholder}
        list={listId}
        onChange={(event) => onChange(event.target.value)}
      />
    </ParameterField>
  );
}

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function NumberField({ label, hint, value, min, max, step, onChange }: NumberFieldProps) {
  return (
    <ParameterField label={label} hint={hint}>
      <input
        className="parameter-field__control"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </ParameterField>
  );
}

interface TextAreaFieldProps {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}

export function TextAreaField({
  label,
  hint,
  value,
  placeholder,
  rows = 5,
  onChange,
}: TextAreaFieldProps) {
  return (
    <ParameterField label={label} hint={hint}>
      <textarea
        className="parameter-field__control parameter-field__control--textarea"
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
      />
    </ParameterField>
  );
}
