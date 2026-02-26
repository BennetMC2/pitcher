import Anthropic from "@anthropic-ai/sdk";
import type {
  VerbalAnalysis,
  StoryStructure,
  BodyLanguageAnalysis,
  OverallFeedback,
} from "@/types/feedback.types";
import { scoreToGrade } from "@/lib/constants";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const synthesisTool: Anthropic.Tool = {
  name: "confidence_synthesis",
  description: "Synthesize all pitch analysis into an overall assessment with coaching tips",
  input_schema: {
    type: "object" as const,
    properties: {
      overall_score: {
        type: "number",
        description: `Overall pitch confidence score from 0-100. Weight the components:
- Verbal delivery (clarity, WPM, filler words): 30%
- Story structure (has all 4 elements): 35%
- Body language (eye contact, posture, gestures): 20%
- Overall impression: 15%
Be honest — a pitch missing the ask with heavy filler words should not score above 65.`,
      },
      confidence_level: {
        type: "string",
        enum: ["High", "Developing", "Needs Work"],
        description: "High = score 80+, Developing = 60-79, Needs Work = below 60",
      },
      top_strengths: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 3,
        description: "2-3 specific strengths. Be concrete — not 'good delivery' but 'Clear problem articulation with specific user pain point'",
      },
      priority_improvements: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tip: {
              type: "string",
              description: "Specific, actionable coaching tip. Start with a verb. E.g., 'Reduce 'um' filler words by pausing silently instead' not 'Use fewer filler words'",
            },
            category: {
              type: "string",
              enum: ["verbal", "structure", "body_language", "overall"],
            },
            impact: {
              type: "string",
              enum: ["high", "medium", "low"],
              description: "How much fixing this will improve the pitch",
            },
          },
          required: ["tip", "category", "impact"],
        },
        minItems: 3,
        maxItems: 5,
        description: "3-5 priority improvements, sorted by impact (high first). These are the most important things to work on.",
      },
      suggested_script: {
        type: "string",
        description: `A rewritten, punchy version of the founder's pitch (~60 seconds spoken). Rules:
- Open with a sharp, attention-grabbing hook — a bold stat, a provocative question, or a surprising statement. No "Hi, I'm..." intros.
- Keep sentences SHORT. Max 15 words each. Punch, don't ramble.
- Structure: Hook → Problem (1-2 sentences) → Solution (1-2 sentences) → Traction/proof (1 sentence) → Clear ask (1 sentence).
- Use the founder's own words and idea, but cut all filler and fluff ruthlessly.
- Write it as spoken word — contractions, natural rhythm, conversational. NOT a formal essay.
- End with a direct, specific ask. "We're raising X" or "I'd love to show you a demo."
- Use line breaks between sections.`,
      },
    },
    required: ["overall_score", "confidence_level", "top_strengths", "priority_improvements", "suggested_script"],
  },
};

export async function buildOverallFeedback(
  transcript: string,
  verbal: VerbalAnalysis,
  structure: StoryStructure,
  bodyLanguage: BodyLanguageAnalysis,
  skipScript?: boolean
): Promise<OverallFeedback> {
  const structureScore =
    [
      structure.has_problem,
      structure.has_solution,
      structure.has_traction,
      structure.has_ask,
    ].filter(Boolean).length;

  // When skipScript is true, use a tool that doesn't include suggested_script
  const tool = skipScript
    ? {
        ...synthesisTool,
        input_schema: {
          ...synthesisTool.input_schema,
          properties: Object.fromEntries(
            Object.entries(
              (synthesisTool.input_schema as Record<string, unknown>).properties as Record<string, unknown>
            ).filter(([key]) => key !== "suggested_script")
          ),
          required: ["overall_score", "confidence_level", "top_strengths", "priority_improvements"],
        },
      }
    : synthesisTool;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    tools: [tool],
    tool_choice: { type: "tool", name: "confidence_synthesis" },
    messages: [
      {
        role: "user",
        content: `You are a world-class startup pitch coach who has helped founders raise over $500M. You've sat on both sides of the table — as a founder and as a VC.

Synthesize the following analysis of a founder's elevator pitch and provide your overall assessment and prioritized coaching. Be honest, specific, and actionable. Avoid generic advice.

## TRANSCRIPT
"""
${transcript}
"""

## VERBAL DELIVERY
- Speaking pace: ${verbal.wpm} WPM (ideal: 130-160 for pitches)
- Filler words: ${
  verbal.filler_words.length > 0
    ? verbal.filler_words.map((f) => `"${f.word}" ×${f.count}`).join(", ")
    : "None detected"
}
- Clarity score: ${verbal.clarity_score}/100
- Conciseness: ${verbal.conciseness}
- Pacing: ${verbal.pacing_assessment}

## STORY STRUCTURE (4/4 elements needed)
- ✅/❌ Problem: ${structure.has_problem ? "Present" : "MISSING"}
- ✅/❌ Solution: ${structure.has_solution ? "Present" : "MISSING"}
- ✅/❌ Traction: ${structure.has_traction ? "Present" : "MISSING"}
- ✅/❌ Ask: ${structure.has_ask ? "Present" : "MISSING"}
- Elements present: ${structureScore}/4
- Notes: ${structure.structure_notes}
- Missing elements: ${structure.missing_elements.join(", ") || "None"}

## BODY LANGUAGE
- Eye contact: ${bodyLanguage.eye_contact_pct}% of recording
- Posture score: ${bodyLanguage.posture_score}/100
- Gesture score: ${bodyLanguage.gesture_score}/100
- Notes: ${bodyLanguage.body_language_notes}

Use the confidence_synthesis tool to provide your final assessment. Focus on the 3-5 highest-impact improvements the founder should make before their next pitch.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Feedback synthesis failed: no tool use response");
  }

  const input = toolUse.input as Omit<OverallFeedback, "grade"> & { suggested_script?: string };
  return {
    ...input,
    grade: scoreToGrade(input.overall_score),
    suggested_script: input.suggested_script ?? "",
  };
}
