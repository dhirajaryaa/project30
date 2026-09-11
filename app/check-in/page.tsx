"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ACTIVITY_TYPES,
  MISSED_REASONS,
  STATUS_CONFIG,
} from "@/lib/constants";
import { addDays, currentDayNumber, todayString } from "@/lib/dates";
import type {
  ActivityType,
  DailyLog,
  LogStatus,
  MissedReason,
  Project,
  SaveLogInput,
} from "@/lib/types";
import { cn } from "cn";

const STATUS_OPTIONS: {
  value: LogStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "completed",
    label: "Completed",
    description: "You did the work.",
  },
  {
    value: "partial",
    label: "Partial",
    description: "You did some of it.",
  },
  {
    value: "missed",
    label: "Missed",
    description: "You didn't get to it today.",
  },
];

export default function CheckInPage() {
  const { status, project, user, currentDay, todayLog, saveLog } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  if (status === "loading") return <Loader />;
  if (status !== "ready" || !project || !user) return null;

  const expectedDay = currentDayNumber(project.start_date);

  return (
    <div className="mx-auto max-w-2xl pt-10 sm:pt-16">
      <header className="mb-10">
        <p className="text-sm font-semibold tracking-widest text-primary">
          DAILY CHECK-IN
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Day {currentDay}
          </h1>
          <span className="text-muted-foreground">/ 30</span>
        </div>
        {expectedDay !== currentDay && (
          <p className="mt-2 text-sm text-muted-foreground">
            Your journey started on {project.start_date}. Based on the current
            date you are on day {expectedDay}.
          </p>
        )}
      </header>

      <CheckInForm
        key={todayLog?.id ?? "new"}
        todayLog={todayLog}
        currentDay={currentDay}
        project={project}
        onCreate={() => router.push(`/day/${currentDay}`)}
        saveLog={saveLog}
      />
    </div>
  );
}

function CheckInForm({
  todayLog,
  currentDay,
  project,
  onCreate,
  saveLog,
}: {
  todayLog: DailyLog | undefined;
  currentDay: number;
  project: Project;
  onCreate: () => void;
  saveLog: (input: SaveLogInput) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const [task, setTask] = React.useState(todayLog?.task ?? "");
  const [status, setStatus] = React.useState<LogStatus>(todayLog?.status ?? "completed");
  const [activityType, setActivityType] = React.useState<ActivityType>(
    todayLog?.activity_type ?? "building"
  );
  const [whatIDid, setWhatIDid] = React.useState(todayLog?.what_i_did ?? "");
  const [whatILearned, setWhatILearned] = React.useState(todayLog?.what_i_learned ?? "");
  const [whatWasDifficult, setWhatWasDifficult] = React.useState(
    todayLog?.what_was_difficult ?? ""
  );
  const [tomorrowPlan, setTomorrowPlan] = React.useState(todayLog?.tomorrow_plan ?? "");
  const [evidenceUrl, setEvidenceUrl] = React.useState(todayLog?.evidence_url ?? "");
  const [missedReason, setMissedReason] = React.useState<MissedReason | undefined>(
    todayLog?.missed_reason
  );
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const today = todayString();
  const tomorrow = addDays(today, 1);
  const isMissed = status === "missed";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!task.trim()) {
      setError("What is today's task?");
      setSaving(false);
      return;
    }
    if (status === "missed" && !missedReason) {
      setError("Pick a missed day reason.");
      setSaving(false);
      return;
    }

    const result = await saveLog({
      day_number: currentDay,
      date: today,
      task: task.trim(),
      status,
      activity_type: activityType,
      what_i_did: whatIDid.trim(),
      what_i_learned: whatILearned.trim(),
      what_was_difficult: whatWasDifficult.trim() || undefined,
      tomorrow_plan: tomorrowPlan.trim(),
      missed_reason: status === "missed" ? missedReason : undefined,
      evidence_url: evidenceUrl.trim() || undefined,
    });
    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }
    onCreate();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <Label htmlFor="task">Today&apos;s task</Label>
        <Input
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Build the public profile page"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Status</Label>
        <RadioGroup
          value={status}
          onValueChange={(v) => setStatus(v as LogStatus)}
          className="grid-cols-1 sm:grid-cols-3"
        >
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors",
                status === opt.value && "border-primary bg-muted/40"
              )}
            >
              <RadioGroupItem value={opt.value} />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {STATUS_CONFIG[opt.value].mark} {opt.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Activity type</Label>
        <Select
          value={activityType}
          onValueChange={(v) => setActivityType(v as ActivityType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatIDid">What did you do?</Label>
        <Textarea
          id="whatIDid"
          value={whatIDid}
          onChange={(e) => setWhatIDid(e.target.value)}
          placeholder="Built the public profile page and added responsive layout."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatILearned">What did you learn?</Label>
        <Textarea
          id="whatILearned"
          value={whatILearned}
          onChange={(e) => setWhatILearned(e.target.value)}
          placeholder="Learned how Open Graph metadata affects social previews."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatWasDifficult">What was difficult? (optional)</Label>
        <Textarea
          id="whatWasDifficult"
          value={whatWasDifficult}
          onChange={(e) => setWhatWasDifficult(e.target.value)}
          placeholder="Getting the preview to update after deployment."
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="evidenceUrl">Proof of work — link it (optional)</Label>
        <Input
          id="evidenceUrl"
          type="url"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          placeholder="https://github.com/you/day7-build"
        />
        <p className="text-xs text-muted-foreground">
          A link to what you actually did. Shown on your public progress as{" "}
          proof.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tomorrowPlan">What will you do tomorrow?</Label>
        <Textarea
          id="tomorrowPlan"
          value={tomorrowPlan}
          onChange={(e) => setTomorrowPlan(e.target.value)}
          placeholder="Add the social sharing card and test the mobile layout."
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          {tomorrow} — day {Math.min(currentDay + 1, 30)} / 30
        </p>
      </div>

      {isMissed && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <Label>Why was it missed?</Label>
          <Select
            value={missedReason}
            onValueChange={(v) => setMissedReason(v as MissedReason)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {MISSED_REASONS.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={saving} className="flex-1">
          {saving ? "Saving…" : "Save check-in"}
        </Button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md px-4 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to dashboard
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Project: {project.area} — day {currentDay} / 30.
      </p>
    </form>
  );
}