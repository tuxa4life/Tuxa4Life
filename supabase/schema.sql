-- Site content store: one row per section, JSONB value.
-- Edit content directly in the Supabase dashboard table editor —
-- no code changes or redeploys needed (content is fetched at request time).
--
-- Valid keys and their JSON shapes mirror src/lib/types.ts (SiteContent):
--   profile, skills, experience, education, achievements, projects

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on edits
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Public read-only access (the site reads with the anon key);
-- writes only via the dashboard / service role.
alter table public.site_content enable row level security;

drop policy if exists "Public read access" on public.site_content;
create policy "Public read access"
  on public.site_content for select
  using (true);
