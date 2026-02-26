"use client";

import { useEffect, useRef, useState } from "react";
import { useRecordingStore } from "@/store/recordingStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

interface WindowWithSpeech {
  SpeechRecognition?: new () => AnyRecognition;
  webkitSpeechRecognition?: new () => AnyRecognition;
}

export function useTranscription() {
  const { phase } = useRecordingStore();
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<AnyRecognition>(null);
  const isRecording = phase === "recording";

  useEffect(() => {
    if (!isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    const w = window as unknown as WindowWithSpeech;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: { results: { isFinal: boolean; 0: { transcript: string } }[]; length?: number }) => {
      let text = "";
      const results = event.results as unknown as { isFinal: boolean; 0: { transcript: string } }[];
      for (let i = 0; i < results.length; i++) {
        if (results[i].isFinal) {
          text += results[i][0].transcript + " ";
        }
      }
      if (text.trim()) {
        setTranscript((prev) => (prev + " " + text).trim());
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.warn("Speech recognition error:", event.error);
    };

    // Auto-restart if it stops during recording
    recognition.onend = () => {
      if (recognitionRef.current && isRecording) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [isRecording]);

  const reset = () => setTranscript("");

  return { transcript, reset };
}
