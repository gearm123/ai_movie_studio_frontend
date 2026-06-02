import { ProjectPanel } from "./components/ProjectPanel";
import { StudioLayout } from "./components/StudioLayout";
import { useProjectDraft } from "./hooks/useProjectDraft";
import "./App.css";

function App() {
  const { draft, setBeatCount } = useProjectDraft();

  return (
    <StudioLayout>
      <ProjectPanel draft={draft} onBeatCountChange={setBeatCount} />
    </StudioLayout>
  );
}

export default App;
