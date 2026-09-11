import type { Metadata } from "next";
import { LandingCta } from "@/components/landing-cta";
import { buttonVariants } from "@/components/ui/button";
import { getAllLogs, getProject, getUser } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "cn";

export const metadata: Metadata = pageMetadata({
  title: "Project 30 — 30 minutes. 30 days. One area.",
  description:
    "A 30-day accountability system. Choose one area, work on it for 30 minutes every day for 30 days, and record what you did, what you learned, and what you will do next.",
  url: "/",
  image: "/og/home.png",
});

const STEPS = [
  {
    n: "01",
    title: "Choose one area",
    body: "One area you genuinely want to improve. Not five. Not ten. One.",
  },
  {
    n: "02",
    title: "Set your 30-day goal",
    body: "One clear commitment that will keep you coming back for 30 days.",
  },
  {
    n: "03",
    title: "Work for 30 minutes",
    body: "Every day. The bar is intentionally low and intentionally repeatable.",
  },
  {
    n: "04",
    title: "Log what you did",
    body: "Write down what you did, what you learned, and what felt difficult.",
  },
  {
    n: "05",
    title: "Repeat for 30 days",
    body: "Plan tomorrow as you finish today. Watch progress become visible.",
  },
];

export default function Home() {
  const user = getUser();
  const project = getProject();
  const logs = getAllLogs();

  const grid = Array.from({ length: 30 }, (_, i) => {
    const log = logs.find((l) => l.day === i + 1);
    return log?.status ?? "none";
  });

  return (
    <div className="flex flex-col px-4 sm:px-6">
      <section className="flex flex-col items-center pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          A personal accountability journal + public build log
        </p>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tighter text-foreground sm:text-7xl">
          30 minutes.
          <br />
          30 days.
          <br />
          <span className="text-primary">One area.</span>
        </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground sm:text-xl">
          Build the habit. Not the hype.
        </p>
        <div className="mt-10">
          <LandingCta />
        </div>
        {user.username && (
          <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
            {user.display_name} is building on{" "}
            <span className="font-medium text-foreground">{project.area}</span>{" "}
            — {project.goal}.
          </p>
        )}
      </section>

      <section className="flex justify-center pb-20">
        <div className="w-full max-w-xl">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Your 30 days will look like this</span>
            <span>{logs.length} logged so far</span>
          </div>
          <div className="grid grid-cols-15 grid-rows-2 gap-1.5">
            {grid.map((s, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-md border border-border bg-background text-[10px] sm:text-xs"
              >
                <span
                  className={cn(
                    s === "completed" && "text-primary",
                    s === "partial" && "text-primary/50",
                    s === "missed" && "text-muted-foreground/50",
                    s === "none" && "text-muted-foreground/30"
                  )}
                >
                  {s === "completed"
                    ? "✓"
                    : s === "partial"
                      ? "◐"
                      : s === "missed"
                        ? "—"
                        : "·"}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ✓ completed · ◐ partial · — missed · · not here yet
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-border/60 py-20 sm:py-24"
      >
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          The system in five steps
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col gap-2">
              <span className="text-4xl font-semibold tracking-tight text-primary/70">
                {step.n}
              </span>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
          <div className="flex flex-col justify-end gap-4 rounded-xl border border-border bg-card p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              No streaks to maintain. No points to game. Just one area, worked
              on daily, made visible.
            </p>
            <a
              href="/profile"
              className={cn(buttonVariants({ size: "sm" }), "w-fit")}
            >
              View my progress
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        <p>
          Less management. More doing. More reflection. More visible progress.
        </p>
      </footer>
    </div>
  );
}