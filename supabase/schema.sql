-- Site content store: one row per section, JSONB value.
-- Edit content directly in the Supabase dashboard table editor —
-- no code changes or redeploys needed (content is fetched at request time).
--
-- Valid keys and their JSON shapes mirror src/lib/types.ts (SiteContent):
--   profile, skills, experience, education, achievements, projects
--
-- Running this whole file in the Supabase SQL editor creates the table AND
-- seeds it with the default content (see the "Seed content" section below).
-- It is safe to re-run: the seed uses ON CONFLICT DO NOTHING, so it never
-- overwrites rows you have edited in the dashboard.
-- See docs/supabase-setup.md for the full walkthrough.

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

-- ---------------------------------------------------------------------------
-- Seed content
--
-- Mirrors src/content/defaults.ts. JSON is wrapped in dollar-quote tags
-- so apostrophes, em dashes, and curly quotes need no escaping.
-- ON CONFLICT DO NOTHING keeps existing (possibly dashboard-edited) rows intact.
--
-- Note: the `projects` section is intentionally NOT seeded — the site fetches
-- projects live from GitHub and falls back to code defaults if that fails.
-- ---------------------------------------------------------------------------

insert into public.site_content (key, value) values
  ('profile', $content$
{
  "name": "Nikoloz Tukhashvili",
  "role": "Software & Web Developer",
  "location": "Rustavi, Georgia",
  "email": "nikoloztuxa@gmail.com",
  "phone": "+995 599 752 777",
  "githubUsername": "tuxa4life",
  "githubUrl": "https://github.com/tuxa4life",
  "instagramUrl": "https://www.instagram.com/n.tukh_",
  "websiteUrl": "https://tuxa.ge",
  "tagline": "I build clean, fast, human interfaces — with care for motion, clarity, and the small details that make a product feel alive.",
  "aboutParagraphs": [
    "I'm a software & web developer focused on building clean, fast, human interfaces. I care about motion, clarity, and the small details that make a product feel alive — the kind of experience that feels free and comfortable to move through.",
    "Currently studying at Kutaisi International University and freelancing — building automation tools, business web pages, and products for clients, while always chasing the next idea worth prototyping."
  ],
  "stats": [
    { "value": "3+", "label": "years building" },
    { "value": "12+", "label": "shipped projects" }
  ],
  "highlightSkills": ["React", "TypeScript", "Node"]
}
$content$::jsonb)
on conflict (key) do nothing;

insert into public.site_content (key, value) values
  ('skills', $content$
[
  { "category": "Languages", "items": ["JavaScript (ES6+)", "TypeScript", "Java", "SQL", "Python", "C#", "Kotlin", "C++ (Arduino)"] },
  { "category": "Web & Backend", "items": ["React", "Next.js", "Node.js", "Express", "Socket.IO", "Supabase", "Cheerio", "REST APIs"] },
  { "category": "Hardware & Robotics", "items": ["Arduino", "Raspberry Pi"] },
  { "category": "Other", "items": ["Adobe Suite", "Canva", "Figma", "Maya", "Blender", "Unity"] }
]
$content$::jsonb)
on conflict (key) do nothing;

insert into public.site_content (key, value) values
  ('experience', $content$
[
  {
    "period": "Ongoing",
    "title": "Independent / Freelance Developer",
    "description": "Building tools for automation, products for clients, and personal projects. Creating professional business web pages."
  },
  {
    "period": "Current",
    "title": "Student Assistant · Kutaisi International University",
    "description": "Assisting in the “Fundamentals of Programming” and “Introduction to Informatics” courses."
  },
  {
    "period": "Current",
    "title": "Student / Project Work",
    "description": "Coursework and team projects involving complex algorithms, systems design, database management, numerical programming, and robotics prototyping."
  }
]
$content$::jsonb)
on conflict (key) do nothing;

insert into public.site_content (key, value) values
  ('education', $content$
[
  { "period": "2023 — Present", "institution": "Kutaisi International University", "note": "Student assistant in programming courses" },
  { "period": "2019 — 2021", "institution": "IT Step Academy", "note": "Winner of the IT Step Hackathon" },
  { "period": "2011 — 2023", "institution": "Rustavi's Gimnazium" }
]
$content$::jsonb)
on conflict (key) do nothing;

insert into public.site_content (key, value) values
  ('achievements', $content$
[
  { "place": "1st Place", "event": "UNICO AI Innovation Laboratory Competition, Rustavi" },
  { "place": "2nd Place", "event": "Georgian WRO LEGO Robotics Championship" },
  { "place": "3rd Place", "event": "Google Developer Group Hackathon" },
  { "place": "Top 3", "event": "GITA Innovations Hackathon" }
]
$content$::jsonb)
on conflict (key) do nothing;
