import type { DailyLog, LogStatus } from "./types";

export function getLogByDay(
  logs: DailyLog[],
  day: number
): DailyLog | undefined {
  return logs.find((l) => l.day === day);
}

export function getLogByDate(
  logs: DailyLog[],
  date: string
): DailyLog | undefined {
  return logs.find((l) => l.date === date);
}

export function sortLogs(logs: DailyLog[]): DailyLog[] {
  return [...logs].sort((a, b) => a.day - b.day);
}

export function countByStatus(logs: DailyLog[]) {
  return {
    completed: logs.filter((l) => l.status === "completed").length,
    partial: logs.filter((l) => l.status === "partial").length,
    missed: logs.filter((l) => l.status === "missed").length,
  };
}

export function statusSet(logs: DailyLog[]): Set<number> {
  return new Set(logs.map((l) => l.day));
}

export const VALID_LOG_STATUS: LogStatus[] = ["completed", "partial", "missed"];