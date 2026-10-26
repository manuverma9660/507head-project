-- Minimal deterministic local data. The category-sync migration supplies labels.
insert into public.categories (slug, name, description, sort_order, is_active, show_on_home)
values
  ('history', 'History', '', 1, true, true),
  ('farming', 'Farming', '', 2, true, true),
  ('kisan', 'Kisan', '', 3, true, true),
  ('wisdom', 'Wisdom', '', 4, true, true),
  ('heritage', 'Heritage', '', 5, true, true),
  ('pashupalan', 'Pashupalan', '', 6, true, true),
  ('food', 'Food', '', 7, true, true)
on conflict (slug) do update set
  sort_order = excluded.sort_order,
  is_active = true,
  show_on_home = true,
  updated_at = now();
