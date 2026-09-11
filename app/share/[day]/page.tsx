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

export default function SharePage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = React.use(params);
  const day = Number(dayParam);
  const { status, project, user, getLog } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/onboarding");
  }, [status, router]);

  if (status !== "ready" || !project || !user) return null;

  const log = getLog(day);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/u/${user.username}/day/${day}`;
  const profileUrl = `${baseUrl}/u/${user.username}`;

  if (!log) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          No entry for day {day}
        </h1>
        <Link href="/check-in" className={buttonVariants()}>
          Log it first
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pt-10 sm:pt-16">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold tracking-widest text-primary">
          SHARE YOUR DAY
        </p>
        <Link
          href={`/day/${log.day_number}`}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          View journal entry
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-12">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.25em] text-foreground">
            PROJECT 30
          </span>
          <span className="text-xs text-muted-foreground">
            {formatNice(log.date)}
          </span>
        </div>

        <div className="mt-12">
          <p className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            DAY {log.day_number}
            <span className="text-neutral-300"> / 30</span>
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium",
              log.status === "completed" && "text-emerald-600",
              log.status === "partial" && "text-amber-600",
              log.status === "missed" && "text-neutral-400"
            )}
          >
            <span>{statusMark(log.status)}</span>
            <span className="tracking-widest">{statusLabel(log.status)}</span>
          </span>
        </div>

        <p className="mt-8 text-2xl leading-snug font-medium tracking-tight text-foreground sm:text-3xl">
          {log.task}
        </p>
        {log.what_i_did && (
          <p className="mt-4 text-base leading-7 text-neutral-500">
            {log.what_i_did}
          </p>
        )}
        {log.evidence_url && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500">
            <span className="font-medium text-neutral-600 uppercase tracking-wider">
              Proof
            </span>
            <a
              href={log.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[260px] truncate text-foreground underline underline-offset-4"
            >
              {log.evidence_url}
            </a>
          </div>
        )}

        <div className="mt-12 border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{project.area}</span>
            <span className="text-neutral-500">
              {activityTypeLabel(log.activity_type)}
              {log.status === "missed" && log.missed_reason
                ? ` · ${missedReasonLabel(log.missed_reason)}`
                : ""}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
            <span>@ {user.username}</span>
            <span className="font-mono">{shareUrl.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ShareButtons
          url={shareUrl}
          title={`Day ${log.day_number} / 30 — ${log.task}`}
          text={`Day ${log.day_number} / 30 • ${statusLabel(log.status)} • ${log.task} • ${project.area} • @${user.username} on Project 30`}
        />
        <p className="text-xs text-muted-foreground">
          The shared link points to your public entry — anyone can view it
          without an account. Your public profile:{" "}
          <Link href={profileUrl} className="underline underline-offset-4">
            {profileUrl}
          </Link>
        </p>
      </div>
    </div>
  );
}

function statusMark(status: string): string {
  return status === "completed" ? "✓" : status === "partial" ? "◐" : "—";
}

function statusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "COMPLETED";
    case "partial":
      return "PARTIAL";
    case "missed":
      return "MISSED";
    default:
      return status;
  }
}