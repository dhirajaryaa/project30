export type LogStatus = "completed" | "partial" | "missed";

export type ActivityType =
  | "learning"
  | "building"
  | "bug-fix"
  | "feature"
  | "ui-design"
  | "research"
  | "practice"
  | "other";

export type MissedReason =
  | "no-time"
  | "work"
  | "family-responsibility"
  | "health"
  | "lost-focus"
  | "unexpected-event"
  | "other";

export type ProjectStatus = "active" | "completed";

export type User = {
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  socials?: Record<string, string>;
};

export type Project = {
  area: string;
  goal: string;
  start_date: string; // YYYY-MM-DD
  status: ProjectStatus;
};

export type DailyLog = {
  day: number; // 1-30
  date: string; // YYYY-MM-DD
  task: string;
  status: LogStatus;
  activity_type: ActivityType;
  missed_reason?: MissedReason;
  evidence_url?: string;
  body: string; // markdown prose
};

export type SiteData = {
  user: User;
  project: Project;
  logs: DailyLog[];
};

export type PublicProfile = {
  user: User;
  project: Project;
  logs: DailyLog[];
  currentDay: number;
  counts: { completed: number; partial: number; missed: number };
  progress: number;
  todayLog: DailyLog | null;
};

export type PublicDay = {
  user: User;
  project: Project;
  log: DailyLog;
};