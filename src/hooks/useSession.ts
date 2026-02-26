"use client";

import { useEffect, useRef, useState } from "react";

interface SessionStatus {
  status: "uploading" | "processing" | "complete" | "failed";
  loading: boolean;
  error: string | null;
}

export function useSessionPolling(sessionId: string) {
  const [state, setState] = useState<SessionStatus>({
    status: "processing",
    loading: true,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/analyze/${sessionId}/status`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setState({ status: data.status, loading: false, error: null });

        if (data.status === "complete" || data.status === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
        if (intervalRef.current) clearInterval(intervalRef.current);
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
