export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          challenger_id: string
          code: string
          created_at: string
          grade: string
          id: string
          score: number
          session_id: string
        }
        Insert: {
          challenger_id: string
          code?: string
          created_at?: string
          grade: string
          id?: string
          score: number
          session_id: string
        }
        Update: {
          challenger_id?: string
          code?: string
          created_at?: string
          grade?: string
          id?: string
          score?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pitch_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_purchases: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          pack_credits: number
          stripe_session_id: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          pack_credits: number
          stripe_session_id: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          pack_credits?: number
          stripe_session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          body_language_notes: string | null
          clarity_score: number | null
          conciseness: string | null
          confidence_level: string | null
          eye_contact_pct: number | null
          filler_words: Json | null
          gesture_score: number | null
          grade: string | null
          has_ask: boolean | null
          has_hook: boolean | null
          has_problem: boolean | null
          has_solution: boolean | null
          has_traction: boolean | null
          hook_notes: string | null
          id: string
          missing_elements: string[] | null
          overall_score: number | null
          pacing_assessment: string | null
          posture_score: number | null
          priority_improvements: Json | null
          session_id: string
          structure_notes: string | null
          suggested_script: string | null
          top_strengths: string[] | null
          transcript: string | null
          user_id: string
          word_timestamps: Json | null
          wpm: number | null
        }
        Insert: {
          body_language_notes?: string | null
          clarity_score?: number | null
          conciseness?: string | null
          confidence_level?: string | null
          eye_contact_pct?: number | null
          filler_words?: Json | null
          gesture_score?: number | null
          grade?: string | null
          has_ask?: boolean | null
          has_hook?: boolean | null
          has_problem?: boolean | null
          has_solution?: boolean | null
          has_traction?: boolean | null
          hook_notes?: string | null
          id?: string
          missing_elements?: string[] | null
          overall_score?: number | null
          pacing_assessment?: string | null
          posture_score?: number | null
          priority_improvements?: Json | null
          session_id: string
          structure_notes?: string | null
          suggested_script?: string | null
          top_strengths?: string[] | null
          transcript?: string | null
          user_id: string
          word_timestamps?: Json | null
          wpm?: number | null
        }
        Update: {
          body_language_notes?: string | null
          clarity_score?: number | null
          conciseness?: string | null
          confidence_level?: string | null
          eye_contact_pct?: number | null
          filler_words?: Json | null
          gesture_score?: number | null
          grade?: string | null
          has_ask?: boolean | null
          has_hook?: boolean | null
          has_problem?: boolean | null
          has_solution?: boolean | null
          has_traction?: boolean | null
          hook_notes?: string | null
          id?: string
          missing_elements?: string[] | null
          overall_score?: number | null
          pacing_assessment?: string | null
          posture_score?: number | null
          priority_improvements?: Json | null
          session_id?: string
          structure_notes?: string | null
          suggested_script?: string | null
          top_strengths?: string[] | null
          transcript?: string | null
          user_id?: string
          word_timestamps?: Json | null
          wpm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "pitch_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_sessions: {
        Row: {
          analysis_step: string | null
          body_language_raw: Json | null
          created_at: string
          duration_seconds: number | null
          goal: string | null
          id: string
          is_paid: boolean
          status: string
          title: string
          updated_at: string
          user_id: string
          video_path: string | null
        }
        Insert: {
          analysis_step?: string | null
          body_language_raw?: Json | null
          created_at?: string
          duration_seconds?: number | null
          goal?: string | null
          id?: string
          is_paid?: boolean
          status?: string
          title?: string
          updated_at?: string
          user_id: string
          video_path?: string | null
        }
        Update: {
          analysis_step?: string | null
          body_language_raw?: Json | null
          created_at?: string
          duration_seconds?: number | null
          goal?: string | null
          id?: string
          is_paid?: boolean
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_path?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          credits: number
          pitches_used: number
          stripe_customer_id: string | null
          user_id: string
        }
        Insert: {
          credits?: number
          pitches_used?: number
          stripe_customer_id?: string | null
          user_id: string
        }
        Update: {
          credits?: number
          pitches_used?: number
          stripe_customer_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: { Args: { amount: number; uid: string }; Returns: undefined }
      deduct_credit: { Args: { uid: string }; Returns: boolean }
      increment_pitch_usage: { Args: { uid: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
