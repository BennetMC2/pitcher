"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface Session {
  id: string;
  title: string;
  created_at: string;
  goal: string;
}

interface SessionPickerProps {
  sessions: Session[];
  selectedA: string | null;
  selectedB: string | null;
}

export function SessionPicker({ sessions, selectedA, selectedB }: SessionPickerProps) {
  const router = useRouter();

  function handleChange(slot: "a" | "b", sessionId: string) {
    const params = new URLSearchParams();
    if (slot === "a") {
      if (sessionId) params.set("a", sessionId);
      if (selectedB) params.set("b", selectedB);
    } else {
      if (selectedA) params.set("a", selectedA);
      if (sessionId) params.set("b", sessionId);
    }
    router.push(`/dashboard/compare?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["a", "b"] as const).map((slot) => {
        const selected = slot === "a" ? selectedA : selectedB;
        const other = slot === "a" ? selectedB : selectedA;
        return (
          <div key={slot} className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {slot === "a" ? "Pitch A" : "Pitch B"}
            </label>
            <select
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              value={selected ?? ""}
              onChange={(e) => handleChange(slot, e.target.value)}
            >
              <option value="">Select a pitch…</option>
              {sessions
                .filter((s) => s.id !== other)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                  </option>
                ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
