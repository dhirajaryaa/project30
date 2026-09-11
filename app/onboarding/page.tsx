"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { todayString } from "@/lib/dates";

export default function OnboardingPage() {
  const { status, user, project, createOnboard, resetAll } = useApp();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [area, setArea] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [startDate, setStartDate] = React.useState(todayString());
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  if (status === "loading") return null;

  if (user && project) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary">
          PROJECT 30
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          You already have a Project 30 running
        </h1>
        <p className="text-muted-foreground">
          {project.area} — {project.goal}
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard" className="inline-flex">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
        <button
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={async () => {
            if (
              confirm(
                "This deletes your current Project 30 and all logs. Continue?"
              )
            ) {
              await resetAll();
              router.refresh();
            }
          }}
        >
          Start over from scratch
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!area.trim()) {
      setError("Tell us the area you want to improve.");
      setSubmitting(false);
      return;
    }
    if (!goal.trim()) {
      setError("Set your 30-day goal.");
      setSubmitting(false);
      return;
    }
    const result = await createOnboard({
      username,
      display_name: displayName,
      area: area.trim(),
      goal: goal.trim(),
      start_date: startDate,
    });
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-xl pt-14 sm:pt-20">
      <p className="mb-2 text-sm font-semibold tracking-widest text-primary">
        START PROJECT 30
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        One area. One goal. Thirty days.
      </h1>
      <p className="mt-2 text-muted-foreground">
        Everything you write becomes your public build log. Keep it real.
      </p>

      <form onSubmit={submit} className="mt-10 flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="awesome-builder"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Your public identity: /u/{username || "username"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display name (optional)</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="area">What area do you want to improve?</Label>
          <Input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Web Development"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">What&apos;s your 30-day goal?</Label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Build consistently for 30 days and ship something real."
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Day 1 starts here. Today by default.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Creating…" : "Start Project 30"}
          </Button>
        </div>
      </form>

      <Card className="mt-12">
        <CardContent className="gap-2">
          <p className="font-medium">The deal you&apos;re making</p>
          <p className="text-sm leading-6 text-muted-foreground">
            One project. 30 minutes a day. 30 daily entries. That&apos;s the
            whole system — no streaks, no points, no noise. Just show up and
            write down what happened.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}