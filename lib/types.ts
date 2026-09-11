export type User = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
};

export type ProjectStatus = "active" | "completed";

export type Project = {
  id: string;
  user_id: string;
  area: string;
  goal: string;
  start_date: string; // YYYY-MM-DD
  status: ProjectStatus;
  created_at: string;
};

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

export type DailyLog = {
  id: string;
  project_id: string;
  day_number: number; // 1-30
  date: string; // YYYY-MM-DD
  task: string;
  status: LogStatus;
  activity_type: ActivityType;
  what_i_did: string;
  what_i_learned: string;
  what_was_difficult?: string;
  tomorrow_plan: string;
  missed_reason?: MissedReason;
  evidence_url?: string;
  created_at: string;
  updated_at: string;
};

export type AppData = {
  user: User | null;
  project: Project | null;
  logs: DailyLog[];
};

export type OnboardInput = {
  username: string;
  display_name: string;
  area: string;
  goal: string;
  start_date: string;
};

export type SaveLogInput = {
  day_number: number;
  date: string;
  task: string;
  status: LogStatus;
  activity_type: ActivityType;
  what_i_did: string;
  what_i_learned: string;
  what_was_difficult?: string;
  tomorrow_plan: string;
  missed_reason?: MissedReason;
  evidence_url?: string;
};