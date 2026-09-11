import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/share-buttons";
import { StatusMark } from "@/components/status-mark";
import { Timeline } from "@/components/timeline";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { formatNice } from "@/lib/dates";
import { getPublicProfile } from "@/lib/queries";
import { sortLogs } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) {
    return { title: "Not found", robots: { index: false } };
  }
  const title = `${profile.user.display_name} (@${profile.user.username}) — Project 30`;
  const description = `${profile.project.goal} · ${profile.project.area} · Day ${profile.currentDay}/30 · ${profile.counts.completed} days completed.`;
  const url = `/u/${profile.user.username}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      username: profile.user.username,
      images: [{ url: `/u/${profile.user.username}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/u/${profile.user.username}/opengraph-image`],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) notFound();

  const { user, project, logs, currentDay, counts, progress } = profile;
  const recent = sortLogs(logs).slice(-4).reverse();
  const dayHref = (day: number) => `/u/${user.username}/day/${day}`;
  const profileUrl = `/u/${user.username}`;

  return (
    <div className="mx-auto max-w-3xl pt-10 sm:pt-16">
      <header className="mb-10">
        <div className="flex items-center gap-5">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="size-16 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {user.display_name.slice(0, 1).toUpperCase()}
            </span>
          )}
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
          </div>
        </div>
      </header>

      <section className="mb-10 flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <span aria-hidden>🚩</span>
          {project.area}
        </span>
        <p className="max-w-2xl text-2xl leading-snug font-semibold tracking-tight text-foreground sm:text-3xl">
          {project.goal}
        </p>
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
          Started {formatNice(project.start_date)}. Logged entries are public.
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
              <li key={log.id}>
                <Link
                  href={dayHref(log.day_number)}
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

      <section className="mt-12 border-t border-border pt-8">
        <p className="mb-3 text-sm font-medium">Share this profile</p>
        <ShareButtons
          url={profileUrl}
          title={`${user.display_name} — Day ${currentDay}/30 on Project 30`}
          text={`${user.display_name} is on day ${currentDay}/30: ${project.goal} · ${project.area} · @${user.username}`}
        />
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          30 minutes. 30 days. One area.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Build the habit. Not the hype.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/onboarding" className={buttonVariants({ size: "lg", className: "px-6 text-base" })}>
            Start your own Project 30
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg", className: "px-6 text-base" })}
          >
            How it works
          </Link>
        </div>
      </section>
    </div>
  );
}