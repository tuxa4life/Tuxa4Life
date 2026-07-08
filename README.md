### Hey 👋

# I'm Tuxa!

Welcome to my profile! I'm Nikoloz Tukhashvili — I build things for the web, from glassy front-ends to the APIs behind them.

This repo is the source for my personal website, **[tuxa.ge](https://tuxa.ge)** — a glassy bento-grid built with Next.js.

---

## 🛠️ tuxa.ge — how it's built

- **Frontend** — Next.js (App Router, ISR with 1h revalidation), Tailwind CSS v4, [Motion](https://motion.dev) for the card → panel morph animations, and a canvas dot-field background.
- **Content** — a Supabase table (`site_content`, key/value JSONB, one row per section: `profile`, `skills`, `experience`, `education`, `achievements`, `projects`). Content is editable straight from the Supabase dashboard — no redeploy needed. Falls back to built-in defaults ([src/content/defaults.ts](src/content/defaults.ts)) when Supabase is unset or a row is missing.
- **Projects** — fetched from GitHub at request time (cached 1h):
  - With `GITHUB_TOKEN`: pinned repositories via the GraphQL API.
  - Without: top public repos (by stars, then recency) via the REST API.
  - On total failure: a manual project list from content defaults / Supabase.

## 🚀 Run it locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in what you have — everything is optional; the site renders fully without any env vars. To wire up the Supabase content store, run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor, then insert rows with keys matching the sections above (JSON shapes mirror [src/lib/types.ts](src/lib/types.ts)).

Deployed on Vercel: import the repo, set the env vars from `.env.example`, deploy.

## 📫 Reach me

- 🌐 [tuxa.ge](https://tuxa.ge)
- 📧 nikoloztuxa@gmail.com
