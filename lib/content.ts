import fs from "node:fs";
import path from "node:path";
import { countByStatus, getLogByDay, sortLogs } from "./storage";
export { getLogByDay } from "./storage";
import type {
  DailyLog,
  LogStatus,
  Project,
  PublicDay,
  PublicProfile,
  SiteData,
  User,
} from "./types";

const CONFIG_PATH = path.join(process.cwd(), "config", "config.json");
const LOGS_DIR = path.join(process.cwd(), "daily-log");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) data[key] = value;
  }
  return { data, body: raw.slice(match[0].length).trim() };
}

function readConfig(): { user: User; project: Project } {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw) as { user: User; project: Project };
  return {
    user: {
      username: String(parsed.user.username ?? ""),
      display_name: String(parsed.user.display_name ?? ""),
      avatar_url: parsed.user.avatar_url ? String(parsed.user.avatar_url) : undefined,
      bio: parsed.user.bio ? String(parsed.user.bio) : undefined,
      socials: parsed.user.socials,
    },
    project: {
      area: String(parsed.project.area ?? ""),
      goal: String(parsed.project.goal ?? ""),
      start_date: String(parsed.project.start_date ?? ""),
      status: parsed.project.status === "completed" ? "completed" : "active",
    },
  };
}

export function getUser(): User {
  return readConfig().user;
}

export function getProject(): Project {
  return readConfig().project;
}

export function getAllLogs(): DailyLog[] {
  if (!fs.existsSync(LOGS_DIR)) return [];
  const files = fs
    .readdirSync(LOGS_DIR)
    .filter((f) => /^\d+\.(md|mdx)$/.test(f))
    .sort((a, b) => Number(a.split(".")[0]) - Number(b.split(".")[0]));

  const logs: DailyLog[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(LOGS_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (!data.day) continue;
    const day = Number(data.day);
    if (!Number.isInteger(day) || day < 1 || day > 30) continue;

    const task = String(data.task ?? "");
    let status: LogStatus = "completed";
    if (data.status === "partial" || data.status === "missed") {
      status = data.status;
    }

    logs.push({
      day,
      date: String(data.date ?? ""),
      task,
      status,
      activity_type: (data.activity_type ??
        "other") as DailyLog["activity_type"],
      missed_reason: (data.missed_reason as DailyLog["missed_reason"]) || undefined,
      evidence_url: (data.evidence_url as string) || undefined,
      body,
    });
  }
  return sortLogs(logs);
}

export function getSiteData(): SiteData {
  const { user, project } = readConfig();
  return { user, project, logs: getAllLogs() };
}

function currentDayFromStart(startDate: string): number {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = Math.floor((today - start) / 86400000) + 1;
  return Math.min(Math.max(day, 0), 30);
}

export function getPublicProfile(username: string): PublicProfile | null {
  const site = getSiteData();
  if (site.user.username.toLowerCase() !== username.toLowerCase()) return null;
  const { user, project, logs } = site;
  const currentDay = currentDayFromStart(project.start_date);
  const counts = countByStatus(logs);
  const progress = Math.min(Math.round((counts.completed / 30) * 100), 100);
  return {
    user,
    project,
    logs,
    currentDay,
    counts,
    progress,
    todayLog: getLogByDay(logs, currentDay) ?? null,
  };
}

export function getPublicDay(username: string, day: number): PublicDay | null {
  const site = getSiteData();
  if (site.user.username.toLowerCase() !== username.toLowerCase()) return null;
  const log = getLogByDay(site.logs, day);
  if (!log) return null;
  return { user: site.user, project: site.project, log };
}