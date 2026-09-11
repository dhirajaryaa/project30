# Project 30

> 30 minutes. 30 days. One area.

**Project 30** is a 30-day accountability system that turns daily work into visible progress. Pick one area you genuinely want to improve, work on it for 30 minutes every day for 30 days, and record what you did, what you learned, and what you will do next.

It is a **personal accountability journal + public build log** — not a task manager, not a social network, not a gamified habit tracker.

---

## The core loop

```
Choose one area  →  Set 30-day goal  →  Today's task
      →  30 minutes of work  →  Daily reflection
      →  Tomorrow's plan  →  Public progress  →  Share
```

**Less management. More doing. More reflection. More visible progress.**

---

## Features

- **Onboarding** — define your area, your 30-day goal, and your start date (one active project per user).
- **Dashboard** — immediately answers: *What day am I on? What's today's task? How many days completed? What did I do recently?*
- **Daily check-in** — the center of the product. Record today's task, status (Completed / Partial / Missed), what you did, what you learned, what was difficult, and tomorrow's plan. Takes a few minutes.
- **30-day timeline** — the full journey with clear status marks: ✓ completed · — missed · ○ not completed · ⚡ partial.
- **Public profile** — `/u/{username}` shows your goal, current day, completion progress, timeline, and recent entries. Built to look good enough to be discovered through.
- **Share cards** — beautiful, shareable daily progress cards with copy-link, native Web Share, and Open Graph / X / LinkedIn preview metadata.
- **No vanity metrics** — no followers, likes, leaderboards, points, or badges. Just accountability and visible progress.

---

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | Next.js 16 (App Router) |
| Language   | TypeScript |
| Styling    | Tailwind CSS v4 |
| UI         | shadcn/ui (custom warm-neutral + terracotta theme in `app/globals.css`) |
| Data       | MongoDB Atlas via Mongoose; all writes through server actions |
| Auth       | better-auth with Google social sign-in; `proxy.ts` protects `/dashboard`, `/check-in`, `/journey`, `/day/*`, `/share/*`, `/onboarding` |
| Deploy     | Vercel |

Storage is abstracted behind `lib/queries.ts` + server actions in `lib/actions.ts`, so it can be swapped (e.g. Postgres/SQLite) later **without rewriting pages**. Every server action authenticates the session **before touching the database**, and reads/writes are scoped to the signed-in user's own profile/project. The public layer (`/u/{username}`, `/u/{username}/day/[day]`, OG images) deliberately exposes only what the user wrote, and strips private fields (`what_was_difficult`, `missed_reason`) unless the owner is signed in.

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
pnpm install
pnpm dev
```

Environment variables:

- `MONGODB_URI` — MongoDB connection string.
- `AUTH_SECRET` — secret for better-auth (run `openssl rand -base64 32`).
- `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` — the app base URL.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth app credentials (sign-in via https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client IDs → Web application; add `{AUTH_URL}/api/auth/callback/google` and `{AUTH_URL}/api/auth/error` to redirect URIs).

Open [http://localhost:3000](http://localhost:3000).

---

## Commands

```bash
pnpm dev        # run dev server
pnpm build      # production build
pnpm lint       # eslint
pnpm start      # serve production build
pnpm dlx shadcn add <component>   # add a shadcn component
```

---

## Project structure

```
app/            # App Router pages & layouts
  page.tsx          # Landing page
  sign-in/          # Sign in (Google)
  onboarding/       # Project creation flow
  dashboard/        # Dashboard
  check-in/         # Daily check-in
  journey/          # 30-day timeline
  day/[day]/        # Daily entry page
  u/[username]/     # Public profile
  share/[day]/      # Shareable progress card
  api/auth/[all]/   # better-auth handler
components/     # Reusable components (ui/ + product components)
lib/            # Types, DB models, queries, server actions, utils
proxy.ts        # Route protection (Next.js proxy/middleware)
```

---

## Data model

- **User** — id, username, display_name, avatar_url, auth_id (better-auth), created_at
- **Project** — id, user_id, area, goal, start_date, status, created_at
- **DailyLog** — id, project_id, day_number (1–30), date, task, status, activity_type, what_i_did, what_i_learned, what_was_difficult, tomorrow_plan, missed_reason, evidence_url, created_at, updated_at — unique per `(project_id, day_number)`

---

## Definition of Done

The MVP is complete when one real person can open the app, create their Project 30, log each day for 30 days, view their full timeline, share a beautiful public progress page, and generate/share a daily progress card. When all of that works, **stop building** — no extra features.

---

## Roadmap (do NOT build yet)

- **V2**: GitHub activity evidence, AI reflection summaries
- **V3**: public community, small accountability groups, cohorts
- **V4**: richer social discovery

---

## License

Private / personal project.