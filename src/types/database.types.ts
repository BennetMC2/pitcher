export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          stripe_customer_id: string | null;
          credits: number;
          pitches_used: number;
        };
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          credits?: number;
          pitches_used?: number;
        };
        Update: {
          user_id?: string;
          stripe_customer_id?: string | null;
          credits?: number;
          pitches_used?: number;
        };
        Relationships: [];
      };
      pitch_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: string;
          video_path: string | null;
          body_language_raw: Json | null;
          duration_seconds: number | null;
          is_paid: boolean;
          goal: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          status?: string;
          video_path?: string | null;
          body_language_raw?: Json | null;
          duration_seconds?: number | null;
          is_paid?: boolean;
          goal?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          status?: string;
          video_path?: string | null;
          body_language_raw?: Json | null;
          duration_seconds?: number | null;
          is_paid?: boolean;
          goal?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          transcript: string | null;
          word_timestamps: Json | null;
          wpm: number | null;
          filler_words: Json | null;
          clarity_score: number | null;
          conciseness: string | null;
          pacing_assessment: string | null;
          has_problem: boolean | null;
          has_solution: boolean | null;
          has_traction: boolean | null;
          has_ask: boolean | null;
          structure_notes: string | null;
          missing_elements: string[] | null;
          eye_contact_pct: number | null;
          posture_score: number | null;
          gesture_score: number | null;
          body_language_notes: string | null;
          overall_score: number | null;
          grade: string | null;
          confidence_level: string | null;
          top_strengths: string[] | null;
          priority_improvements: Json | null;
          suggested_script: string | null;
          has_hook: boolean | null;
          hook_notes: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          transcript?: string | null;
          word_timestamps?: Json | null;
          wpm?: number | null;
          filler_words?: Json | null;
          clarity_score?: number | null;
          conciseness?: string | null;
          pacing_assessment?: string | null;
          has_problem?: boolean | null;
          has_solution?: boolean | null;
          has_traction?: boolean | null;
          has_ask?: boolean | null;
          structure_notes?: string | null;
          missing_elements?: string[] | null;
          eye_contact_pct?: number | null;
          posture_score?: number | null;
          gesture_score?: number | null;
          body_language_notes?: string | null;
          overall_score?: number | null;
          grade?: string | null;
          confidence_level?: string | null;
          top_strengths?: string[] | null;
          priority_improvements?: Json | null;
          suggested_script?: string | null;
          has_hook?: boolean | null;
          hook_notes?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          transcript?: string | null;
          word_timestamps?: Json | null;
          wpm?: number | null;
          filler_words?: Json | null;
          clarity_score?: number | null;
          conciseness?: string | null;
          pacing_assessment?: string | null;
          has_problem?: boolean | null;
          has_solution?: boolean | null;
          has_traction?: boolean | null;
          has_ask?: boolean | null;
          structure_notes?: string | null;
          missing_elements?: string[] | null;
          eye_contact_pct?: number | null;
          posture_score?: number | null;
          gesture_score?: number | null;
          body_language_notes?: string | null;
          overall_score?: number | null;
          grade?: string | null;
          confidence_level?: string | null;
          top_strengths?: string[] | null;
          priority_improvements?: Json | null;
          suggested_script?: string | null;
          has_hook?: boolean | null;
          hook_notes?: string | null;
        };
        Relationships: [];
      };
      credit_purchases: {
        Row: {
          id: string;
          user_id: string;
          stripe_session_id: string;
          pack_credits: number;
          amount_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_session_id: string;
          pack_credits: number;
          amount_cents: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_session_id?: string;
          pack_credits?: number;
          amount_cents?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_pitch_usage: {
        Args: { uid: string };
        Returns: undefined;
      };
      deduct_credit: {
        Args: { uid: string };
        Returns: boolean;
      };
      add_credits: {
        Args: { uid: string; amount: number };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
