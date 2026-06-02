import { VOICE_REFERENCE_TONES } from "../constants/parameters";

export function voiceReferenceToneLabel(toneKey: string): string {
  const match = VOICE_REFERENCE_TONES.find((tone) => tone.key === toneKey);
  return match?.label ?? toneKey;
}
