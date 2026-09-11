import { connectDb } from "./db";
import { DailyLog, Project, User, toLogDto, toProjectDto, toUserDto } from "./models";
import { countByStatus, getLogByDay } from "./storage";
import type { AppData } from "./types";

export async function getMeData(token: string | null): Promise<AppData | null> {
  if (!token) return null;
  const conn = await connectDb();
  if (!conn) return null;
  const user = await User.findOne({ auth_token: token });
  if (!user) return null;
  const project = await Project.findOne({ user_id: user._id }).sort({ createdAt: -1 });
  const logs = project
    ? await DailyLog.find({ project_id: project._id }).sort({ day_number: 1 })
    : [];
  return {
    user: toUserDto(user.toObject()),
    project: project ? toProjectDto(project.toObject()) : null,
    logs: logs.map((l) => toLogDto(l.toObject())),
  };
}

export async function getPublicProfile(username: string) {
  const conn = await connectDb();
  if (!conn) return null;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return null;
  const project = await Project.findOne({ user_id: user._id }).sort({ createdAt: -1 });
  if (!project) return null;
  const logs = await DailyLog.find({ project_id: project._id }).sort({ day_number: 1 });
  const dtoLogs = logs.map((l) => toLogDto(l.toObject()));
  const currentDay = currentDayFromStart(project.start_date);
  const counts = countByStatus(dtoLogs);
  const progress = Math.min(Math.round((counts.completed / 30) * 100), 100);
  return {
    user: toUserDto(user.toObject()),
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
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return null;
  const project = await Project.findOne({ user_id: user._id }).sort({ createdAt: -1 });
  if (!project) return null;
  const log = await DailyLog.findOne({ project_id: project._id, day_number: day });
  if (!log) return null;
  return {
    user: toUserDto(user.toObject()),
    project: toProjectDto(project.toObject()),
    log: toLogDto(log.toObject()),
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