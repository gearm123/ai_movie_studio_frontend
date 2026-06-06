import { useState } from "react";
import { StudioLayout } from "./components/StudioLayout";
import { ProjectPanel } from "./components/ProjectPanel";
import { LandingPage } from "./pages/LandingPage";
import { ProjectSetupPage } from "./pages/ProjectSetupPage";
import { useProjectDraft } from "./hooks/useProjectDraft";
import type { AppStep } from "./types/steps";
import "./App.css";

function App() {
  const [step, setStep] = useState<AppStep>("landing");
  const { draft, setBeatCount, updateSettings, updateBeatVisual } = useProjectDraft();

  if (step === "landing") {
    return <LandingPage onStart={() => setStep("setup")} />;
  }

  return (
    <StudioLayout step={step}>
      {step === "setup" ? (
        <ProjectSetupPage
          settings={draft.settings}
          onChange={updateSettings}
          onBack={() => setStep("landing")}
          onContinue={() => setStep("beats")}
        />
      ) : null}

      {step === "beats" ? (
        <ProjectPanel
          draft={draft}
          onBeatCountChange={setBeatCount}
          onBeatVisualChange={updateBeatVisual}
          onBack={() => setStep("setup")}
        />
      ) : null}
    </StudioLayout>
  );
}

export default App;
