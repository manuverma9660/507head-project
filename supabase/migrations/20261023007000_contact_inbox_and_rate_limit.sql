create table if not exists public.contact_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.allow_contact_submission(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  insert into public.contact_rate_limits (fingerprint, submission_count)
  values (p_fingerprint, 1)
  on conflict (fingerprint) do update
  set
    submission_count = case when contact_rate_limits.window_started_at < now() - interval '10 minutes' then 1 else contact_rate_limits.submission_count + 1 end,
    window_started_at = case when contact_rate_limits.window_started_at < now() - interval '10 minutes' then now() else contact_rate_limits.window_started_at end,
    updated_at = now()
  returning submission_count <= 3 into allowed;
  return allowed;
end;
$$;

revoke all on public.contact_rate_limits from anon, authenticated;
grant execute on function public.allow_contact_submission(text) to anon, authenticated;

drop policy if exists "Administrators can read contact submissions" on public.contact_submissions;
create policy "Administrators can read contact submissions"
  on public.contact_submissions for select to authenticated
  using (
    exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true)
  );
