import type { MovieProjectDraft } from "../../types/project";

export interface ProjectPanelProps {
  draft: MovieProjectDraft;
  onBeatCountChange: (beatCount: number) => void;
  onBeatTextChange: (beatIndex: number, text: string) => void;
  onBeatVoiceReferenceToneChange: (beatIndex: number, tone: string) => void;
  onBeatVisualChange: (beatIndex: number, file: File | null) => void;
  onBack: () => void;
}
