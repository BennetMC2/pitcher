import type { PitchGoal } from "@/lib/constants";

export interface GoalOption {
  id: PitchGoal;
  label: string;
  icon: string;
  description: string;
}

export const PITCH_GOALS: GoalOption[] = [
  {
    id: "startup_pitch",
    label: "Startup Pitch",
    icon: "🚀",
    description: "Pitching investors or accelerators",
  },
  {
    id: "sales_pitch",
    label: "Sales Pitch",
    icon: "💰",
    description: "Selling a product or service",
  },
  {
    id: "job_interview",
    label: "Job Interview",
    icon: "💼",
    description: "Introducing yourself to an employer",
  },
  {
    id: "conference_talk",
    label: "Conference Talk",
    icon: "🎤",
    description: "Opening a talk or presentation",
  },
  {
    id: "rizz_check",
    label: "Rizz Check",
    icon: "😏",
    description: "Pitch yourself to a potential date",
  },
  {
    id: "general",
    label: "General",
    icon: "🗣️",
    description: "Any other pitch or introduction",
  },
];

interface StructureElement {
  key: string;
  label: string;
  aiDescription: string;
}

interface StructureConfig {
  elements: StructureElement[];
  aiPromptContext: string;
  hookTips: string[];
}

const configs: Record<PitchGoal, StructureConfig> = {
  startup_pitch: {
    elements: [
      { key: "has_problem", label: "Problem", aiDescription: "Does the pitch clearly articulate the problem being solved?" },
      { key: "has_solution", label: "Solution", aiDescription: "Does the pitch explain the solution/product?" },
      { key: "has_traction", label: "Traction", aiDescription: "Does the pitch mention traction, metrics, users, revenue, or validation?" },
      { key: "has_ask", label: "Ask", aiDescription: "Does the pitch include a clear ask (funding amount, partnerships, intro requests)?" },
    ],
    aiPromptContext: "You are an expert startup pitch coach and former VC analyst. Analyze the narrative structure of this elevator pitch for investors.",
    hookTips: [
      "Open with a surprising stat about the market or problem size",
      "Ask a provocative question that makes the listener lean in",
      "Share a brief personal anecdote that illustrates the pain point",
      "Make a bold claim about the future your product creates",
    ],
  },
  sales_pitch: {
    elements: [
      { key: "has_problem", label: "Pain Point", aiDescription: "Does the pitch identify a specific customer pain point or frustration?" },
      { key: "has_solution", label: "Value Prop", aiDescription: "Does the pitch clearly articulate the unique value proposition?" },
      { key: "has_traction", label: "Social Proof", aiDescription: "Does the pitch include social proof — testimonials, case studies, client names, or results?" },
      { key: "has_ask", label: "Call to Action", aiDescription: "Does the pitch end with a clear call to action (book a demo, start a trial, next steps)?" },
    ],
    aiPromptContext: "You are an expert sales coach. Analyze the narrative structure of this sales pitch.",
    hookTips: [
      "Lead with a result a similar customer achieved",
      "Ask about a pain point you know they're experiencing",
      "Share a surprising industry stat that reframes their problem",
      "Start with 'What if you could...' to paint the desired outcome",
    ],
  },
  job_interview: {
    elements: [
      { key: "has_problem", label: "Relevant Experience", aiDescription: "Does the speaker highlight relevant experience and skills for the role?" },
      { key: "has_solution", label: "Enthusiasm", aiDescription: "Does the speaker convey genuine enthusiasm for the role and company?" },
      { key: "has_traction", label: "Cultural Fit", aiDescription: "Does the speaker demonstrate understanding of the company culture and how they'd fit in?" },
      { key: "has_ask", label: "Specific Examples", aiDescription: "Does the speaker provide specific, concrete examples of past achievements?" },
    ],
    aiPromptContext: "You are an expert career coach and former hiring manager. Analyze this self-introduction or interview answer.",
    hookTips: [
      "Open with your most impressive relevant achievement",
      "Start with what specifically excites you about this company",
      "Lead with a brief story about a problem you solved that relates to the role",
      "Share a number that quantifies your impact in a previous role",
    ],
  },
  conference_talk: {
    elements: [
      { key: "has_problem", label: "Hook/Thesis", aiDescription: "Does the talk open with a compelling hook and clear thesis statement?" },
      { key: "has_solution", label: "Core Argument", aiDescription: "Does the talk present a clear core argument or central idea?" },
      { key: "has_traction", label: "Supporting Evidence", aiDescription: "Does the talk include supporting evidence, data, or examples?" },
      { key: "has_ask", label: "Takeaway", aiDescription: "Does the talk end with a clear, memorable takeaway for the audience?" },
    ],
    aiPromptContext: "You are an expert public speaking coach and TED talk advisor. Analyze the narrative structure of this talk opening or presentation.",
    hookTips: [
      "Start with a bold, counterintuitive statement that challenges conventional wisdom",
      "Open with a vivid story that brings the audience into the scene",
      "Ask the audience to imagine a specific scenario",
      "Present a startling statistic that reframes the topic",
    ],
  },
  rizz_check: {
    elements: [
      { key: "has_problem", label: "The Hook", aiDescription: "Does the speaker open with a charming, funny, or intriguing hook that makes someone want to keep listening?" },
      { key: "has_solution", label: "The Vibe", aiDescription: "Does the speaker convey genuine personality, warmth, and confidence — not arrogance?" },
      { key: "has_traction", label: "The Proof", aiDescription: "Does the speaker share something specific and memorable about themselves — a passion, story, or quirk that makes them stand out?" },
      { key: "has_ask", label: "The Close", aiDescription: "Does the speaker end with a smooth, clear next step — asking for a number, suggesting a date, or leaving a lasting impression?" },
    ],
    aiPromptContext: "You are a brutally honest but supportive dating coach with a great sense of humor. Analyze this person's self-introduction as if they're trying to impress someone they just met at a bar, coffee shop, or dating event. Be fun and witty in your feedback.",
    hookTips: [
      "Open with a playful, unexpected question — not 'Hey, what's your name?'",
      "Lead with a funny observation about the situation you're both in",
      "Share a quick, charming story that shows your personality",
      "Make a bold, confident statement with a smile — rizz is energy, not words",
    ],
  },
  general: {
    elements: [
      { key: "has_problem", label: "Opening", aiDescription: "Does the speaker have a clear, engaging opening that captures attention?" },
      { key: "has_solution", label: "Main Message", aiDescription: "Does the speaker convey a clear main message or point?" },
      { key: "has_traction", label: "Supporting Points", aiDescription: "Does the speaker include supporting points, examples, or evidence?" },
      { key: "has_ask", label: "Closing", aiDescription: "Does the speaker end with a clear closing or call to action?" },
    ],
    aiPromptContext: "You are an expert communication coach. Analyze the narrative structure of this pitch or presentation.",
    hookTips: [
      "Open with something unexpected to grab attention",
      "Ask a question that makes the listener think",
      "Share a brief, relatable story",
      "Start with a bold statement you can back up",
    ],
  },
};

export function getStructureConfig(goal: PitchGoal): StructureConfig {
  return configs[goal] ?? configs.general;
}

export function getGoalLabel(goal: PitchGoal): string {
  return PITCH_GOALS.find((g) => g.id === goal)?.label ?? "General";
}
