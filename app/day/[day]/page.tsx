"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { ShareButtons } from "@/components/share-buttons";
import { buttonVariants } from "@/components/ui/button";
import {
  activityTypeLabel,
  missedReasonLabel,
} from "@/lib/constants";
import { formatNice } from "@/lib/dates";
import { cn } from "cn";

export default function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = React.use(params);
  const day = Number(dayParam);
  const { status, project, user, logs, getLog } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/onboarding");
  }, [status, router]);

  if (status !== "ready" || !project || !user) return null;

  const log = getLog(day);

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
          {!log && logs.length === 0
            ? "Your journal is still empty — day 1 is waiting."
            : "This day doesn't have an entry yet."}
        </p>
        <Link href="/check-in" className={buttonVariants()}>
          Complete today&apos;s check-in
        </Link>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${user.username}/day/${log.day_number}`
      : `/u/${user.username}/day/${log.day_number}`;

  return (
    <article className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <header className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold tracking-widest text-primary">
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
          <span>{log.day_number === 1 ? "Day one" : `Day ${log.day_number}`}</span>
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {log.what_i_did && (
          <JournalSection title="What I did" body={log.what_i_did} />
        )}
        {log.what_i_learned && (
          <JournalSection title="What I learned" body={log.what_i_learned} />
        )}
        {log.what_was_difficult && (
          <JournalSection title="What was difficult" body={log.what_was_difficult} />
        )}
        {log.tomorrow_plan && (
          <JournalSection title="Tomorrow" body={log.tomorrow_plan} />
        )}
        {log.status === "missed" && log.missed_reason && (
          <JournalSection
            title="Why I missed"
            body={missedReasonLabel(log.missed_reason)}
          />
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
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/share/${log.day_number}`}
            className={buttonVariants()}
          >
            Share this day
          </Link>
          <Link
            href="/check-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            Edit this entry
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
          title={`Day ${log.day_number} / 30 — ${log.task}`}
          text={`Day ${log.day_number} / 30 • ${statusLabel(log.status)} • ${log.task} • ${project.area} • @${user.username} on Project 30`}
        />
      </footer>
    </article>
  );
}

function JournalSection({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
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
      className={cn(
        "w-4",
        status === "completed" && "text-primary",
        status === "partial" && "text-primary/60",
        status === "missed" && "text-muted-foreground/70"
      )}
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