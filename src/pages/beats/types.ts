import type { MovieProjectDraft } from "../../types/project";

export interface ProjectPanelProps {
  draft: MovieProjectDraft;
  onBeatCountChange: (beatCount: number) => void;
  onBeatVisualChange: (beatIndex: number, file: File | null) => void;
  onBack: () => void;
}
