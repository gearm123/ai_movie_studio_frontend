import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";
import { createJob, fetchJobVideoBlob, getJob, getJobLog } from "../api/jobs";
import type { JobRecord, JobStatus } from "../api/types";
import type { MovieProjectDraft } from "../types/project";
import { draftToJobRequest, validateDraftForJob } from "../utils/jobRequest";

const TERMINAL: JobStatus[] = ["succeeded", "failed"];
const POLL_MS = 3000;

export function useMovieJob() {
  const [job, setJob] = useState<JobRecord | null>(null);
  const [phase, setPhase] = useState<"idle" | "submitting" | "polling" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [logTail, setLogTail] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const revokeVideoUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setVideoUrl(null);
  }, []);

  const reset = useCallback(() => {
    clearPoll();
    revokeVideoUrl();
    setJob(null);
    setPhase("idle");
    setError(null);
    setLogTail(null);
  }, [clearPoll, revokeVideoUrl]);

  const attachLogTail = useCallback(async (jobId: string) => {
    try {
      const log = await getJobLog(jobId);
      if (!log.trim()) {
        return;
      }
      const lines = log.trim().split("\n");
      setLogTail(lines.slice(-12).join("\n"));
    } catch {
      /* log may not exist yet */
    }
  }, []);

  const loadVideo = useCallback(
    async (jobId: string) => {
      revokeVideoUrl();
      const blob = await fetchJobVideoBlob(jobId);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      setVideoUrl(url);
      setPhase("ready");
    },
    [revokeVideoUrl],
  );

  const pollJob = useCallback(
    async (jobId: string) => {
      try {
        const record = await getJob(jobId);
        setJob(record);
        if (TERMINAL.includes(record.status)) {
          clearPoll();
          if (record.status === "succeeded") {
            try {
              await loadVideo(jobId);
            } catch (videoErr) {
              setPhase("error");
              setError(
                videoErr instanceof Error
                  ? videoErr.message
                  : "Movie finished but the video could not be loaded.",
              );
              void attachLogTail(jobId);
            }
          } else {
            setPhase("error");
            setError(record.error ?? "Movie generation failed. See log below or Render dashboard.");
            void attachLogTail(jobId);
          }
        } else if (record.status === "running" || record.status === "queued") {
          void attachLogTail(jobId);
        }
      } catch (err) {
        clearPoll();
        setPhase("error");
        setError(err instanceof Error ? err.message : "Could not fetch job status.");
        void attachLogTail(jobId);
      }
    },
    [attachLogTail, clearPoll, loadVideo],
  );

  const startGeneration = useCallback(
    async (draft: MovieProjectDraft) => {
      const validationError = validateDraftForJob(draft);
      if (validationError) {
        setPhase("error");
        setError(validationError);
        return;
      }

      clearPoll();
      revokeVideoUrl();
      setLogTail(null);
      setPhase("submitting");
      setError(null);

      try {
        const created = await createJob(draftToJobRequest(draft));
        setJob(created);
        setPhase("polling");
        const latest = await getJob(created.id);
        setJob(latest);
        if (TERMINAL.includes(latest.status)) {
          if (latest.status === "succeeded") {
            try {
              await loadVideo(created.id);
            } catch (videoErr) {
              setPhase("error");
              setError(
                videoErr instanceof Error
                  ? videoErr.message
                  : "Movie finished but the video could not be loaded.",
              );
              void attachLogTail(created.id);
            }
          } else {
            setPhase("error");
            setError(latest.error ?? "Movie generation failed. See log below or Render dashboard.");
            void attachLogTail(created.id);
          }
          return;
        }
        pollRef.current = setInterval(() => {
          void pollJob(created.id);
        }, POLL_MS);
      } catch (err) {
        setPhase("error");
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof TypeError) {
          setError(
            "Cannot reach the API. For local dev, start the backend and use npm run dev (Vite proxy). On Netlify, set VITE_API_BASE_URL.",
          );
        } else {
          setError(err instanceof Error ? err.message : "Failed to start generation.");
        }
      }
    },
    [attachLogTail, clearPoll, pollJob, revokeVideoUrl],
  );

  useEffect(() => {
    return () => {
      clearPoll();
      revokeVideoUrl();
    };
  }, [clearPoll, revokeVideoUrl]);

  const isBusy = phase === "submitting" || phase === "polling";

  return {
    job,
    phase,
    error,
    logTail,
    videoUrl,
    isBusy,
    startGeneration,
    reset,
  };
}
