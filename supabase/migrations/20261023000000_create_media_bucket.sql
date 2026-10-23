-- Reproducible storage setup for the admin Media Library.
-- The bucket is public so published image URLs can be rendered on the public site.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload media'
  ) then
    create policy "Authenticated users can upload media"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can list media'
  ) then
    create policy "Authenticated users can list media"
      on storage.objects for select to authenticated
      using (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete media'
  ) then
    create policy "Authenticated users can delete media"
      on storage.objects for delete to authenticated
      using (bucket_id = 'media');
  end if;
end;
$$;
