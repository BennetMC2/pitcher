-- ============================================================
-- 004: Credit Pack Billing Model
-- Replaces monthly subscription with one-time credit purchases
-- ============================================================

-- ── 1. Modify subscriptions table ──────────────────────────

-- Add new columns
alter table subscriptions add column if not exists credits integer not null default 0;
alter table subscriptions add column if not exists pitches_used integer not null default 0;

-- Copy existing usage data to new column
update subscriptions set pitches_used = pitches_used_this_month;

-- Drop CHECK constraints on plan and status before dropping columns
alter table subscriptions drop constraint if exists subscriptions_plan_check;
alter table subscriptions drop constraint if exists subscriptions_status_check;

-- Drop old columns
alter table subscriptions drop column if exists stripe_subscription_id;
alter table subscriptions drop column if exists plan;
alter table subscriptions drop column if exists status;
alter table subscriptions drop column if exists pitches_used_this_month;
alter table subscriptions drop column if exists month_reset_at;
alter table subscriptions drop column if exists current_period_end;

-- ── 2. Modify pitch_sessions table ─────────────────────────

alter table pitch_sessions add column if not exists is_paid boolean not null default false;

-- ── 3. Create credit_purchases audit table ──────────────────

create table if not exists credit_purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text not null,
  pack_credits integer not null,
  amount_cents integer not null,
  created_at timestamptz default now() not null
);

alter table credit_purchases enable row level security;

create policy "Users can view own purchases"
  on credit_purchases for select using (auth.uid() = user_id);

-- ── 4. New RPC: deduct_credit ───────────────────────────────

create or replace function public.deduct_credit(uid uuid)
returns boolean language plpgsql security definer as $$
declare
  current_credits integer;
begin
  select credits into current_credits
  from public.subscriptions
  where user_id = uid
  for update;

  if current_credits is null or current_credits <= 0 then
    return false;
  end if;

  update public.subscriptions
  set credits = credits - 1
  where user_id = uid;

  return true;
end;
$$;

-- ── 5. New RPC: add_credits ─────────────────────────────────

create or replace function public.add_credits(uid uuid, amount integer)
returns void language plpgsql security definer as $$
begin
  update public.subscriptions
  set credits = credits + amount
  where user_id = uid;
end;
$$;

-- ── 6. Update increment_pitch_usage to use renamed column ───

create or replace function public.increment_pitch_usage(uid uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.subscriptions (user_id, pitches_used)
  values (uid, 1)
  on conflict (user_id) do update
    set pitches_used = subscriptions.pitches_used + 1;
end;
$$;

-- ── 7. Update handle_new_user — remove plan/status refs ─────

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

-- ── 8. Drop reset_monthly_usage — no longer needed ──────────

drop function if exists public.reset_monthly_usage();
