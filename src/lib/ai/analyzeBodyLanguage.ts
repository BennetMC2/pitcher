import Anthropic from "@anthropic-ai/sdk";
import type { BodyLanguageAnalysis, MediaPipeFrameData } from "@/types/feedback.types";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const bodyLanguageTool: Anthropic.Tool = {
  name: "body_language_analysis",
  description: "Analyze body language from MediaPipe tracking data",
  input_schema: {
    type: "object" as const,
    properties: {
      eye_contact_pct: {
        type: "number",
        description: "Percentage of frames (0-100) where the speaker appears to be making eye contact with the camera. Based on face landmark orientation.",
      },
      posture_score: {
        type: "number",
        description: "0-100 score for posture quality. 90+ = excellent upright posture, 70-89 = good, 50-69 = slouching noticed, <50 = significant posture issues",
      },
      gesture_score: {
        type: "number",
        description: "0-100 score for hand gestures. 90+ = natural expressive gestures, 70-89 = some gesturing, 50-69 = minimal movement, <50 = very stiff or distracting",
      },
      body_language_notes: {
        type: "string",
        description: "2-3 sentence assessment of body language. Include what was strong and one specific improvement suggestion.",
      },
    },
    required: ["eye_contact_pct", "posture_score", "gesture_score", "body_language_notes"],
  },
};

// Compute summary stats from raw frame data to keep the prompt manageable
function summarizeFrameData(frames: MediaPipeFrameData[]): object {
  const total = frames.length;
  if (total === 0) return { total_frames: 0 };

  let facingCameraFrames = 0;
  const noseToEarRatios: number[] = [];
  const shoulderHeightDiffs: number[] = [];

  for (const frame of frames) {
    // Face direction: check if nose tip is between the ears (rough eye contact proxy)
    if (frame.faceLandmarks?.[0]) {
      const landmarks = frame.faceLandmarks[0];
      const noseTip = landmarks[1];
      const leftEar = landmarks[234];
      const rightEar = landmarks[454];
      if (noseTip && leftEar && rightEar) {
        const midX = (leftEar.x + rightEar.x) / 2;
        const deviation = Math.abs(noseTip.x - midX);
        if (deviation < 0.05) facingCameraFrames++;
        noseToEarRatios.push(deviation);
      }
    }

    // Posture: shoulder height symmetry
    if (frame.poseLandmarks?.[0]) {
      const landmarks = frame.poseLandmarks[0];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      if (leftShoulder && rightShoulder) {
        shoulderHeightDiffs.push(Math.abs(leftShoulder.y - rightShoulder.y));
      }
    }
  }

  const eyeContactPct = total > 0 ? (facingCameraFrames / total) * 100 : 0;
  const avgShoulderDiff =
    shoulderHeightDiffs.length > 0
      ? shoulderHeightDiffs.reduce((a, b) => a + b, 0) / shoulderHeightDiffs.length
      : null;

  return {
    total_frames: total,
    duration_sampled_seconds: total * 0.5, // sampled at 2fps
    eye_contact_estimate_pct: Math.round(eyeContactPct),
    avg_head_deviation_from_center: noseToEarRatios.length
      ? (noseToEarRatios.reduce((a, b) => a + b, 0) / noseToEarRatios.length).toFixed(3)
      : null,
    avg_shoulder_height_diff: avgShoulderDiff?.toFixed(3) ?? null,
    has_pose_data: frames.some((f) => f.poseLandmarks),
    has_face_data: frames.some((f) => f.faceLandmarks),
  };
}

export async function analyzeBodyLanguage(
  frames: MediaPipeFrameData[]
): Promise<BodyLanguageAnalysis> {
  const summary = summarizeFrameData(frames);

  const response = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    tools: [bodyLanguageTool],
    tool_choice: { type: "tool", name: "body_language_analysis" },
    messages: [
      {
        role: "user",
        content: `You are a body language coach analyzing a startup founder's pitch delivery using computer vision data from MediaPipe face and pose tracking.

Here is the aggregated tracking data from the recording:

${JSON.stringify(summary, null, 2)}

Key metrics to interpret:
- eye_contact_estimate_pct: frames where face is directed at camera (higher = more eye contact)
- avg_head_deviation_from_center: how much the head turns away (lower = more camera-facing)
- avg_shoulder_height_diff: shoulder asymmetry (lower = more upright/balanced posture)
- Gesture data is inferred from pose landmark movement variance

Based on this data, provide realistic scores and actionable coaching feedback. If data is limited, be appropriately conservative in your estimates. Use the body_language_analysis tool.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Body language analysis failed: no tool use response");
  }

  return toolUse.input as BodyLanguageAnalysis;
}

// Fallback when no MediaPipe data available
export function defaultBodyLanguageAnalysis(): BodyLanguageAnalysis {
  return {
    eye_contact_pct: 0,
    posture_score: 0,
    gesture_score: 0,
    body_language_notes:
      "Body language analysis was not available for this session. Upgrade to Pro to unlock full body language tracking.",
  };
}
