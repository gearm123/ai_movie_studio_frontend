import { ResponsiveView } from "../../viewports";
import { ProjectSetupPageBrowser } from "./ProjectSetupPageBrowser";
import { ProjectSetupPagePhone } from "./ProjectSetupPagePhone";
import type { ProjectSetupPageProps } from "./types";

export function ProjectSetupPage(props: ProjectSetupPageProps) {
  return (
    <ResponsiveView
      browser={<ProjectSetupPageBrowser {...props} />}
      phone={<ProjectSetupPagePhone {...props} />}
    />
  );
}

export type { ProjectSetupPageProps } from "./types";
