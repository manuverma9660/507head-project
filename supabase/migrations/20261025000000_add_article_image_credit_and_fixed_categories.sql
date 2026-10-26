-- Model a visible image credit separately from an editorial caption.
alter table public.articles
  add column if not exists featured_image_caption text,
  add column if not exists featured_image_credit text;

-- The public taxonomy is intentionally limited to the seven handbook slugs.
update public.categories
set is_active = false,
    show_on_home = false,
    updated_at = now()
where slug not in ('history', 'farming', 'kisan', 'wisdom', 'heritage', 'pashupalan', 'food');

create or replace function public.enforce_fixed_category_slug()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.slug not in ('history', 'farming', 'kisan', 'wisdom', 'heritage', 'pashupalan', 'food') then
    raise exception 'Only the seven approved 507 Head category slugs may be created or changed.';
  end if;
  return new;
end;
$$;

drop trigger if exists categories_require_fixed_slug on public.categories;
create trigger categories_require_fixed_slug
before insert or update of slug on public.categories
for each row execute function public.enforce_fixed_category_slug();
