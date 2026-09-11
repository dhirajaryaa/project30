import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/share-buttons";
import { buttonVariants } from "@/components/ui/button";
import {
  activityTypeLabel,
} from "@/lib/constants";
import { formatNice } from "@/lib/dates";
import { getPublicDay } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; day: string }>;
}): Promise<Metadata> {
  const { username, day } = await params;
  const entry = await getPublicDay(username, Number(day));
  if (!entry) return { title: "Not found", robots: { index: false } };

  const { user, project, log } = entry;
  const title = `${user.display_name} — Day ${log.day_number}/30: ${log.task}`;
  const description = `${statusLabel(log.status)} · ${log.what_i_did || project.goal} · ${project.area} on Project 30.`;
  const url = `/u/${user.username}/day/${log.day_number}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: `/u/${user.username}/day/${log.day_number}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/u/${user.username}/day/${log.day_number}/opengraph-image`],
    },
  };
}

export default async function PublicDayPage({
  params,
}: {
  params: Promise<{ username: string; day: string }>;
}) {
  const { username, day } = await params;
  const entry = await getPublicDay(username, Number(day));
  if (!entry) notFound();

  const { user, project, log } = entry;
  const url = `/u/${user.username}/day/${log.day_number}`;

  return (
    <article className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <header className="mb-10 border-b border-border pb-8">
        <Link
          href={`/u/${user.username}`}
          className="text-xs font-semibold tracking-widest text-primary hover:underline"
        >
          PROJECT 30 · @{user.username}
        </Link>
        <p className="mt-4 text-sm font-semibold tracking-widest text-primary">
          DAY {log.day_number} / 30
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {log.task}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <StatusIcon status={log.status} />
            <span>{statusLabel(log.status)}</span>
          </span>
          <span>{activityTypeLabel(log.activity_type)}</span>
          <span>{formatNice(log.date)}</span>
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {log.what_i_did && (
          <JournalSection title="What I did" body={log.what_i_did} />
        )}
        {log.what_i_learned && (
          <JournalSection title="What I learned" body={log.what_i_learned} />
        )}
        {log.tomorrow_plan && (
          <JournalSection title="Tomorrow" body={log.tomorrow_plan} />
        )}
        {log.evidence_url && (
          <JournalSection
            title="Proof of work"
            body={
              <a
                href={log.evidence_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                {log.evidence_url}
              </a>
            }
          />
        )}
      </div>

      <footer className="mt-14 flex flex-col gap-6 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          {user.display_name} is working on{" "}
          <Link
            href={`/u/${user.username}`}
            className="text-foreground underline underline-offset-4"
          >
            {project.area} — {project.goal}
          </Link>{" "}
          for 30 days.
        </p>
        <ShareButtons
          url={url}
          title={`Day ${log.day_number} / 30 — ${log.task}`}
          text={`Day ${log.day_number} / 30 • ${statusLabel(log.status)} • ${log.task} • ${project.area} • @${user.username} on Project 30`}
        />
        <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Start your own Project 30
        </Link>
      </footer>
    </article>
  );
}

function JournalSection({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </h2>
      <p className="whitespace-pre-wrap text-lg leading-8">{body}</p>
    </section>
  );
}

function StatusIcon({ status }: { status: string }) {
  return (
    <span
      className={
        status === "completed"
          ? "text-primary"
          : status === "partial"
            ? "text-primary/60"
            : "text-muted-foreground/70"
      }
    >
      {status === "completed" ? "✓" : status === "partial" ? "◐" : "—"}
    </span>
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