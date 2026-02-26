"use client";

import { useEffect, useRef } from "react";

interface WebcamPreviewProps {
  stream: MediaStream | null;
  className?: string;
  muted?: boolean;
}

export function WebcamPreview({ stream, className, muted = true }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={className}
    />
  );
}
