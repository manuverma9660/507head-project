-- The project already stores settings as key/value JSON records.
-- Preserve that schema and add the single public-site record only if absent.
insert into public.site_settings (key, value)
values ('site', '{"site_name":"507 Head","site_url":"https://507head.com","contact_email":"contact@507head.com","location":"Chhatargarh tehsil, Bikaner, Rajasthan","default_description":"507 Head - Hindi news, reports and local knowledge.","instagram_url":"","facebook_url":""}'::jsonb)
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public users can read site settings" on public.site_settings;
create policy "Public users can read site settings"
  on public.site_settings for select using (true);

drop policy if exists "Administrators manage site settings" on public.site_settings;
create policy "Administrators manage site settings"
  on public.site_settings for all to authenticated
  using (
    exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true)
  )
  with check (
    exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true)
  );
