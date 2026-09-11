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

## Daily log format

Each day is one markdown file in `daily-log/` named with the zero-padded day (`01.md`, `02.md`, … `30.md`). The filename day and the frontmatter `day` must match.

```markdown
---
day: 1
date: 2026-09-11
task: "Set up Project 30"
status: completed
activity_type: building
missed_reason: ""
evidence_url: ""
---

## What I did

...

## What I learned

...

## Tomorrow

...
```

**Frontmatter fields:**

| Field          | Required | Values                                                                                                                       |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `day`          | yes      | Integer 1–30 (must match the filename)                                                                                       |
| `date`         | yes      | `YYYY-MM-DD`                                                                                                                 |
| `task`         | yes      | The day's task, one short line                                                          |
| `status`       | yes      | `completed` \| `partial` \| `missed` (use "Missed", never "Absent")                                                          |
| `activity_type`| yes      | `learning` \| `building` \| `bug-fix` \| `feature` \| `ui-design` \| `research` \| `practice` \| `other`                     |
| `missed_reason`| no       | Only when `status: missed` (e.g. `work`, `no-time`)                                                                          |
| `evidence_url` | no       | Link to the work (PR, deploy, post, commit)                                                  |

**Body:** markdown prose under `##` headings — what you did, what you learned, what's next. Rendered with react-markdown + remark-gfm (headings, lists, code blocks, GFM tables).

**Empty state:** with no files in `daily-log/` the site still builds; the landing grid, journey, and profile simply show the "not logged yet" state.

---

## Pages

- **`/`** — Landing page with live 30-day grid.
- **`/journey`** — The full 30-day timeline: ✓ completed · ◐ partial · — missed · ○ not yet.
- **`/day/N`** — Journal entry page (rendered markdown, share buttons).
- **`/profile`** — Single-person profile: 🚩 goal, area, day X/30, progress bar, counts, timeline, recent entries, share buttons.
- **`/profile/day/N`** — Public single-day entry (the share URL for a day).

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
pnpm start      # preview the static export (serves out/ via serve)
pnpm lint       # eslint
pnpm exec tsc --noEmit   # typecheck
```

---

## Project structure

```
app/                  # App Router pages
  page.tsx                # Landing page
  journey/                # 30-day timeline
  day/[day]/              # Daily entry page (share buttons)
  profile/                # Single-person profile (reads config directly)
  profile/day/[day]/      # Public single-day entry (the share URL for a day)
config/
  config.json             # user + project data
daily-log/
  01.md … 30.md           # one markdown file per day
components/           # Reusable UI + markdown renderer
lib/                  # content.ts (fs reads), storage, metadata, site
```

---

## Definition of Done

The MVP is complete when one real person can edit `config/` + `daily-log/`, push to Vercel, see the landing page, browse the 30-day timeline, open any logged day, share a beautiful public progress page, and share a daily progress card with correct OG previews. When all of that works, **stop building** — no extra features.

---

## License

Private / personal project.