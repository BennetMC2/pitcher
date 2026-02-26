-- Increment pitches_used_this_month for a user
create or replace function public.increment_pitch_usage(uid uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.subscriptions (user_id, pitches_used_this_month)
  values (uid, 1)
  on conflict (user_id) do update
    set pitches_used_this_month = subscriptions.pitches_used_this_month + 1;
end;
$$;

-- Monthly reset cron (call from Supabase Edge Function scheduled job)
create or replace function public.reset_monthly_usage()
returns void language plpgsql security definer as $$
begin
  update public.subscriptions
  set
    pitches_used_this_month = 0,
    month_reset_at = now()
  where plan = 'free'
    or (plan = 'pro' and status = 'active');
end;
$$;
