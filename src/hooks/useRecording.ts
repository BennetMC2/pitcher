"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRecordingStore } from "@/store/recordingStore";
import { FREE_MAX_RECORDING_SECONDS } from "@/lib/constants";

export function useRecording(maxSeconds = FREE_MAX_RECORDING_SECONDS) {
  const {
    phase,
    countdownValue,
    recordingSeconds,
    setPhase,
    setCountdownValue,
    setRecordingSeconds,
    setVideoBlob,
    setError,
    reset,
  } = useRecordingStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }

  const initCamera = useCallback(async () => {
    setError(null);

    // Try progressively simpler constraints
    const attempts = [
      { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, audio: true },
      { video: { facingMode: "user" }, audio: true },
      { video: true, audio: true },
    ];

    for (const constraints of attempts) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setPhase("ready");
        return;
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        // If permission denied or no device, don't try simpler constraints — it won't help
        if (name === "NotAllowedError" || name === "NotFoundError") {
          if (name === "NotAllowedError") {
            setError(
              "Camera access blocked. Click the lock/settings icon in your browser's address bar, set Camera and Microphone to \"Allow\", then reload this page."
            );
          } else {
            setError(
              "No camera found. Make sure your device has a camera, no other app is using it, then try again."
            );
          }
          setPhase("idle");
          return;
        }
        // OverconstrainedError or other — try simpler constraints
        continue;
      }
    }

    // All attempts failed
    setError(
      "Could not access your camera. Try closing other apps that use the camera, then reload this page."
    );
    setPhase("idle");
  }, [setPhase, setError]);

  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setCountdownValue(5);
    let count = 5;
    countdownRef.current = setInterval(() => {
      count--;
      setCountdownValue(count);
      if (count <= 0) {
        clearInterval(countdownRef.current!);
        startRecording();
      }
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPhase, setCountdownValue]);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setVideoBlob(blob, url);
      setPhase("review");
    };

    recorder.start(1000); // collect in 1s chunks
    setPhase("recording");
    setRecordingSeconds(0);

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed++;
      setRecordingSeconds(elapsed);
      if (elapsed >= maxSeconds) stopRecording();
    }, 1000);
  }

  const stopRecording = useCallback(() => {
    clearTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const retake = useCallback(() => {
    clearTimers();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    reset();
    initCamera();
  }, [reset, initCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    phase,
    countdownValue,
    recordingSeconds,
    stream: streamRef.current,
    getStream: () => streamRef.current,
    initCamera,
    startCountdown,
    stopRecording,
    retake,
  };
}
