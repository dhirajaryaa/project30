"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { StatusMark } from "@/components/status-mark";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { countByStatus, sortLogs } from "@/lib/storage";
import { cn } from "cn";

export default function DashboardPage() {
  const { status, project, logs, todayLog, currentDay, user } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  if (status === "loading") return null;

  if (status === "ready" && !project) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-5 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary">
          PROJECT 30
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Start your Project 30
        </h1>
        <p className="text-muted-foreground">
          Pick one area, set one 30-day goal, and start logging your daily
          check-ins.
        </p>
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ size: "lg" }), "px-6")}
        >
          Set up your Project 30
        </Link>
      </div>
    );
  }

  if (status !== "ready" || !project || !user) return null;

  const counts = countByStatus(logs);
  const progress = Math.min(
    Math.round((counts.completed / 30) * 100),
    100
  );
  const sorted = sortLogs(logs);
  const recent = sorted.slice(-5).reverse();

  return (
    <div className="mx-auto max-w-3xl pt-10 sm:pt-16">
      <header className="mb-10">
        <p className="text-sm font-semibold tracking-widest text-primary">
          PROJECT 30
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {project.area}
        </h1>
        <p className="mt-1 text-muted-foreground">{project.goal}</p>
      </header>

      <section className="mb-4 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-semibold tracking-tight tabular-nums">
            {currentDay}
          </span>
          <span className="text-lg text-muted-foreground">/ 30</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {progress}% complete
        </span>
      </section>

      <Progress value={progress} className="mb-8 h-2.5" />

      <div className="mb-10 flex flex-wrap gap-x-8 gap-y-2 text-sm">
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

      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Today&apos;s focus — day {currentDay}
        </p>
        <p className="mt-2 min-h-6 text-lg font-medium">
          {todayLog?.task || "No task set yet."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {todayLog ? (
            <Link
              href={todayLog ? "/day/" + todayLog.day_number : "/check-in"}
              className={buttonVariants()}
            >
              {todayLog ? "View today's entry" : "Complete today's check-in"}
            </Link>
          ) : (
            <Link href="/check-in" className={buttonVariants()}>
              Complete today&apos;s check-in
            </Link>
          )}
          <Link
            href="/check-in"
            className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}
          >
            {todayLog ? "Edit today's check-in" : "Start today's check-in"}
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent progress</h2>
          <Link
            href="/journey"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View full journey
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing logged yet. Your first entry is waiting.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {recent.map((log) => (
              <li key={log.id}>
                <Link
                  href={`/day/${log.day_number}`}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <StatusMark status={log.status} className="text-lg" />
                    <span className="text-sm text-muted-foreground">
                      Day {log.day_number}
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
    </div>
  );
}