import { Schema, models, model, type Model, type Types } from "mongoose";
import type {
  DailyLog as DailyLogDTO,
  Project as ProjectDTO,
  User as UserDTO,
} from "./types";

export interface ProjectDoc {
  user_id: string;
  area: string;
  goal: string;
  start_date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyLogDoc {
  project_id: Types.ObjectId;
  day_number: number;
  date: string;
  task: string;
  status: string;
  activity_type: string;
  what_i_did: string;
  what_i_learned: string;
  what_was_difficult?: string;
  tomorrow_plan: string;
  missed_reason?: string;
  evidence_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDoc>(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    area: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    start_date: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const dailyLogSchema = new Schema<DailyLogDoc>(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    day_number: { type: Number, required: true, min: 1, max: 30 },
    date: { type: String, required: true },
    task: { type: String, default: "" },
    status: {
      type: String,
      enum: ["completed", "partial", "missed"],
      required: true,
    },
    activity_type: { type: String, default: "other" },
    what_i_did: { type: String, default: "" },
    what_i_learned: { type: String, default: "" },
    what_was_difficult: String,
    tomorrow_plan: { type: String, default: "" },
    missed_reason: String,
    evidence_url: String,
  },
  { timestamps: true }
);

dailyLogSchema.index({ project_id: 1, day_number: 1 }, { unique: true });

export const Project = (
  models.Project ?? model<ProjectDoc>("Project", projectSchema)
) as Model<ProjectDoc>;
export const DailyLog = (
  models.DailyLog ?? model<DailyLogDoc>("DailyLog", dailyLogSchema)
) as Model<DailyLogDoc>;

// User rows come from the better-auth `user` collection (one table per user).
// id = the better-auth user id, display name = better-auth `name` (from Google).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toUserDto(doc: any): UserDTO {
  return {
    id: String(doc._id ?? doc.id),
    username: doc.username ? String(doc.username) : "",
    display_name: String(doc.name ?? doc.display_name ?? doc.username ?? ""),
    avatar_url: doc.avatar_url ? String(doc.avatar_url) : undefined,
    created_at: String(doc.createdAt ?? doc.created_at ?? new Date().toISOString()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toProjectDto(doc: any): ProjectDTO {
  return {
    id: String(doc._id),
    user_id: String(doc.user_id),
    area: String(doc.area),
    goal: String(doc.goal),
    start_date: String(doc.start_date),
    status: doc.status === "completed" ? "completed" : "active",
    created_at: String(doc.createdAt ?? doc.created_at ?? new Date().toISOString()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toLogDto(doc: any): DailyLogDTO {
  return {
    id: String(doc._id),
    project_id: String(doc.project_id),
    day_number: Number(doc.day_number),
    date: String(doc.date),
    task: String(doc.task ?? ""),
    status: doc.status as DailyLogDTO["status"],
    activity_type: doc.activity_type as DailyLogDTO["activity_type"],
    what_i_did: String(doc.what_i_did ?? ""),
    what_i_learned: String(doc.what_i_learned ?? ""),
    what_was_difficult: doc.what_was_difficult ? String(doc.what_was_difficult) : undefined,
    tomorrow_plan: String(doc.tomorrow_plan ?? ""),
    missed_reason: doc.missed_reason as DailyLogDTO["missed_reason"],
    evidence_url: doc.evidence_url ? String(doc.evidence_url) : undefined,
    created_at: String(doc.createdAt ?? doc.created_at ?? new Date().toISOString()),
    updated_at: String(doc.updatedAt ?? doc.updated_at ?? new Date().toISOString()),
  };
}

const PRIVATE_FIELDS = ["what_was_difficult", "missed_reason"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPublicLogDto(doc: any): DailyLogDTO {
  const dto = toLogDto(doc);
  for (const field of PRIVATE_FIELDS) {
    if (dto[field] !== undefined) {
      delete dto[field];
    }
  }
  return dto;
}