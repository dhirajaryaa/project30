import type { Metadata } from "next";
import Link from "next/link";
import { StatusMark } from "@/components/status-mark";
import { Timeline } from "@/components/timeline";
import { getAllLogs, getProject } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { countByStatus, sortLogs } from "@/lib/storage";

export const metadata: Metadata = pageMetadata({
  title: "Journey",
  description:
    "The complete 30-day Project 30 journey — every day, one view.",
  url: "/journey",
  image: "/og/journey.png",
});

export default function JourneyPage() {
  const project = getProject();
  const logs = getAllLogs();

  const counts = countByStatus(logs);
  const filled = sortLogs(logs);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-16">
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
            No entries yet. Add files to{" "}
            <code className="rounded bg-muted px-1 py-0.5">daily-log/</code>{" "}
            and rebuild.
          </p>
        ) : (
          <ul className="w-full divide-y divide-border border-y border-border">
            {sortLogs(logs)
              .slice()
              .reverse()
              .map((log) => (
                <li key={log.day}>
                  <Link
                    href={`/day/${log.day}`}
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
      </div>

      <div className="mt-12">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View my profile
        </Link>
      </div>
    </div>
  );
}