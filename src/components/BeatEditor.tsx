import { useState } from "react";
import type { BeatAudioParams, BeatCompositionParams, BeatDraft } from "../types/project";
import {
  AUDIO_PARAM_SUGGESTIONS,
  TRANSITIONS,
  VISUAL_DELIVERY_OPTIONS,
  VOICE_REFERENCE_TONES,
  getNarrator,
  isAssetPromoStyle,
  styleLocksMotion,
  stylePlannerControllableAudioKeys,
  stylePlannerControllableCompositionKeys,
  visualAssetOptions,
} from "../constants/parameters";
import { NumberField, SelectField, TextAreaField, TextField } from "./ParameterField";
import { BeatPreview } from "./BeatPreview";
import { PunctuationNotice } from "./PunctuationNotice";
import type { VisualStyle } from "../types/project";
import "./BeatEditor.css";

interface BeatEditorProps {
  beat: BeatDraft;
  beatCount: number;
  stylePreset: string;
  narratorKey: string;
  projectVisualStyle: VisualStyle;
  onUpdate: (patch: Partial<BeatDraft>) => void;
  onAudioParamChange: (key: keyof BeatAudioParams, value: string) => void;
  onCompositionParamChange: (key: keyof BeatCompositionParams, value: string) => void;
}

type BeatTab = "content" | "audio" | "composition";

export function BeatEditor({
  beat,
  beatCount,
  stylePreset,
  narratorKey,
  projectVisualStyle,
  onUpdate,
  onAudioParamChange,
  onCompositionParamChange,
}: BeatEditorProps) {
  const [tab, setTab] = useState<BeatTab>("content");
  const controllableAudio = stylePlannerControllableAudioKeys(stylePreset);
  const controllableComposition = stylePlannerControllableCompositionKeys(stylePreset);
  const assetOptions = visualAssetOptions(stylePreset);
  const showPromoFields = isAssetPromoStyle(stylePreset);

  const isAudioLocked = (key: keyof BeatAudioParams) =>
    controllableAudio.length === 0 ? true : !controllableAudio.includes(key);

  const isCompositionLocked = (key: keyof BeatCompositionParams) =>
    controllableComposition.length === 0 ? true : !controllableComposition.includes(key);

  const styleNoteForAudio = (key: keyof BeatAudioParams) =>
    isAudioLocked(key) ? "Planner-locked for style" : undefined;

  const styleNoteForComposition = (key: keyof BeatCompositionParams) => {
    if (key === "motion_prompt" && styleLocksMotion(stylePreset)) {
      return "Fixed for TikTok style";
    }
    return isCompositionLocked(key) ? "Planner-locked for style" : undefined;
  };

  const wordCount = beat.narration.trim() ? beat.narration.trim().split(/\s+/).length : 0;
  const projectNarrator = getNarrator(narratorKey);

  return (
    <section className="beat-editor" aria-labelledby="beat-editor-title">
      <div className="beat-editor__header">
        <div>
          <p className="beat-editor__step">Beat {beat.index} of {beatCount}</p>
          <h2 id="beat-editor-title" className="beat-editor__title">
            Edit beat content &amp; parameters
          </h2>
        </div>
        <div className="beat-editor__tabs" role="tablist" aria-label="Beat parameter groups">
          {(["content", "audio", "composition"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? "beat-editor__tab beat-editor__tab--active" : "beat-editor__tab"}
              onClick={() => setTab(key)}
            >
              {key === "content" ? "Content" : key === "audio" ? "Audio" : "Composition"}
            </button>
          ))}
        </div>
      </div>

      {tab === "content" ? (
        <div className="beat-editor__panel">
          <BeatPreview
            beatIndex={beat.index}
            visualStyle={projectVisualStyle}
            narration={beat.narration}
            visualPrompt={beat.visual_prompt}
          />
          <TextAreaField
            label="Narration"
            hint="Maps to backend `narration` (planner: audio_prompt). Punctuation controls pacing."
            value={beat.narration}
            placeholder="Write what the narrator should say for this beat…"
            rows={6}
            onChange={(value) => onUpdate({ narration: value })}
          />
          <p className="beat-editor__word-count">{wordCount} words</p>
          <PunctuationNotice />
          <SelectField
            label="Narration tone (voice reference)"
            hint="Maps to backend `voice_reference_tone` → assets/voice_references/<tone>.wav for XTTS on this beat."
            value={beat.voice_reference_tone}
            options={VOICE_REFERENCE_TONES.map((tone) => ({
              value: tone.key,
              label: tone.label,
            }))}
            onChange={(value) => onUpdate({ voice_reference_tone: value })}
          />
          {beat.voice_reference_tone === "silent_memorial" ? (
            <p className="beat-editor__silent-note">
              Silent memorial: leave narration empty. The pipeline uses a visual hold with no spoken words.
            </p>
          ) : null}
          <TextAreaField
            label="Visual prompt"
            hint="Scene description for text-to-image (or promo stage label)."
            value={beat.visual_prompt}
            placeholder="Describe the frame the viewer should see…"
            rows={4}
            onChange={(value) => onUpdate({ visual_prompt: value })}
          />
          <NumberField
            label="Duration (seconds)"
            hint="Beat length in the final timeline."
            value={beat.duration}
            min={0.5}
            max={60}
            step={0.5}
            onChange={(value) => onUpdate({ duration: value })}
          />
        </div>
      ) : null}

      {tab === "audio" ? (
        <div className="beat-editor__panel beat-editor__panel--grid">
          <div className="beat-editor__narrator-note">
            <span className="beat-editor__narrator-label">Project narrator</span>
            <strong>{projectNarrator.label}</strong>
            <span className="beat-editor__narrator-hint">
              All beats use this voice clone unless you add more narrators at the project level.
            </span>
          </div>
          <TextField
            label="Tone"
            hint="e.g. clear, suspenseful, eerie"
            value={beat.audio_params.tone}
            styleNote={styleNoteForAudio("tone")}
            listId="tone-suggestions"
            onChange={(value) => onAudioParamChange("tone", value)}
          />
          <datalist id="tone-suggestions">
            {AUDIO_PARAM_SUGGESTIONS.tone.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <TextField
            label="Delivery"
            value={beat.audio_params.delivery}
            styleNote={styleNoteForAudio("delivery")}
            listId="delivery-suggestions"
            onChange={(value) => onAudioParamChange("delivery", value)}
          />
          <datalist id="delivery-suggestions">
            {AUDIO_PARAM_SUGGESTIONS.delivery.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <TextField
            label="Cadence"
            value={beat.audio_params.cadence}
            styleNote={styleNoteForAudio("cadence")}
            listId="cadence-suggestions"
            onChange={(value) => onAudioParamChange("cadence", value)}
          />
          <datalist id="cadence-suggestions">
            {AUDIO_PARAM_SUGGESTIONS.cadence.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <TextField
            label="Pauses"
            value={beat.audio_params.pauses}
            styleNote={styleNoteForAudio("pauses")}
            listId="pauses-suggestions"
            onChange={(value) => onAudioParamChange("pauses", value)}
          />
          <datalist id="pauses-suggestions">
            {AUDIO_PARAM_SUGGESTIONS.pauses.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <TextField
            label="Energy"
            value={beat.audio_params.energy}
            styleNote={styleNoteForAudio("energy")}
            listId="energy-suggestions"
            onChange={(value) => onAudioParamChange("energy", value)}
          />
          <datalist id="energy-suggestions">
            {AUDIO_PARAM_SUGGESTIONS.energy.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <TextField
            label="Clause pause (sec)"
            hint="Silence between comma clauses. Empty = continuous read. Max ~0.45."
            value={beat.audio_params.clause_pause_sec}
            styleNote={styleNoteForAudio("clause_pause_sec")}
            onChange={(value) => onAudioParamChange("clause_pause_sec", value)}
          />
        </div>
      ) : null}

      {tab === "composition" ? (
        <div className="beat-editor__panel beat-editor__panel--grid">
          <TextField
            label="Motion prompt"
            hint="Ken Burns / hold hint for animated still styles."
            value={beat.composition.motion_prompt}
            styleNote={styleNoteForComposition("motion_prompt")}
            onChange={(value) => onCompositionParamChange("motion_prompt", value)}
          />
          <SelectField
            label="Transition in"
            value={beat.composition.transition_in}
            styleNote={styleNoteForComposition("transition_in")}
            options={TRANSITIONS.map((value) => ({ value, label: value }))}
            onChange={(value) => onCompositionParamChange("transition_in", value)}
          />
          <SelectField
            label="Transition out"
            value={beat.composition.transition_out}
            styleNote={styleNoteForComposition("transition_out")}
            options={TRANSITIONS.map((value) => ({ value, label: value }))}
            onChange={(value) => onCompositionParamChange("transition_out", value)}
          />
          <TextField
            label="Emphasis text"
            hint="Short on-screen hook (max ~24 chars in planner)."
            value={beat.composition.emphasis_text}
            styleNote={styleNoteForComposition("emphasis_text")}
            onChange={(value) => onCompositionParamChange("emphasis_text", value)}
          />
          {showPromoFields ? (
            <>
              <SelectField
                label="Visual asset stage"
                value={beat.composition.visual_asset}
                styleNote={styleNoteForComposition("visual_asset")}
                options={[
                  { value: "", label: "Select stage…" },
                  ...assetOptions.map((value) => ({ value, label: value })),
                ]}
                onChange={(value) => onCompositionParamChange("visual_asset", value)}
              />
              <SelectField
                label="Visual delivery"
                value={beat.composition.visual_delivery}
                styleNote={styleNoteForComposition("visual_delivery")}
                options={VISUAL_DELIVERY_OPTIONS.map((value) => ({
                  value,
                  label: value ? value : "Legacy composite",
                }))}
                onChange={(value) => onCompositionParamChange("visual_delivery", value)}
              />
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
