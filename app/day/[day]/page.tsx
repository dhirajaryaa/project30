import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareButtons } from "@/components/share-buttons";
import { StatusMark } from "@/components/status-mark";
import { buttonVariants } from "@/components/ui/button";
import { activityTypeLabel } from "@/lib/constants";
import { getAllLogs, getLogByDay, getProject, getUser } from "@/lib/content";
import { formatNice } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { cn } from "cn";

export async function generateStaticParams() {
  const logs = getAllLogs();
  return logs.map((l) => ({ day: String(l.day) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const n = Math.trunc(Number(day));
  const log = getLogByDay(getAllLogs(), n);
  return pageMetadata({
    title: log ? `Day ${n} / 30 — ${log.task}` : `Day ${n} / 30`,
    description: log
      ? `${statusLabel(log.status)} · ${log.task} on Project 30.`
      : `Day ${n} of the 30-day Project 30 journey.`,
    url: `/day/${day}`,
    image: `/og/day/${encodeURIComponent(day)}.png`,
  });
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = await params;
  const day = Number(dayParam);
  const user = getUser();
  const project = getProject();
  const log = getLogByDay(getAllLogs(), day);

  if (!log) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary">
          DAY {day} / 30
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Nothing logged for day {day}
        </h1>
        <p className="max-w-md text-muted-foreground">
          This day doesn&apos;t have an entry yet.
        </p>
      </div>
    );
  }

  const shareUrl = absoluteUrl(`/u/${user.username}/day/${log.day}`);

  return (
    <article className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <header className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold tracking-widest text-primary">
          DAY {log.day} / 30
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {log.task}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <StatusMark status={log.status} />
            <span>{statusLabel(log.status)}</span>
          </span>
          <span>{activityTypeLabel(log.activity_type)}</span>
          <span>{formatNice(log.date)}</span>
          <span>Day {log.day}</span>
        </div>
      </header>

      <MarkdownRenderer body={log.body} />

      <footer className="mt-14 flex flex-col gap-6 border-t border-border pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/share/${log.day}`}
            className={buttonVariants()}
          >
            Share this day
          </Link>
          <Link
            href="/journey"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            Back to journey
          </Link>
        </div>
        <ShareButtons
          url={shareUrl}
          title={`Day ${log.day} / 30 — ${log.task}`}
          text={`Day ${log.day} / 30 • ${statusLabel(log.status)} • ${log.task} • ${project.area} • @${user.username} on Project 30`}
        />
      </footer>
    </article>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "partial":
      return "Partial";
    case "missed":
      return "Missed";
    default:
      return status;
  }
}