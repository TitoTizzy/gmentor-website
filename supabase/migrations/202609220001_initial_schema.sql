create extension if not exists pgcrypto;

create type public.app_role as enum ('developer', 'mentor');
create type public.contact_status as enum ('new', 'contacted', 'potential', 'accepted', 'closed', 'spam');
create type public.publication_status as enum ('draft', 'published', 'archived');
create type public.media_kind as enum ('cover', 'image', 'plan', 'drawing', 'portfolio');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name public.app_role unique not null
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  preferred_locale text not null default 'fr' check (preferred_locale in ('en','fr')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  mfa_required boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.markets (
  code text primary key check (code in ('us','ht')),
  name text not null,
  default_locale text not null check (default_locale in ('en','fr','kr'))
);

create table public.languages (
  code text primary key check (code in ('en','fr','kr')),
  name text not null
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  sort_order integer not null default 0,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.service_translations (
  service_id uuid references public.services(id) on delete cascade,
  locale text references public.languages(code),
  market_code text references public.markets(code),
  title text not null,
  description text,
  primary key (service_id, locale, market_code)
);

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label_fr text not null,
  label_en text not null,
  label_kr text not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_id uuid references public.project_categories(id),
  country text,
  city text,
  year integer check (year between 1900 and 2100),
  role_text text,
  credits_text text,
  status public.publication_status not null default 'draft',
  hero_enabled boolean not null default false,
  hero_order integer,
  cover_media_id uuid,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.project_translations (
  project_id uuid references public.projects(id) on delete cascade,
  locale text references public.languages(code),
  title text not null,
  summary text,
  body text,
  primary key (project_id, locale)
);

create table public.project_markets (
  project_id uuid references public.projects(id) on delete cascade,
  market_code text references public.markets(code),
  primary key (project_id, market_code)
);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  kind public.media_kind not null,
  original_path text not null,
  public_path text,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  width integer,
  height integer,
  alt_fr text,
  alt_en text,
  alt_kr text,
  watermarked boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects add constraint projects_cover_media_fk foreign key (cover_media_id) references public.project_media(id) on delete set null;

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.portfolio_files (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  locale text not null check (locale in ('en','fr')),
  theme text not null check (theme in ('dark','light')),
  original_path text not null,
  web_path text,
  watermarked boolean not null default false,
  page_count integer,
  unique (portfolio_id, locale, theme)
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  city text not null,
  project_type text not null,
  description text,
  market_code text references public.markets(code),
  locale text not null check (locale in ('en','fr','kr')),
  uses_whatsapp boolean not null default false,
  privacy_accepted_at timestamptz not null,
  status public.contact_status not null default 'new',
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.contact_status_history (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid references public.contact_requests(id) on delete cascade,
  from_status public.contact_status,
  to_status public.contact_status not null,
  changed_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  requested_by uuid references public.users(id),
  reviewed_by uuid references public.users(id),
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.users(id),
  updated_at timestamptz not null default now()
);

create table public.market_contact_settings (
  market_code text primary key references public.markets(code),
  public_email text,
  notification_email text,
  hours jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  anonymous_session_hash text not null,
  event_name text not null,
  page_path text,
  market_code text,
  locale text,
  project_id uuid references public.projects(id) on delete set null,
  referrer_host text,
  created_at timestamptz not null default now()
);

create table public.consent_records (
  id bigint generated always as identity primary key,
  anonymous_session_hash text not null,
  analytics_accepted boolean not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles(name) values ('developer'), ('mentor');
insert into public.markets(code, name, default_locale) values ('us', 'United States', 'en'), ('ht', 'Haïti', 'fr');
insert into public.languages(code, name) values ('en', 'English'), ('fr', 'Français'), ('kr', 'Kreyòl ayisyen');
insert into public.project_categories(key, label_fr, label_en, label_kr, sort_order) values
  ('multifamily', 'Résidentiel multifamilial', 'Multifamily residential', 'Rezidans miltifamilyal', 1),
  ('private-residence', 'Résidence privée', 'Private residence', 'Rezidans prive', 2),
  ('office-institutional', 'Bureaux et projets institutionnels', 'Office and institutional', 'Biwo ak pwojè enstitisyonèl', 3);

create or replace function public.current_app_role() returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid() and active = true;
$$;

create or replace function public.has_admin_mfa() returns boolean language sql stable as $$
  select coalesce((auth.jwt()->>'aal') = 'aal2', false);
$$;

alter table public.profiles enable row level security;
alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.service_translations enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.project_markets enable row level security;
alter table public.project_media enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_files enable row level security;
alter table public.contact_requests enable row level security;
alter table public.contact_status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.deletion_requests enable row level security;
alter table public.site_settings enable row level security;
alter table public.market_contact_settings enable row level security;
alter table public.analytics_events enable row level security;
alter table public.consent_records enable row level security;
alter table public.audit_logs enable row level security;

create policy "published projects are public" on public.projects for select using (status = 'published' or (auth.uid() is not null and public.has_admin_mfa()));
create policy "published translations are public" on public.project_translations for select using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published') or (auth.uid() is not null and public.has_admin_mfa()));
create policy "published market links are public" on public.project_markets for select using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published') or (auth.uid() is not null and public.has_admin_mfa()));
create policy "public services readable" on public.services for select using (active = true or auth.uid() is not null);
create policy "service translations readable" on public.service_translations for select using (true);
create policy "categories readable" on public.project_categories for select using (true);
create policy "admins manage projects" on public.projects for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins manage project content" on public.project_translations for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins manage project markets" on public.project_markets for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins manage media" on public.project_media for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins manage portfolios" on public.portfolios for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins manage portfolio files" on public.portfolio_files for all using (auth.uid() is not null and public.has_admin_mfa()) with check (auth.uid() is not null and public.has_admin_mfa());
create policy "admins read contacts" on public.contact_requests for select using (auth.uid() is not null and public.has_admin_mfa());
create policy "admins update contacts" on public.contact_requests for update using (auth.uid() is not null and public.has_admin_mfa());
create policy "admins view logs" on public.audit_logs for select using (public.current_app_role() = 'developer' and public.has_admin_mfa());
create policy "developer manages categories" on public.project_categories for all using (public.current_app_role() = 'developer' and public.has_admin_mfa()) with check (public.current_app_role() = 'developer' and public.has_admin_mfa());
create policy "developer reviews deletions" on public.deletion_requests for update using (public.current_app_role() = 'developer' and public.has_admin_mfa());

create index projects_publication_idx on public.projects(status, published_at desc);
create index contact_status_idx on public.contact_requests(status, created_at desc);
create index analytics_created_idx on public.analytics_events(created_at desc, event_name);

create or replace function public.purge_closed_contact_requests() returns integer language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  with deleted as (
    delete from public.contact_requests
    where status = 'closed' and closed_at < now() - interval '6 months'
    returning id
  )
  select count(*) into deleted_count from deleted;
  insert into public.audit_logs(action, entity_type, metadata)
  values ('scheduled_purge', 'contact_request', jsonb_build_object('deleted_count', deleted_count));
  return deleted_count;
end;
$$;

insert into storage.buckets(id, name, public) values
  ('project-originals', 'project-originals', false),
  ('portfolio-originals', 'portfolio-originals', false),
  ('public-watermarked', 'public-watermarked', true)
on conflict (id) do nothing;

create policy "public reads watermarked media" on storage.objects for select using (bucket_id = 'public-watermarked');
create policy "mfa admins manage media" on storage.objects for all using (bucket_id in ('project-originals','portfolio-originals','public-watermarked') and public.has_admin_mfa()) with check (bucket_id in ('project-originals','portfolio-originals','public-watermarked') and public.has_admin_mfa());
