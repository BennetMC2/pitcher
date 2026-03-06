"use client";

import { useEffect, useRef, useState } from "react";

interface SessionStatus {
  status: "uploading" | "processing" | "complete" | "failed";
  analysisStep: string | null;
  loading: boolean;
  error: string | null;
  pollFailures: number;
}

export function useSessionPolling(sessionId: string) {
  const [state, setState] = useState<SessionStatus>({
    status: "processing",
    analysisStep: null,
    loading: true,
    error: null,
    pollFailures: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let failures = 0;

    async function poll() {
      try {
        const res = await fetch(`/api/analyze/${sessionId}/status`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        failures = 0;
        setState({
          status: data.status,
          analysisStep: data.analysisStep ?? null,
          loading: false,
          error: null,
          pollFailures: 0,
        });

        if (data.status === "complete" || data.status === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err) {
        failures++;
        if (failures >= 3) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
            pollFailures: failures,
          }));
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    }

    poll();
    intervalRef.current = setInterval(poll, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId]);

  return state;
}
