import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bearerToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { DailyLog, Project, User, toLogDto } from "@/lib/models";
import type { ActivityType, LogStatus, MissedReason } from "@/lib/types";

const VALID_STATUS: LogStatus[] = ["completed", "partial", "missed"];
const VALID_ACTIVITY: ActivityType[] = [
  "learning",
  "building",
  "bug-fix",
  "feature",
  "ui-design",
  "research",
  "practice",
  "other",
];
const VALID_MISSED: MissedReason[] = [
  "no-time",
  "work",
  "family-responsibility",
  "health",
  "lost-focus",
  "unexpected-event",
  "other",
];

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ day: string }> }
) {
  const conn = await connectDb();
  if (!conn) {
    return NextResponse.json(
      { error: "Database is unavailable. Check MONGODB_URI." },
      { status: 500 }
    );
  }

  const token = bearerToken(request);
  const user = await User.findOne({ auth_token: token });
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { day } = await context.params;
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    return NextResponse.json({ error: "Day must be between 1 and 30." }, { status: 400 });
  }

  const project = await Project.findOne({ user_id: user._id, status: "active" });
  if (!project) {
    return NextResponse.json({ error: "No active project." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = body.status as LogStatus;
  const activityType = (body.activity_type ?? "other") as ActivityType;
  const missedReason = body.missed_reason as MissedReason | undefined;
  const task = String(body.task ?? "").trim();
  const date = String(body.date ?? "").trim();

  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (!VALID_ACTIVITY.includes(activityType)) {
    return NextResponse.json({ error: "Invalid activity type." }, { status: 400 });
  }
  if (!task) {
    return NextResponse.json({ error: "What is today's task?" }, { status: 400 });
  }
  if (status === "missed" && !missedReason) {
    return NextResponse.json({ error: "Pick a missed day reason." }, { status: 400 });
  }
  if (missedReason && !VALID_MISSED.includes(missedReason)) {
    return NextResponse.json({ error: "Invalid missed reason." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const evidence_url = String(body.evidence_url ?? "").trim() || undefined;

  const patch: Record<string, unknown> = {
    project_id: project._id,
    day_number: dayNumber,
    date,
    task,
    status,
    activity_type: activityType,
    what_i_did: String(body.what_i_did ?? "").trim(),
    what_i_learned: String(body.what_i_learned ?? "").trim(),
    what_was_difficult: String(body.what_was_difficult ?? "").trim() || undefined,
    tomorrow_plan: String(body.tomorrow_plan ?? "").trim(),
    missed_reason: status === "missed" ? missedReason : undefined,
    evidence_url,
  };

  const log = await DailyLog.findOneAndUpdate(
    { project_id: project._id, day_number: dayNumber },
    { $set: patch },
    { upsert: true, new: true }
  );

  return NextResponse.json(toLogDto(log.toObject()));
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ day: string }> }
) {
  const conn = await connectDb();
  if (!conn) {
    return NextResponse.json(
      { error: "Database is unavailable. Check MONGODB_URI." },
      { status: 500 }
    );
  }

  const token = bearerToken(request);
  const user = await User.findOne({ auth_token: token });
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { day } = await context.params;
  const dayNumber = Number(day);
  const project = await Project.findOne({ user_id: user._id, status: "active" });
  if (!project) {
    return NextResponse.json({ ok: true });
  }
  await DailyLog.deleteOne({ project_id: project._id, day_number: dayNumber });
  return NextResponse.json({ ok: true });
}