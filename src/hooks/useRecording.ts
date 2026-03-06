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
    setPhase("connecting");

    // Check if browser can see any camera devices at all
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some((d) => d.kind === "videoinput");
      const hasAudio = devices.some((d) => d.kind === "audioinput");
      if (!hasVideo && !hasAudio) {
        setError(
          "no_devices"
        );
        setPhase("idle");
        return;
      }
      if (!hasVideo) {
        setError(
          "no_camera"
        );
        setPhase("idle");
        return;
      }
    } catch {
      // enumerateDevices failed — continue and let getUserMedia handle it
    }

    // Try progressively simpler constraints
    const attempts: MediaStreamConstraints[] = [
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
        if (name === "NotAllowedError") {
          setError("denied");
          setPhase("idle");
          return;
        }
        if (name === "NotReadableError") {
          setError("in_use");
          setPhase("idle");
          return;
        }
        if (name === "NotFoundError") {
          setError("no_camera");
          setPhase("idle");
          return;
        }
        continue;
      }
    }

    setError("generic_camera_error");
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

  const skipCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    startRecording();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startImmediate = useCallback(() => {
    if (!streamRef.current) return;
    startRecording();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    startImmediate,
    skipCountdown,
    stopRecording,
    retake,
  };
}
