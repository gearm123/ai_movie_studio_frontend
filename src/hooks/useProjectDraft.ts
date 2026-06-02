import { useCallback, useState } from "react";
import { STUDIO_CONFIG, clampBeatCount } from "../constants/studio";
import type { MovieProjectDraft } from "../types/project";

const INITIAL_DRAFT: MovieProjectDraft = {
  beatCount: STUDIO_CONFIG.defaultBeats,
};

export function useProjectDraft() {
  const [draft, setDraft] = useState<MovieProjectDraft>(INITIAL_DRAFT);

  const setBeatCount = useCallback((beatCount: number) => {
    setDraft((prev) => ({
      ...prev,
      beatCount: clampBeatCount(beatCount),
    }));
  }, []);

  return {
    draft,
    setBeatCount,
  };
}
