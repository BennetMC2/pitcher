export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  isFiller?: boolean;
}

export interface FillerWord {
  word: string;
  count: number;
}

export interface PriorityImprovement {
  tip: string;
  category: "verbal" | "structure" | "body_language" | "overall";
  impact: "high" | "medium" | "low";
}

export interface VerbalAnalysis {
  wpm: number;
  filler_words: FillerWord[];
  clarity_score: number; // 0-100
  conciseness: string;
  pacing_assessment: string;
}

export interface StoryStructure {
  has_problem: boolean;
  has_solution: boolean;
  has_traction: boolean;
  has_ask: boolean;
  structure_notes: string;
  missing_elements: string[];
}

export interface BodyLanguageAnalysis {
  eye_contact_pct: number; // 0-100
  posture_score: number; // 0-100
  gesture_score: number; // 0-100
  body_language_notes: string;
}

export interface OverallFeedback {
  overall_score: number; // 0-100
  grade: string; // A+, A, B+, etc.
  confidence_level: string; // "High", "Medium", "Developing"
  top_strengths: string[];
  priority_improvements: PriorityImprovement[];
  suggested_script: string;
}

export interface FeedbackReport {
  id: string;
  session_id: string;
  transcript: string;
  word_timestamps: WordTimestamp[];
  verbal: VerbalAnalysis;
  structure: StoryStructure;
  body_language: BodyLanguageAnalysis;
  overall: OverallFeedback;
}

export interface MediaPipeFrameData {
  timestamp: number;
  faceLandmarks?: { x: number; y: number; z: number }[][];
  poseLandmarks?: { x: number; y: number; z: number; visibility?: number }[][];
}

export type RecordingPhase =
  | "idle"
  | "ready"
  | "countdown"
  | "recording"
  | "review"
  | "uploading"
  | "processing";
