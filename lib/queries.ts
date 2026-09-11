import { connectDb, getAuthDb } from "./db";
import {
  DailyLog,
  Project,
  toLogDto,
  toProjectDto,
  toPublicLogDto,
  toUserDto,
} from "./models";
import { countByStatus, getLogByDay } from "./storage";
import type { AppData } from "./types";
import { ObjectId } from "mongodb";

const authFilter = (id: string) => ({ _id: new ObjectId(id) });

async function getAuthUserById(authId: string) {
  try {
    const db = await getAuthDb();
    return await db.collection("user").findOne(authFilter(authId));
  } catch {
    return null;
  }
}

async function getAuthUserByUsername(username: string) {
  try {
    const db = await getAuthDb();
    return await db.collection("user").findOne({ username: username.toLowerCase() });
  } catch {
    return null;
  }
}

export async function getProfileData(authId: string): Promise<AppData | null> {
  if (!authId) return null;
  const conn = await connectDb();
  if (!conn) return null;
  const user = await getAuthUserById(authId);
  if (!user) return { user: null, project: null, logs: [] };
  const project = await Project.findOne({ user_id: authId }).sort({
    createdAt: -1,
  });
  const logs = project
    ? await DailyLog.find({ project_id: project._id }).sort({ day_number: 1 })
    : [];
  return {
    user: toUserDto(user),
    project: project ? toProjectDto(project.toObject()) : null,
    logs: logs.map((l) => toLogDto(l.toObject())),
  };
}

export async function getPublicProfile(username: string) {
  const conn = await connectDb();
  if (!conn) return null;
  const user = await getAuthUserByUsername(username);
  if (!user || !user.username) return null;
  const project = await Project.findOne({ user_id: String(user._id) }).sort({
    createdAt: -1,
  });
  if (!project) return null;
  const logs = await DailyLog.find({ project_id: project._id }).sort({
    day_number: 1,
  });
  const dtoLogs = logs.map((l) => toPublicLogDto(l.toObject()));
  const currentDay = currentDayFromStart(project.start_date);
  const counts = countByStatus(dtoLogs);
  const progress = Math.min(Math.round((counts.completed / 30) * 100), 100);
  return {
    user: toUserDto(user),
    project: toProjectDto(project.toObject()),
    logs: dtoLogs,
    currentDay,
    counts,
    progress,
    todayLog: getLogByDay(dtoLogs, currentDay) ?? null,
  };
}

export async function getPublicDay(username: string, day: number) {
  const conn = await connectDb();
  if (!conn) return null;
  const user = await getAuthUserByUsername(username);
  if (!user || !user.username) return null;
  const project = await Project.findOne({ user_id: String(user._id) }).sort({
    createdAt: -1,
  });
  if (!project) return null;
  const log = await DailyLog.findOne({ project_id: project._id, day_number: day });
  if (!log) return null;
  return {
    user: toUserDto(user),
    project: toProjectDto(project.toObject()),
    log: toPublicLogDto(log.toObject()),
  };
}

function currentDayFromStart(startDate: string): number {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = Math.floor((today - start) / 86400000) + 1;
  return Math.min(Math.max(day, 1), 30);
}