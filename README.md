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
| UI         | shadcn/ui (custom warm-neutral + orange theme in `app/globals.css`) |
| Data       | localStorage-backed React Context (MVP, single-user) |
| Deploy     | Vercel |

The storage layer is abstracted in `lib/storage.ts` so a real SQL database (Vercel Postgres / SQLite / Turso) can replace it later **without rewriting pages**.

---

## Getting started

```bash
pnpm install
pnpm dev
```

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
  onboarding/       # Project creation flow
  dashboard/        # Dashboard
  check-in/         # Daily check-in
  journey/          # 30-day timeline
  day/[day]/        # Daily entry page
  u/[username]/     # Public profile
  share/[day]/      # Shareable progress card
components/     # Reusable components (ui/ + product components)
lib/            # Types, storage abstraction, store/provider, utils
```

---

## Data model

- **User** — id, username, display_name, avatar_url, created_at
- **Project** — id, user_id, area, goal, start_date, status, created_at
- **DailyLog** — id, project_id, day_number (1–30), date, task, status, activity_type, what_i_did, what_i_learned, what_was_difficult, tomorrow_plan, missed_reason, created_at, updated_at — unique per `(project_id, day_number)`

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