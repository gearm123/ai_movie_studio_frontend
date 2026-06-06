import type { MovieType, ProjectSettings } from "../../types/project";

export interface ProjectSetupPageProps {
  settings: ProjectSettings;
  onChange: (patch: Partial<ProjectSettings>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export type { MovieType };
