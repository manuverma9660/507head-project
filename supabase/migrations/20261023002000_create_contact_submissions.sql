create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 320),
  topic text,
  message text not null check (char_length(message) between 10 and 3000),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Visitors can submit a validated message, but cannot read any submissions.
drop policy if exists "Anonymous users can submit contact messages" on public.contact_submissions;
create policy "Anonymous users can submit contact messages"
  on public.contact_submissions for insert to anon
  with check (
    char_length(name) between 2 and 100
    and char_length(email) between 3 and 320
    and char_length(message) between 10 and 3000
  );
