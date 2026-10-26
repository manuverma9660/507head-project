-- Categories are now managed from the editorial form instead of a fixed list.
drop trigger if exists categories_require_fixed_slug on public.categories;
drop function if exists public.enforce_fixed_category_slug();
