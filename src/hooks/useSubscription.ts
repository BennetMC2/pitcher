"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FREE_PITCH_LIMIT, FREE_MAX_RECORDING_SECONDS, PAID_MAX_RECORDING_SECONDS } from "@/lib/constants";

export interface SubscriptionState {
  pitchesUsed: number;
  credits: number;
  hasFreeLeft: boolean;
  canRecord: boolean;        // hasFreeLeft || credits > 0
  nextPitchIsPaid: boolean;  // !hasFreeLeft && credits > 0
  maxSeconds: number;        // 120 for free, 300 for paid
  loading: boolean;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    pitchesUsed: 0,
    credits: 0,
    hasFreeLeft: true,
    canRecord: true,
    nextPitchIsPaid: false,
    maxSeconds: FREE_MAX_RECORDING_SECONDS,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("pitches_used, credits")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const used = data.pitches_used ?? 0;
        const credits = data.credits ?? 0;
        const hasFreeLeft = used < FREE_PITCH_LIMIT;
        const canRecord = hasFreeLeft || credits > 0;
        const nextPitchIsPaid = !hasFreeLeft && credits > 0;
        const maxSeconds = nextPitchIsPaid
          ? PAID_MAX_RECORDING_SECONDS
          : FREE_MAX_RECORDING_SECONDS;

        setState({
          pitchesUsed: used,
          credits,
          hasFreeLeft,
          canRecord,
          nextPitchIsPaid,
          maxSeconds,
          loading: false,
        });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    }
    load();
  }, []);

  return state;
}
