"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { Timeline } from "@/components/timeline";
import { buttonVariants } from "@/components/ui/button";
import { countByStatus, sortLogs } from "@/lib/storage";
import { cn } from "cn";

export default function JourneyPage() {
  const { status, project, user, logs } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  if (status !== "ready" || !project || !user) return null;

  const counts = countByStatus(logs);
  const filled = sortLogs(logs);

  return (
    <div className="mx-auto max-w-3xl pt-10 sm:pt-16">
      <header className="mb-10">
        <p className="text-sm font-semibold tracking-widest text-primary">
          PROJECT 30
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {project.area}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {counts.completed} completed · {counts.partial} partial ·{" "}
          {counts.missed} missed · {filled.length} entries logged
        </p>
      </header>

      <Timeline logs={logs} />

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <h2 className="w-full text-lg font-medium">Entries so far</h2>
        {filled.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No entries yet.{" "}
            <Link
              href="/check-in"
              className="text-foreground underline underline-offset-4"
            >
              Log day 1
            </Link>
            .
          </p>
        ) : (
          <ul className="w-full divide-y divide-border border-y border-border">
            {sortLogs(logs)
              .slice()
              .reverse()
              .map((log) => (
                <li key={log.id}>
                  <Link
                    href={`/day/${log.day_number}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <StatusTotem status={log.status} />
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
      </div>

      <div className="mt-12">
        <Link
          href="/check-in"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Complete today&apos;s check-in
        </Link>
      </div>
    </div>
  );
}

function StatusTotem({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "w-4 text-center text-lg",
        status === "completed" && "text-primary",
        status === "partial" && "text-primary/60",
        status === "missed" && "text-muted-foreground/70"
      )}
    >
      {status === "completed" ? "✓" : status === "partial" ? "◐" : "—"}
    </span>
  );
}