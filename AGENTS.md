# AGENTS.md — Project 30 (Build Specification for AI Agents)

This file gives any AI coding agent the full requirements for **Project 30**. Read it before writing code.

---

## 1. Product Summary

Project 30 is a **30-day accountability system** presented as a **personal accountability journal + public build log**.

Core loop:

> Choose **one area** you want to improve. Work on it for **30 minutes every day for 30 days**. Record what you did, what you learned, and what you will do next.

Design personality: **Calm. Focused. Modern. Minimal. Developer-friendly. Fast.** No dashboards clutter, no gamification, no giant navigation.

**Project 30 IS:** a simple 30-day accountability journal that turns daily work into visible progress.

**Project 30 IS NOT:** a task manager, social network, habit gamification app, or AI productivity assistant. No database. No authentication. No multi-user anything.

Always optimize for: **Less management. More doing. More reflection. More visible progress.**

---

## 2. Architecture — Static Site, Content as Markdown

This is a **fully static Next.js site** (`output: "export"`). It is a single-person public build log. The owner is a developer; they edit files and push to Vercel to publish.

- **No database. No ORM. No auth. No server API routes. No proxy/middleware.**
- All content lives as plain files in the repo:
  - `config/config.json` — the owner (user) + the active project (area, goal, start date).
  - `daily-log/NN.md` — one markdown file per day (`01.md`, `02.md`, …, `30.md`). YAML frontmatter + prose body.
- `lib/content.ts` reads those files **at build time** and exposes typed getters. Pages are **server components** that call these getters directly.
- Every page is pre-rendered as static HTML. **Push to deploy** — no runtime dependencies.

**The workflow for the owner:** write/update `daily-log/03.md`, tweak `config/config.json`, commit, push. Vercel rebuilds, the site updates. That’s the whole product loop.

---

## 3. Content Formats

### config/config.json

```json
{
  "user": {
    "username": "dhirajarya",
    "display_name": "Dhiraj Arya",
    "avatar_url": "https://dhirajarya.in/assets/hero.webp",
    "bio": "Self-taught full-stack developer. Building in public.",
    "socials": {
      "github": "https://github.com/dhirajaryaa",
      "twitter": "https://twitter.com/dhirajarya01"
    }
  },
  "project": {
    "area": "Full-Stack Development",
    "goal": "Ship 3 real projects and document the journey publicly",
    "start_date": "2026-09-11",
    "status": "active"
  }
}
```

### daily-log/NN.md

YAML frontmatter + markdown body:

```md
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

- **Frontmatter fields:** `day` (1–30, required), `date` (YYYY-MM-DD), `task`, `status` (completed | partial | missed), `activity_type` (learning | building | bug-fix | feature | ui-design | research | practice | other), optional `missed_reason` (only when status = "missed"), optional `evidence_url`.
- **Body:** the markdown prose. Rendered with `react-markdown` + `remark-gfm` (headings, lists, code blocks, GFM tables).
- Day number also comes from the filename; frontmatter `day` must match.

---

## 4. Pages / Routes (all static, all public)

- **`/`** — Landing. Hero, 5-step system, live day grid pulled from `daily-log/`.
- **`/journey`** — Timeline of all 30 days (✓ completed, ◐ partial, — missed, ○ not yet) + entries list.
- **`/day/[day]`** — Journal entry page (readable, share buttons). Static params from `daily-log/`.
- **`/profile`** — Single-person profile (reads `config/config.json` directly): avatar, display name, 🚩 goal, area, day X/30, progress bar, completed/partial/missed counts, 30-day timeline, recent entries, share buttons.
- **`/profile/day/[day]`** — Public single-day entry (the share URL for a specific day).

Social sharing is **the public URL + OG image**, shared directly from `/day/[day]` (copy link, native share, X/LinkedIn buttons). No separate share page, no per-network integrations. If someone wants to run the same challenge, they clone this repo and deploy it themselves.

---

## 5. Tech Stack & Decisions

- **Next.js (App Router, `output: "export"`)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** (custom theme in `app/globals.css`, warm neutral + terracotta accent `#e08a5c`).
- **Vercel deployment** (`pnpm build` → static export).
- **react-markdown + remark-gfm** for rendering journal prose.
- All content getters live in `lib/content.ts` (sync, build-time fs reads) and `lib/storage.ts` (pure helpers: sort, count, lookup). `getCurrentDay()` in `lib/content.ts` handles day math (clamps to 0–30; pre-start projects show 0).
- Site URL from `SITE_PUBLIC_URL` in `lib/site.ts` (drives `metadataBase` and share links).
- Code style: **no comments** unless asked. Keep it minimal.
- **Package manager: pnpm.**

---

## 6. Design & UX Rules

- Calm, focused, minimal. Avoid excessive cards, gaudy decoration, dashboards clutter.
- Progress must be **visible** (large day number, clean progress bar).
- Generous whitespace, strong typographic hierarchy, low-fidelity color (terracotta primary as the accent; everything else quiet).
- Every public page must render well as a screenshot. Mobile responsive.
- **OG images matter** — every key page gets a clean 1200×630 Open Graph PNG, generated **at build time** by `scripts/generate-og.cjs` (satori + @resvg/resvg-js) into `public/og/`. The `prebuild`/`predev` npm hooks run it automatically. The script wipes `public/og/` first, and the folder is gitignored (never commit build artifacts). Metadata on each page points to these static PNGs (`og:image` + `twitter:card`), so Twitter, LinkedIn, Facebook, and WhatsApp all render the preview. Do not replace this with Next `opengraph-image` route handlers — they are unreliable with `output: "export"` in Next 16.

**Status vocabulary (always):** Completed ✓, Missed —, Partial ◐, Not completed yet ○. Always call it **"Missed"**, never "Absent".

---

## 7. AI Assistance Rules (future)

AI must NOT auto-generate fake progress. It may help summarize reflections / suggest tomorrow's plan — but the **user's real work stays user-controlled**.

---

## 8. Definition of Done

1. Open the app
2. See the landing page
3. See the public profile (`/profile`)
4. Browse the 30-day timeline (`/journey`)
5. Open any logged day (`/day/N`, `/profile/day/N`)
6. Share a day (copy link, native share, X/LinkedIn buttons on `/day/N`)
7. Social previews (OG images) render correctly
8. `pnpm build` produces a static export; push to Vercel to deploy

**STOP when all of these work. Do not add features just because they are technically interesting.**

---

## 9. Commands

```bash
pnpm dev        # run dev server
pnpm build      # production static export (output: export)
pnpm start      # preview the static export (serves out/ via serve)
pnpm lint       # eslint
pnpm exec tsc --noEmit   # typecheck
```