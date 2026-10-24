-- Keep the Supabase taxonomy aligned with the seven fixed website categories.
insert into public.categories (
  slug,
  name,
  description,
  sort_order,
  is_active,
  show_on_home
)
values
  ('history', 'इतिहास और विरासत', '507 हेड, बीकानेर और थार मरुस्थल की ऐतिहासिक धरोहर, पुराने रास्ते और जनजीवन।', 1, true, true),
  ('farming', 'खेती-बाड़ी', 'परंपरागत मरुस्थलीय खेती, नहरी सिंचाई, आधुनिक तकनीकें और उन्नत फसलें।', 2, true, true),
  ('kisan', 'किसान', 'गांव और देश की रीढ़, किसानों का परिश्रम, अनुभव और संघर्ष।', 3, true, true),
  ('wisdom', 'बुजुर्गों की सीख', 'पीढ़ियों के गहरे अनुभव, लोक सूक्तियां और जीवन की व्यावहारिक समझ।', 4, true, true),
  ('heritage', 'सांस्कृतिक विरासत', 'राजस्थानी लोक संस्कृति, पारंपरिक रीति-रिवाज, लोकगीत और स्थानीय कला।', 5, true, true),
  ('pashupalan', 'पशुपालन', 'राठी गाय, ऊंट, डेयरी व्यवसाय और मरुस्थल में पशुधन संरक्षण की जानकारी।', 6, true, true),
  ('food', 'खान-पान', 'पारंपरिक मरुस्थलीय व्यंजन, बाजरे की रोटी, कैर-सांगरी और पौष्टिक देशी स्वाद।', 7, true, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  show_on_home = true,
  updated_at = now();

-- Preserve old records for audit/reference, but remove them from the live taxonomy.
update public.categories
set is_active = false,
    show_on_home = false,
    updated_at = now()
where slug in ('news', 'kheti', 'shikhsa');
