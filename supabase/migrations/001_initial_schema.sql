-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.subscriptions (user_id)
  values (new.id);

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  pitches_used_this_month integer not null default 0,
  month_reset_at timestamptz,
  current_period_end timestamptz
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- PITCH SESSIONS
-- ============================================================
create table if not exists pitch_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Pitch',
  status text not null default 'uploading'
    check (status in ('uploading', 'processing', 'complete', 'failed')),
  video_path text,
  body_language_raw jsonb,
  duration_seconds float,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table pitch_sessions enable row level security;

create policy "Users can view own sessions"
  on pitch_sessions for select using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on pitch_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on pitch_sessions for update using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on pitch_sessions for delete using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pitch_sessions_updated_at
  before update on pitch_sessions
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- FEEDBACK
-- ============================================================
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null unique references pitch_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Transcript
  transcript text,
  word_timestamps jsonb,
  -- Verbal
  wpm float,
  filler_words jsonb,
  clarity_score integer,
  conciseness text,
  pacing_assessment text,
  -- Story structure
  has_problem boolean,
  has_solution boolean,
  has_traction boolean,
  has_ask boolean,
  structure_notes text,
  missing_elements text[],
  -- Body language
  eye_contact_pct float,
  posture_score integer,
  gesture_score integer,
  body_language_notes text,
  -- Overall
  overall_score integer,
  grade text,
  confidence_level text,
  top_strengths text[],
  priority_improvements jsonb
);

alter table feedback enable row level security;

create policy "Users can view own feedback"
  on feedback for select using (auth.uid() = user_id);

-- ============================================================
-- STORAGE
-- ============================================================
insert into storage.buckets (id, name, public)
values ('pitch-videos', 'pitch-videos', false)
on conflict (id) do nothing;

create policy "Users can upload own videos"
  on storage.objects for insert
  with check (bucket_id = 'pitch-videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own videos"
  on storage.objects for select
  using (bucket_id = 'pitch-videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own videos"
  on storage.objects for delete
  using (bucket_id = 'pitch-videos' and auth.uid()::text = (storage.foldername(name))[1]);
