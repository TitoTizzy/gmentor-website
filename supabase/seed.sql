-- Demo records deliberately omit unconfirmed years, roles, credits and contact details.
insert into public.services(key, sort_order, featured) values
  ('architecture', 1, true), ('interior', 2, true), ('renovation', 3, true),
  ('rendering', 4, true), ('feasibility', 5, true), ('coordination', 6, true)
on conflict (key) do nothing;

insert into public.site_settings(key, value) values
  ('branding', '{"logo_light":"/assets/mgm-mark-black.png","logo_dark":"/assets/mgm-mark-white.png","favicon":"/favicon.svg","watermark_logo":"/assets/mgm-mark-black.png"}'::jsonb),
  ('analytics', '{"enabled_after_consent":true,"dashboard_refresh_minutes":60}'::jsonb)
on conflict (key) do update set value = excluded.value;
