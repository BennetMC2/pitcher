import Anthropic from "@anthropic-ai/sdk";
import type { VerbalAnalysis, StoryStructure } from "@/types/feedback.types";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ── Verbal Analysis ──────────────────────────────────────────────────────────

const verbalTool: Anthropic.Tool = {
  name: "verbal_analysis",
  description: "Analyze speech delivery metrics from a pitch transcript",
  input_schema: {
    type: "object" as const,
    properties: {
      wpm: {
        type: "number",
        description: "Words per minute calculated from transcript and duration",
      },
      filler_words: {
        type: "array",
        items: {
          type: "object",
          properties: {
            word: { type: "string" },
            count: { type: "number" },
          },
          required: ["word", "count"],
        },
        description: "List of filler words found (um, uh, like, you know, literally, basically, right, so, actually)",
      },
      clarity_score: {
        type: "number",
        description: "0-100 score for clarity and articulation. 90+ = very clear, 70-89 = good, 50-69 = needs work, <50 = hard to follow",
      },
      conciseness: {
        type: "string",
        enum: ["too_brief", "concise", "slightly_verbose", "verbose"],
        description: "Assessment of whether the pitch respects listener time",
      },
      pacing_assessment: {
        type: "string",
        description: "2-3 sentence assessment of speaking pace, rhythm, and pauses. Be specific about what was good/bad.",
      },
    },
    required: ["wpm", "filler_words", "clarity_score", "conciseness", "pacing_assessment"],
  },
};

export async function analyzeVerbalDelivery(
  transcript: string,
  durationSeconds: number
): Promise<VerbalAnalysis> {
  const wordCount = transcript.trim().split(/\s+/).length;
  const durationMinutes = durationSeconds / 60;
  const calculatedWpm = Math.round(wordCount / durationMinutes);

  const response = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    tools: [verbalTool],
    tool_choice: { type: "tool", name: "verbal_analysis" },
    messages: [
      {
        role: "user",
        content: `You are an expert pitch coach analyzing a startup founder's elevator pitch transcript.

Analyze the verbal delivery of this pitch. The recording is ${durationSeconds} seconds long and contains ${wordCount} words (approximately ${calculatedWpm} WPM).

TRANSCRIPT:
"""
${transcript}
"""

Be accurate when identifying filler words — only count words that appear in the actual transcript. Use the verbal_analysis tool to return structured feedback.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Verbal analysis failed: no tool use response");
  }

  const input = toolUse.input as VerbalAnalysis;
  // Ensure wpm is set from actual calculation if model returns nonsense
  return { ...input, wpm: calculatedWpm };
}

// ── Story Structure ──────────────────────────────────────────────────────────

const structureTool: Anthropic.Tool = {
  name: "story_structure",
  description: "Analyze startup pitch story structure",
  input_schema: {
    type: "object" as const,
    properties: {
      has_problem: {
        type: "boolean",
        description: "Does the pitch clearly articulate the problem being solved?",
      },
      has_solution: {
        type: "boolean",
        description: "Does the pitch explain the solution/product?",
      },
      has_traction: {
        type: "boolean",
        description: "Does the pitch mention traction, metrics, users, revenue, or validation?",
      },
      has_ask: {
        type: "boolean",
        description: "Does the pitch include a clear ask (funding amount, partnerships, intro requests)?",
      },
      structure_notes: {
        type: "string",
        description: "2-3 sentence assessment of the narrative flow. What works, what's missing, how the story lands.",
      },
      missing_elements: {
        type: "array",
        items: { type: "string" },
        description: "List of missing or weak narrative elements with brief explanation of why each matters",
      },
    },
    required: ["has_problem", "has_solution", "has_traction", "has_ask", "structure_notes", "missing_elements"],
  },
};

export async function analyzeStoryStructure(
  transcript: string
): Promise<StoryStructure> {
  const response = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    tools: [structureTool],
    tool_choice: { type: "tool", name: "story_structure" },
    messages: [
      {
        role: "user",
        content: `You are an expert startup pitch coach and former VC analyst. Analyze the narrative structure of this elevator pitch for investors.

Evaluate whether the pitch covers the four essential startup pitch elements:
1. PROBLEM — Is there a clear, compelling problem statement?
2. SOLUTION — Is there a crisp explanation of the product/solution?
3. TRACTION — Is there evidence of real-world validation (users, revenue, partnerships, pilots)?
4. ASK — Is there a specific ask from the audience (funding, intros, partnerships)?

TRANSCRIPT:
"""
${transcript}
"""

Be honest and specific. Many pitches skip the ask or bury the problem. Use the story_structure tool.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Story structure analysis failed: no tool use response");
  }

  return toolUse.input as StoryStructure;
}
