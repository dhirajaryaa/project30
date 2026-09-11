# AGENTS.md — Project 30 (Build Specification for AI Agents)

This file gives any AI coding agent the full requirements for **Project 30**. Read it before writing code.

---

## 1. Product Summary

Project 30 is a **30-day accountability system** presented as a **personal accountability journal + public build log**.

Core loop:

> Choose **one area** you want to improve. Work on it for **30 minutes every day for 30 days**. Record what you did, what you learned, and what you will do next.

Design personality: **Calm. Focused. Modern. Minimal. Developer-friendly. Fast.** No dashboards clutter, no gamification, no giant navigation.

**Project 30 is NOT:** a task manager, project management tool, social network, habit gamification app, or AI productivity assistant.

**Project 30 IS:** a simple 30-day accountability journal that turns daily work into visible progress.

Always optimize for: **Less management. More doing. More reflection. More visible progress.**

---

## 2. MVP Scope

Build the smallest useful version a single person can use for 30 days. **No multi-user SaaS architecture.**

MVP priorities:

1. Creating a 30-day challenge
2. Adding a daily task/focus
3. Recording the day's progress
4. Recording what was learned
5. Planning the next day
6. Viewing the complete 30-day journey
7. Creating a beautiful public/shareable progress page
8. Sharing daily progress socially

**MVP constraint:** Only **one active Project 30 per user/instance**. Do not build multiple projects, teams, subscriptions, organizations, or social features.

---

## 3. Core Data Model

Keep it small. Do not create unnecessary tables.

### User

```
id            string
username      string
display_name  string
avatar_url    string (optional)
created_at    string (ISO)
```

### Project

```
id           string
user_id      string
area         string
goal         string
start_date   string (YYYY-MM-DD)
status       "active" | "completed"
created_at   string (ISO)
```

### DailyLog

```
id                string
project_id        string
day_number        number (1–30)
date              string (YYYY-MM-DD)
task              string
status            "completed" | "partial" | "missed"
activity_type     "learning" | "building" | "bug-fix" | "feature" | "ui-design" | "research" | "practice" | "other"
what_i_did        string
what_i_learned    string
what_was_difficult string (optional)
tomorrow_plan     string
missed_reason     string (optional, only when status = "missed")
created_at        string (ISO)
updated_at        string (ISO)
```

Constraint: `UNIQUE(project_id, day_number)`.

### Constants

- **Activity types:** Learning, Building, Bug Fix, Feature, UI / Design, Research, Practice, Other
- **Missed reasons (only shown when status = "missed"):** No time, Work, Family responsibility, Health, Lost focus, Unexpected event, Other
- **Status sets:** Completed ✓, Missed —, Partial (subtle distinct indicator), Not completed yet ○
- **Always call it "Missed" — never "Absent".**

---

## 4. Pages / Routes

### Landing page (`/`)
- Hero: "30 minutes. 30 days. One area." with sub-line "Build the habit. Not the hype."
- 5-step explanation of the system.
- Primary CTA: "Start Project 30". Secondary CTA: "View public progress".
- If a user already has a project, CTA should route to their dashboard.

### Onboarding (`/onboarding`)
Fields: **Area**, **30-day goal**, **Start date** (default today).
Only allow one active project per user. Username is the public identity (`/u/{username}`).

### Dashboard (`/dashboard`)
Immediately answer: What day am I on? What is today's task? How many days completed? What did I do recently? What is my next action?
- Day number / 30, progress bar, completed/partial/missed counts.
- Today's focus card + "Complete today's check-in" CTA (or a link to view today's entry if already done).
- Recent progress list (last few entries).
- Link to full journey.

### Daily Check-in (`/check-in`)
The **center of the product**. Today's entry (create or update). Fields:
- Today's task
- Status (Completed / Partial / Missed)
- What did you do?
- What did you learn?
- What was difficult? (optional)
- What will you do tomorrow?
- Activity type
- Missed reason (conditional, only when status = "missed")

### Timeline / Journey (`/journey`)
Grid or list of all 30 days:
- ✓ = Completed, — = Missed, ○ = Not completed yet, Partial = subtle distinct indicator (e.g. half circle / lighter mark).
- Clicking a completed day opens its daily entry.

### Daily Entry page (`/day/[day]` or `/log/[day]`)
Beautiful readable journal page: Day N / 30, task, status, what I did, what I learned, what was difficult, tomorrow plan. With a share CTA.

### Public profile (`/u/[username]`)
P-0 feature. Shows: username, display name, avatar, goal, area, current day, completion progress, completed/partial/missed counts, 30-day timeline, recent entries.
Must look good enough for someone to discover Project 30 through it.
**Never expose private/undefined data (e.g. `what_was_difficult`, missed reasons) unless intentional.** Public daily entries should show the journal fields the user wrote for that day.

### Share page (`/share/[day]` or a card view)
P-0 feature: generates a beautiful shareable progress card ("Day 7 / 30 • Completed • task • area • @username • URL"). Typography, spacing, hierarchy > decoration. Looks good as a screenshot and social preview.

### Social sharing
- Copy link button.
- Native Web Share API where supported.
- Shareable public URL.
- Open Graph metadata + Twitter/X + LinkedIn-compatible previews (via `metadata` API / `opengraph-image`).

Do NOT build direct integrations for every social network. **The URL is the sharing mechanism.**

---

## 5. Meaningful Discovery (no vanity metrics)

Public profile must answer: *Who is this? What are they working on? What day are they on? What did they actually do?*

Do NOT add: followers, likes, comments, leaderboards, karma, points, badges, streak rewards.

---

## 6. Tech Stack & Decisions

- **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** (custom theme already in `app/globals.css`, warm neutral + orange accent).
- **Vercel deployment**.
- MVP data layer: **localStorage-based store** with a React Context provider (single-user, no external DB needed for the MVP). The store layer should be abstracted (`lib/storage.ts`) so a real SQL database (Vercel Postgres / SQLite / Turso) can replace it later without rewriting pages. Date handling: use **UTC/local day boundaries** consistently (compute "today" in the client).
- **Auth:** keep simple for the MVP (single user, stored locally). No OAuth unless later required.
- **Package manager: pnpm.** Use `pnpm dlx shadcn add ...` for shadcn components.
- Do NOT implement GitHub sync, screen-time verification, proof-of-work, AI generation, follower/like systems, teams, or public community in this version.

---

## 7. Design & UX Rules

- Calm, focused, minimal. Avoid excessive cards, gaudy decoration, dashboards clutter.
- Progress must be **visible** (large day number, clean progress bar).
- Daily check-in should take **less than a few minutes**.
- Use generous whitespace, strong typographic hierarchy, low-fidelity color (the orange primary is the accent; everything else quiet).
- Every public page must render well as a screenshot.
- Mobile responsive.

---

## 8. AI Assistance Rules (future)

AI must NOT auto-generate fake progress. It may later help with summarizing reflections / suggesting tomorrow's plan / final 30-day reflection — but **user's real work stays user-controlled**. AI is not the core.

---

## 9. Definition of Done

MVP is complete when a real person can:

1. Open the app
2. Create a Project 30
3. Define the 30-day goal
4. Add today's task
5. Mark the day Completed/Partial/Missed
6. Write what they did
7. Write what they learned
8. Write tomorrow's plan
9. See the 30-day timeline
10. View a beautiful public progress page
11. Open an individual daily entry publicly
12. Generate/share today's progress
13. Copy a public link
14. Deploy the application

**When all of these work, STOP. Do not add extra features just because they are technically interesting.**

---

## 10. Commands

```bash
pnpm dev        # run dev server
pnpm build      # production build
pnpm lint       # eslint
pnpm start      # serve production build
pnpm dlx shadcn add <component>   # add a shadcn component
```