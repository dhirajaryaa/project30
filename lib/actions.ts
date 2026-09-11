"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { avatarUrl } from "@/lib/avatar";
import { isValidUsername } from "@/lib/dates";
import { connectDb, getAuthDb } from "@/lib/db";
import { DailyLog, Project } from "@/lib/models";
import { getProfileData } from "@/lib/queries";
import type {
  AppData,
  ActivityType,
  LogStatus,
  MissedReason,
  OnboardInput,
  SaveLogInput,
} from "@/lib/types";

type Result = { ok: true; data: AppData } | { ok: false; error: string };

const ACTIVITY_TYPES: ActivityType[] = [
  "learning",
  "building",
  "bug-fix",
  "feature",
  "ui-design",
  "research",
  "practice",
  "other",
];
const LOG_STATUSES: LogStatus[] = ["completed", "partial", "missed"];
const MISSED_REASONS: MissedReason[] = [
  "no-time",
  "work",
  "family-responsibility",
  "health",
  "lost-focus",
  "unexpected-event",
  "other",
];

const MAX_FIELD = 5000;
const MAX_TASK = 300;

// better-auth's mongodbAdapter stores _id as a string; native driver TS types default to ObjectId.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authFilter = (id: string): any => ({ _id: id });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectFilter = (userId: string): any => ({ user_id: userId });

async function requireAuthId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id ?? null;
}

async function requireOwnedProject(authId: string) {
  const conn = await connectDb();
  if (!conn) return { user: null, project: null, error: "Database is unavailable." };
  const db = await getAuthDb();
  const user = await db.collection("user").findOne(authFilter(authId));
  if (!user) return { user: null, project: null, error: "No account." };
  const project = await Project.findOne(projectFilter(authId)).sort({ createdAt: -1 });
  if (!project) return { user, project: null, error: "No active project." };
  return { user, project, error: null };
}

function cleanText(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function appDataOf(user: unknown, project: unknown, logs: unknown[]): AppData {
  return {
    user: (user as AppData["user"]) ?? null,
    project: (project as AppData["project"]) ?? null,
    logs: (logs as AppData["logs"]) ?? [],
  };
}

export async function getSessionData(): Promise<AppData | null> {
  const authId = await requireAuthId();
  if (!authId) return null;
  return getProfileData(authId);
}

export async function onboardProject(input: OnboardInput): Promise<Result> {
  const authId = await requireAuthId();
  if (!authId) return { ok: false, error: "Please sign in first." };

  const username = cleanText(input.username, 30).toLowerCase();
  const display_name = cleanText(input.display_name, 80) || username;
  const area = cleanText(input.area, 120);
  const goal = cleanText(input.goal, 600);
  const start_date = cleanText(input.start_date, 10);

  if (!isValidUsername(username)) {
    return {
      ok: false,
      error:
        "Username must be 2-30 characters using lowercase letters, numbers, dashes or underscores.",
    };
  }
  if (!area) return { ok: false, error: "Tell us the area you want to improve." };
  if (!goal) return { ok: false, error: "Set your 30-day goal." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
    return { ok: false, error: "Pick a valid start date (YYYY-MM-DD)." };
  }

  const conn = await connectDb();
  if (!conn) return { ok: false, error: "Database is unavailable." };
  const db = await getAuthDb();

  const existingUser = await db.collection("user").findOne(authFilter(authId));
  if (!existingUser) return { ok: false, error: "No account." };

  const activeProject = await Project.findOne(projectFilter(authId)).sort({
    createdAt: -1,
  });
  if (activeProject) {
    return {
      ok: false,
      error: "You already have an active Project 30. Finish or reset it first.",
    };
  }

  const usernameTaken =
    existingUser.username !== username &&
    (await db.collection("user").findOne({ username }));
  if (usernameTaken) {
    return { ok: false, error: "That username is already taken." };
  }

  await db.collection("user").updateOne(authFilter(authId), {
      $set: {
        username,
        name: display_name,
        avatar_url: existingUser.avatar_url || avatarUrl(username),
      },
    });

  await Project.create({
    user_id: authId,
    area,
    goal,
    start_date,
    status: "active",
  });

  const data = await getProfileData(authId);
  return { ok: true, data: data ?? appDataOf(null, null, []) };
}

export async function saveLog(input: SaveLogInput): Promise<Result> {
  const authId = await requireAuthId();
  if (!authId) return { ok: false, error: "Please sign in first." };

  const day = Math.trunc(Number(input.day_number));
  if (!Number.isFinite(day) || day < 1 || day > 30) {
    return { ok: false, error: "Day must be between 1 and 30." };
  }
  const status = input.status;
  if (!LOG_STATUSES.includes(status as LogStatus)) {
    return { ok: false, error: "Invalid status." };
  }
  const activity_type = String(input.activity_type ?? "other");
  if (!ACTIVITY_TYPES.includes(activity_type as ActivityType)) {
    return { ok: false, error: "Invalid activity type." };
  }
  const date = cleanText(input.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Pick a valid date (YYYY-MM-DD)." };
  }
  if (status === "missed") {
    const reason = input.missed_reason;
    if (!reason || !MISSED_REASONS.includes(reason as MissedReason)) {
      return { ok: false, error: "Select a reason for missing the day." };
    }
  }

  const { user, project, error } = await requireOwnedProject(authId);
  if (error || !user || !project) return { ok: false, error: error ?? "Not authorized." };

  await DailyLog.updateOne(
    { project_id: project._id, day_number: day },
    {
      day_number: day,
      date,
      task: cleanText(input.task, MAX_TASK),
      status,
      activity_type: activity_type as ActivityType,
      what_i_did: cleanText(input.what_i_did),
      what_i_learned: cleanText(input.what_i_learned),
      what_was_difficult: cleanText(input.what_was_difficult) || undefined,
      tomorrow_plan: cleanText(input.tomorrow_plan),
      missed_reason:
        status === "missed" ? (input.missed_reason as MissedReason) : undefined,
      evidence_url: cleanText(input.evidence_url, 1000) || undefined,
    },
    { upsert: true, runValidators: true }
  );

  const data = await getProfileData(authId);
  return { ok: true, data: data ?? appDataOf(null, null, []) };
}

export async function deleteLog(dayNumber: number): Promise<Result> {
  const authId = await requireAuthId();
  if (!authId) return { ok: false, error: "Please sign in first." };

  const day = Math.trunc(Number(dayNumber));
  if (!Number.isFinite(day) || day < 1 || day > 30) {
    return { ok: false, error: "Day must be between 1 and 30." };
  }

  const { user, project, error } = await requireOwnedProject(authId);
  if (error || !user || !project) return { ok: false, error: error ?? "Not authorized." };

  await DailyLog.deleteOne({ project_id: project._id, day_number: day });
  const data = await getProfileData(authId);
  return { ok: true, data: data ?? appDataOf(null, null, []) };
}

export async function setAvatar(avatar_url: string): Promise<Result> {
  const authId = await requireAuthId();
  if (!authId) return { ok: false, error: "Please sign in first." };

  const url = cleanText(avatar_url, 1000);
  if (!/^https?:\/\//.test(url)) {
    return { ok: false, error: "avatar_url must be a valid URL." };
  }

  const conn = await connectDb();
  if (!conn) return { ok: false, error: "Database is unavailable." };
  const db = await getAuthDb();
  const result = await db
    .collection("user")
    .updateOne({ _id: authId }, { $set: { avatar_url: url } });
  if (!result.matchedCount) return { ok: false, error: "No account." };

  const data = await getProfileData(authId);
  return { ok: true, data: data ?? appDataOf(null, null, []) };
}

export async function resetAll(): Promise<AppData | null> {
  const authId = await requireAuthId();
  if (!authId) return null;

  const conn = await connectDb();
  if (!conn) return null;
  const db = await getAuthDb();

  const project = await Project.findOne(projectFilter(authId));
  if (project) {
    await DailyLog.deleteMany({ project_id: project._id });
    await Project.deleteOne({ _id: project._id });
  }

  await db
    .collection("user")
    .updateOne(authFilter(authId), { $unset: { username: 1, avatar_url: 1 }, $set: { name: "" } });

  return getProfileData(authId);
}
