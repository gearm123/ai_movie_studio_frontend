import { ResponsiveView } from "../../viewports";
import { ProjectPanelBrowser } from "./ProjectPanelBrowser";
import { ProjectPanelPhone } from "./ProjectPanelPhone";
import type { ProjectPanelProps } from "./types";

export function ProjectPanel(props: ProjectPanelProps) {
  return (
    <ResponsiveView
      browser={<ProjectPanelBrowser {...props} />}
      phone={<ProjectPanelPhone {...props} />}
    />
  );
}

export type { ProjectPanelProps } from "./types";
