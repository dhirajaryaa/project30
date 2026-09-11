import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ShareButtons } from "@/components/share-buttons";
import { StatusMark } from "@/components/status-mark";
import { Timeline } from "@/components/timeline";
import { Progress } from "@/components/ui/progress";
import { avatarUrl } from "@/lib/avatar";
import {
  getAllLogs,
  getCurrentDay,
  getProject,
  getUser,
} from "@/lib/content";
import { formatNice } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { countByStatus, sortLogs } from "@/lib/storage";

export const metadata: Metadata = pageMetadata({
  title: "Dhiraj Arya — Project 30",
  description:
    "Full-Stack Development — Ship 3 real projects and document the journey publicly. Day X/30.",
  url: "/profile",
  image: "/og/profile.png",
});

export default function ProfilePage() {
  const user = getUser();
  const project = getProject();
  const logs = getAllLogs();
  const currentDay = getCurrentDay();
  const counts = countByStatus(logs);
  const progress = Math.min(Math.round((counts.completed / 30) * 100), 100);
  const recent = sortLogs(logs).slice(-4).reverse();
  const dayHref = (day: number) => `/profile/day/${day}`;
  const profileUrl = "/profile";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-10">
        <div className="flex items-center gap-5">
          <Avatar
            url={user.avatar_url ?? avatarUrl(user.username)}
            username={user.username}
            size={64}
          />
          <div className="min-w-0">
            <Link
              href="/"
              className="text-xs font-semibold tracking-widest text-primary hover:underline"
            >
              PROJECT 30
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {user.display_name}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                @{user.username}
              </span>
            </h1>
            {user.bio && (
              <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
            )}
          </div>
        </div>
      </header>

      <section className="mb-10 flex flex-col gap-2">
        <h1 className="flex items-start gap-2 text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">
          <span aria-hidden>🚩</span>
          <span>{project.goal}</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{project.area}</p>
      </section>

      <section className="mb-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Working on Project 30 — day {currentDay} of 30
        </p>
      </section>

      <div className="mb-8 flex items-center justify-between">
        <Progress value={progress} className="h-2 w-full" />
        <span className="ml-4 flex-shrink-0 text-sm text-muted-foreground tabular-nums">
          {progress}% · {counts.completed} days done
        </span>
      </div>

      <div className="mb-12 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-primary">✓</span>
          <span className="font-medium tabular-nums">{counts.completed}</span>
          <span className="text-muted-foreground">completed</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-primary/60">◐</span>
          <span className="font-medium tabular-nums">{counts.partial}</span>
          <span className="text-muted-foreground">partial</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-muted-foreground/70">—</span>
          <span className="font-medium tabular-nums">{counts.missed}</span>
          <span className="text-muted-foreground">missed</span>
        </span>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 font-medium">The journey</h2>
        <Timeline logs={logs} dayHref={dayHref} />
        <p className="mt-3 text-xs text-muted-foreground">
          Started {formatNice(project.start_date)}.
        </p>
      </section>

      <section>
        <h2 className="mb-4 font-medium">Recent done — what was actually done</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing yet — day 1 hasn&apos;t been logged.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {recent.map((log) => (
              <li key={log.day}>
                <Link
                  href={dayHref(log.day)}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <StatusMark status={log.status} className="text-lg" />
                    <span className="text-sm text-muted-foreground">
                      Day {log.day}
                    </span>
                    <span className="truncate text-sm font-medium">
                      {log.task || "Untitled"}
                    </span>
                  </span>
                  <span className="flex-shrink-0 text-xs font-medium text-muted-foreground uppercase">
                    open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <p className="mb-3 text-sm font-medium">Share this profile</p>
        <ShareButtons
          url={profileUrl}
          title={`${user.display_name} — Day ${currentDay}/30 on Project 30`}
          text={`${user.display_name} is on day ${currentDay}/30: ${project.goal} · ${project.area} · @${user.username}`}
        />
      </section>
    </div>
  );
}