import Link from "next/link";
import { MAX_DAYS } from "@/lib/constants";
import { getLogByDay, sortLogs } from "@/lib/storage";
import type { DailyLog, LogStatus } from "@/lib/types";
import { cn } from "cn";

export function statusForDay(logs: DailyLog[], day: number): LogStatus | undefined {
  return getLogByDay(sortLogs(logs), day)?.status;
}

type Props = {
  logs: DailyLog[];
  dayHref?: (day: number) => string;
};

export function Timeline({ logs, dayHref }: Props) {
  const days = Array.from({ length: MAX_DAYS }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <StatusCell char="✓" tone="done" /> Completed
        </span>
        <span className="inline-flex items-center gap-1">
          <StatusCell char="◐" tone="partial" /> Partial
        </span>
        <span className="inline-flex items-center gap-1">
          <StatusCell char="—" tone="missed" /> Missed
        </span>
        <span className="inline-flex items-center gap-1">
          <StatusCell char="○" tone="none" /> Not here yet
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
        {days.map((day) => {
          const log = getLogByDay(sortLogs(logs), day);
          const status = log?.status;
          const hasEntry = Boolean(log);

          if (!hasEntry)
            return (
              <div
                key={day}
                className="flex h-12 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center"
              >
                <span className="text-[10px] text-muted-foreground/50">
                  {String(day).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-muted-foreground/60">○</span>
              </div>
            );

          return (
            <Link
              key={day}
              href={dayHref ? dayHref(day) : `/day/${day}`}
              className="flex h-12 flex-col items-center justify-center rounded-lg border border-border bg-background text-center transition-colors hover:border-ring hover:bg-muted/50"
            >
              <span className="text-[10px] text-muted-foreground">
                {String(day).padStart(2, "0")}
              </span>
              <StatusCell char={statusChar(status)} tone={statusTone(status)} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function statusChar(status?: LogStatus): string {
  switch (status) {
    case "completed":
      return "✓";
    case "partial":
      return "◐";
    case "missed":
      return "—";
    default:
      return "○";
  }
}

function statusTone(status?: LogStatus): "done" | "partial" | "missed" | "none" {
  switch (status) {
    case "completed":
      return "done";
    case "partial":
      return "partial";
    case "missed":
      return "missed";
    default:
      return "none";
  }
}

function StatusCell({
  char,
  tone,
}: {
  char: string;
  tone: "done" | "partial" | "missed" | "none";
}) {
  return (
    <span
      className={cn(
        "text-sm leading-none",
        tone === "done" && "text-primary",
        tone === "partial" && "text-primary/60",
        tone === "missed" && "text-muted-foreground/70",
        tone === "none" && "text-muted-foreground/60"
      )}
    >
      {char}
    </span>
  );
}