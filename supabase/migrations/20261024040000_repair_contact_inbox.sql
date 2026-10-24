-- Make the public contact form work for both logged-out visitors and
-- authenticated staff who test the form in the same browser.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 320),
  topic text,
  message text not null check (char_length(message) between 10 and 3000),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Anonymous users can submit contact messages" on public.contact_submissions;
drop policy if exists "Visitors can submit contact messages" on public.contact_submissions;

create policy "Visitors can submit contact messages"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 2 and 100
    and char_length(trim(email)) between 3 and 320
    and char_length(trim(message)) between 10 and 3000
  );

create table if not exists public.contact_rate_limits (
  fingerprint text primary key,
  submitted_at timestamptz not null default now()
);

create or replace function public.allow_contact_submission(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_submission timestamptz;
begin
  select submitted_at into recent_submission
  from public.contact_rate_limits
  where fingerprint = p_fingerprint;

  if recent_submission is not null and recent_submission > now() - interval '1 minute' then
    return false;
  end if;

  insert into public.contact_rate_limits (fingerprint, submitted_at)
  values (p_fingerprint, now())
  on conflict (fingerprint) do update set submitted_at = excluded.submitted_at;

  return true;
end;
$$;

revoke all on function public.allow_contact_submission(text) from public;
grant execute on function public.allow_contact_submission(text) to anon, authenticated;

drop policy if exists "Administrators can read contact submissions" on public.contact_submissions;
create policy "Administrators can read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.staff_profiles
      where user_id = auth.uid()
        and role = 'admin'
        and is_active = true
    )
  );
