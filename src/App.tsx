import { useState } from "react";
import { StudioLayout } from "./layouts/StudioLayout";
import { ProjectPanel } from "./pages/beats/ProjectPanel";
import { LandingPage } from "./pages/landing/LandingPage";
import { ProjectSetupPage } from "./pages/setup/ProjectSetupPage";
import { useProjectDraft } from "./hooks/useProjectDraft";
import { validateSetupSettings } from "./utils/jobRequest";
import type { AppStep } from "./types/steps";
import "./App.css";

function App() {
  const [step, setStep] = useState<AppStep>("landing");
  const [setupError, setSetupError] = useState<string | null>(null);
  const { draft, setBeatCount, updateSettings, updateBeatText, updateBeatVisual } = useProjectDraft();

  const handleSetupContinue = () => {
    const error = validateSetupSettings(draft.settings);
    if (error) {
      setSetupError(error);
      return;
    }
    setSetupError(null);
    setStep("beats");
  };

  if (step === "landing") {
    return <LandingPage onStart={() => setStep("setup")} />;
  }

  return (
    <StudioLayout step={step}>
      {step === "setup" ? (
        <ProjectSetupPage
          settings={draft.settings}
          onChange={(patch) => {
            setSetupError(null);
            updateSettings(patch);
          }}
          onBack={() => setStep("landing")}
          onContinue={handleSetupContinue}
          setupError={setupError}
        />
      ) : null}

      {step === "beats" ? (
        <ProjectPanel
          draft={draft}
          onBeatCountChange={setBeatCount}
          onBeatTextChange={updateBeatText}
          onBeatVisualChange={updateBeatVisual}
          onBack={() => setStep("setup")}
        />
      ) : null}
    </StudioLayout>
  );
}

export default App;
