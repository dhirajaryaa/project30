import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareButtons } from "@/components/share-buttons";
import { StatusMark } from "@/components/status-mark";
import { buttonVariants } from "@/components/ui/button";
import { activityTypeLabel } from "@/lib/constants";
import { getAllLogs, getProject, getUser } from "@/lib/content";
import { formatNice } from "@/lib/dates";
import { getLogByDay } from "@/lib/storage";

export function generateStaticParams() {
  return getAllLogs().map((l) => ({ day: String(l.day) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const log = getLogByDay(getAllLogs(), Number(day));
  if (!log) return { title: "Not found", robots: { index: false } };

  const user = getUser();
  const project = getProject();
  const title = `${user.display_name} — Day ${log.day}/30: ${log.task}`;
  const description = `${statusLabel(log.status)} · ${log.task} · ${project.area} on Project 30.`;
  const url = `/profile/day/${log.day}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Project 30",
      images: [{ url: `/og/profile/day/${log.day}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/profile/day/${log.day}.png`],
    },
  };
}

export default async function ProfileDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const log = getLogByDay(getAllLogs(), Number(day));
  if (!log) notFound();

  const user = getUser();
  const project = getProject();
  const url = `/profile/day/${log.day}`;

  return (
    <article className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pt-16">
      <header className="mb-10 border-b border-border pb-8">
        <Link
          href="/profile"
          className="text-xs font-semibold tracking-widest text-primary hover:underline"
        >
          PROJECT 30 · @{user.username}
        </Link>
        <p className="mt-4 text-sm font-semibold tracking-widest text-primary">
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
        </div>
      </header>

      <MarkdownRenderer body={log.body} />

      <footer className="mt-14 flex flex-col gap-6 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          {user.display_name} is working on{" "}
          <Link
            href="/profile"
            className="text-foreground underline underline-offset-4"
          >
            {project.area} — {project.goal}
          </Link>{" "}
          for 30 days.
        </p>
        <ShareButtons
          url={url}
          title={`Day ${log.day} / 30 — ${log.task}`}
          text={`Day ${log.day} / 30 • ${statusLabel(log.status)} • ${log.task} • ${project.area} • @${user.username} on Project 30`}
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/profile"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View full journey
          </Link>
          <Link
            href={`/day/${log.day}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Open journal page
          </Link>
        </div>
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