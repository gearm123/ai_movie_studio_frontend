import type { ProjectSettings } from "../../types/project";

export interface ProjectSetupPageProps {
  settings: ProjectSettings;
  onChange: (patch: Partial<ProjectSettings>) => void;
  onBack: () => void;
  onContinue: () => void;
  setupError?: string | null;
}
