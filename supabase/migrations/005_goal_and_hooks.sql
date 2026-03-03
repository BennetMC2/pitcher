ALTER TABLE pitch_sessions
  ADD COLUMN IF NOT EXISTS goal text DEFAULT 'startup_pitch';

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS has_hook boolean,
  ADD COLUMN IF NOT EXISTS hook_notes text;
