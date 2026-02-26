"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRecordingStore } from "@/store/recordingStore";
import type { MediaPipeFrameData } from "@/types/feedback.types";

const SAMPLE_INTERVAL_MS = 1000; // Sample once per second to avoid flickering

export function useMediaPipe(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  const { phase, addFrame } = useRecordingStore();
  const [ready, setReady] = useState(false);
  const faceLandmarkerRef = useRef<unknown>(null);
  const poseLandmarkerRef = useRef<unknown>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRecording = phase === "recording";

  // Lazy-load MediaPipe only when needed
  useEffect(() => {
    if (!enabled) return;

    async function loadMediaPipe() {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const { FaceLandmarker, PoseLandmarker, FilesetResolver } = vision;

        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const [face, pose] = await Promise.all([
          FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          }),
          PoseLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
          }),
        ]);

        faceLandmarkerRef.current = face;
        poseLandmarkerRef.current = pose;
        setReady(true);
      } catch (err) {
        console.warn("MediaPipe failed to load:", err);
      }
    }

    loadMediaPipe();
  }, [enabled]);

  // Use setInterval instead of rAF to avoid flickering
  useEffect(() => {
    if (!isRecording || !ready) return;

    function processFrame() {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const timestamp = performance.now();
      const frame: MediaPipeFrameData = { timestamp };

      try {
        if (faceLandmarkerRef.current) {
          const faceResult = (faceLandmarkerRef.current as { detectForVideo: (v: HTMLVideoElement, t: number) => { faceLandmarks?: { x: number; y: number; z: number }[][] } }).detectForVideo(
            video,
            timestamp
          );
          if ((faceResult?.faceLandmarks?.length ?? 0) > 0) {
            frame.faceLandmarks = faceResult.faceLandmarks;
          }
        }

        if (poseLandmarkerRef.current) {
          const poseResult = (poseLandmarkerRef.current as { detectForVideo: (v: HTMLVideoElement, t: number) => { worldLandmarks?: { x: number; y: number; z: number; visibility?: number }[][] } }).detectForVideo(
            video,
            timestamp
          );
          if ((poseResult?.worldLandmarks?.length ?? 0) > 0) {
            frame.poseLandmarks = poseResult.worldLandmarks;
          }
        }
      } catch {
        // Silently skip frames that fail
        return;
      }

      if (frame.faceLandmarks || frame.poseLandmarks) {
        addFrame(frame);
      }
    }

    // Process first frame immediately, then every SAMPLE_INTERVAL_MS
    processFrame();
    intervalRef.current = setInterval(processFrame, SAMPLE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, ready, videoRef, addFrame]);

  return { ready };
}
