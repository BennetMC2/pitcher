-- Challenge a friend: viral growth mechanic
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default encode(gen_random_bytes(6), 'hex'),
  challenger_id uuid not null references auth.users(id),
  session_id uuid not null references pitch_sessions(id),
  score integer not null,
  grade text not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookup by code
create index if not exists challenges_code_idx on challenges(code);

-- RLS
alter table challenges enable row level security;

-- Anyone can read challenges (public share links)
create policy "Challenges are publicly readable"
  on challenges for select
  using (true);

-- Users can only create challenges for their own sessions
create policy "Users can create own challenges"
  on challenges for insert
  with check (challenger_id = auth.uid());

-- Add analysis_step column to pitch_sessions for pipeline progress tracking
alter table pitch_sessions add column if not exists analysis_step text;
