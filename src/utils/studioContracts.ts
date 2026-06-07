import type { BeatDraft, MovieProjectDraft } from "../types/project";

export interface StudioContracts {
  narration_contract: string;
  punctuation_contract: string;
}

const DEFAULT_SPOKEN_SPEED = "1.25";
const DEFAULT_CLAUSE_PAUSE_SEC = "0.07";
const SILENT_HOLD_SEC = "3.6";

function slugifyFigureKey(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return slug || "studio_figure";
}

function isSilentBeat(beat: BeatDraft): boolean {
  return beat.voice_reference_tone === "silent_memorial";
}

function resolveVoiceKey(beat: BeatDraft): string {
  if (isSilentBeat(beat)) {
    return "[silent memorial]";
  }
  const tone = beat.voice_reference_tone.trim();
  return tone || "calm";
}

function formatSpokenLine(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function toneLabel(voiceKey: string): string {
  if (voiceKey === "[silent memorial]") {
    return "Silent. Gentle. Memorial.";
  }
  const label = voiceKey.charAt(0).toUpperCase() + voiceKey.slice(1);
  return `${label}. Clear. Steady.`;
}

function buildNarrationBeatBlock(beat: BeatDraft): string[] {
  const story = beat.narration.trim();
  if (isSilentBeat(beat)) {
    return [
      `### Beat ${beat.index}`,
      "",
      "- Story: Silent memorial hold. End on a memorial frame with no spoken narration at all.",
      "- Voice: [silent memorial]",
      "- Tone: Silent. Gentle. Memorial.",
      "- Pace: Hold quietly with no new spoken words.",
      "- Volume: Silent.",
      "- Pauses: Full silent hold only.",
      "- Purpose: Give the story one final silent memorial beat that lets the ending breathe.",
      `- HoldSec: ${SILENT_HOLD_SEC}`,
      "- Speed:",
      "- ClausePauseSec:",
      "",
    ];
  }

  const voice = resolveVoiceKey(beat);
  return [
    `### Beat ${beat.index}`,
    "",
    `- Story: ${story}`,
    `- Voice: ${voice}`,
    `- Tone: ${toneLabel(voice)}`,
    "- Pace: Measured. Clear. Let each story turn land.",
    "- Volume: Medium-low. Controlled.",
    "- Pauses: Gentle pauses between major story turns.",
    `- Purpose: ${story}`,
    `- Speed: ${DEFAULT_SPOKEN_SPEED}`,
    `- ClausePauseSec: ${DEFAULT_CLAUSE_PAUSE_SEC}`,
    "",
  ];
}

function buildPunctuationBeatBlock(beat: BeatDraft): string[] {
  if (isSilentBeat(beat)) {
    return [`### Beat ${beat.index}`, "", "- Narration:", "- Speed:", ""];
  }

  return [
    `### Beat ${beat.index}`,
    "",
    `- Narration: ${formatSpokenLine(beat.narration)}`,
    `- Speed: ${DEFAULT_SPOKEN_SPEED}`,
    "",
  ];
}

export function buildStudioContractsFromDraft(draft: MovieProjectDraft): StudioContracts {
  const displayName = draft.settings.topic.trim() || "Studio Figure";
  const figureKey = slugifyFigureKey(displayName);
  const beatCount = draft.beats.length;

  const narrationLines = [
    `# ${displayName} Narration Contract`,
    "",
    "## Title",
    "",
    displayName,
    "",
    "## Purpose",
    "",
    `This narration contract defines per-beat story intent, voice tone, delivery, and runtime controls for a ${beatCount}-beat studio story.`,
    "",
    `The exact spoken words live in the matching punctuation contract for \`${figureKey}\`.`,
    "",
    "## Global Rules",
    "",
    "- Treat the punctuation contract as the authority for the spoken words.",
    "- Treat this narration contract as the authority for voice, delivery, and runtime controls.",
    "- For spoken beats, use `Speed: 1.25` unless a beat needs a different read.",
    "",
    "## Beat Contract",
    "",
    ...draft.beats.flatMap((beat) => buildNarrationBeatBlock(beat)),
    "## Compact Rule",
    "",
    `${figureKey} = narration contract for voice and delivery; punctuation contract for spoken words.`,
    "",
  ];

  const punctuationLines = [
    `# ${displayName} Punctuation Contract`,
    "",
    "## Purpose",
    "",
    `This punctuation contract supplies the final narration line for each beat in \`${figureKey}\`.`,
    "",
    "## Global Narration Punctuation Rules",
    "",
    "- Write each beat as one clean spoken sentence when possible.",
    "- End each spoken beat with a period.",
    "- Prefer commas only where a natural spoken phrase break helps clarity.",
    "",
    "## Beat Narration Overrides",
    "",
    ...draft.beats.flatMap((beat) => buildPunctuationBeatBlock(beat)),
    "## Compact Rule",
    "",
    `${figureKey} = punctuation contract for spoken words; narration contract for voice and delivery.`,
    "",
  ];

  return {
    narration_contract: narrationLines.join("\n"),
    punctuation_contract: punctuationLines.join("\n"),
  };
}

export function validateStudioBeatsForJob(draft: MovieProjectDraft): string | null {
  if (draft.settings.figure_source !== "new") {
    return null;
  }

  if (draft.beats.length === 0) {
    return "Add at least one beat before generating.";
  }

  const incomplete = draft.beats.filter(
    (beat) => !isSilentBeat(beat) && !beat.narration.trim(),
  ).length;
  if (incomplete > 0) {
    return `Add narration for every beat (${incomplete} still empty), or choose Silent memorial for a visual-only beat.`;
  }

  const spokenBeats = draft.beats.filter((beat) => !isSilentBeat(beat)).length;
  if (spokenBeats === 0) {
    return "Add spoken narration to at least one beat.";
  }

  return null;
}
