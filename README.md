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

## How it works

Everything is content. This is a fully **static site** — no database, no auth.

1. Edit `config/config.json` to set your name, socials, and the project (area, goal, start date).
2. Write one markdown file per day in `daily-log/01.md` … `daily-log/30.md` (frontmatter + prose).
3. Commit and push to Vercel. The site rebuilds as static HTML.

```
config/config.json     # you + your project
daily-log/01.md        # day 1 entry (yaml frontmatter + markdown)
daily-log/02.md        # day 2 entry
...
```

---

## Pages

- **`/`** — Landing page with live 30-day grid.
- **`/journey`** — The full 30-day timeline: ✓ completed · ◐ partial · — missed · ○ not yet.
- **`/day/N`** — Journal entry page (rendered markdown).
- **`/share/N`** — Shareable daily progress card (copy link, native Web Share, X/LinkedIn).
- **`/u/{username}`** — Public profile: 🚩 goal, area, day X/30, progress bar, counts, timeline, recent entries, share buttons.
- **`/u/{username}/day/N`** — Public single-day entry.

Every page generates a clean **Open Graph image** at build time for social previews.

---

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | Next.js 16 (App Router, `output: "export"`) |
| Language   | TypeScript |
| Styling    | Tailwind CSS v4 |
| UI         | shadcn/ui (custom warm-neutral + terracotta theme in `app/globals.css`) |
| Content    | Markdown (`daily-log/`) + JSON (`config/`), read at build time by `lib/content.ts` |
| Rendering  | react-markdown + remark-gfm |
| OG images  | satori + @resvg/resvg-js (`scripts/generate-og.cjs` → `public/og/`, runs on `prebuild`/`predev`) |
| Deploy     | Vercel (static export) |

---

## Getting started

```bash
cp .env.example .env.local   # set SITE_PUBLIC_URL (localhost:3000 for local dev)
pnpm install
pnpm dev
```

Environment variables:

- `SITE_PUBLIC_URL` — the app base URL (canonical URLs, OG metadata, share links). Set to the production domain on Vercel.

---

## Commands

```bash
pnpm dev        # run dev server
pnpm build      # production static export (output: export)
pnpm lint       # eslint
pnpm exec tsc --noEmit   # typecheck
```

---

## Project structure

```
app/                  # App Router pages
  page.tsx                # Landing page
  journey/                # 30-day timeline
  day/[day]/              # Daily entry page
  share/[day]/            # Shareable progress card
  u/[username]/           # Public profile (+ daily entries)
  u/[username]/day/[day]/ # Public single-day entry
config/
  config.json             # user + project data
daily-log/
  01.md … 30.md           # one markdown file per day
components/           # Reusable UI + markdown renderer, OG card
lib/                  # content.ts (fs reads), storage, dates, metadata
```

---

## Definition of Done

The MVP is complete when one real person can edit `config/` + `daily-log/`, push to Vercel, see the landing page, browse the 30-day timeline, open any logged day, share a beautiful public progress page, and share a daily progress card with correct OG previews. When all of that works, **stop building** — no extra features.

---

## License

Private / personal project.