import { Schema, models, model } from "mongoose";
import type {
  DailyLog as DailyLogDTO,
  Project as ProjectDTO,
  User as UserDTO,
} from "./types";

const userSchema = new Schema(
  {
    auth_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    display_name: { type: String, required: true },
    avatar_url: String,
  },
  { timestamps: true }
);

const projectSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const dailyLogSchema = new Schema(
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

export const User = models.User ?? model("User", userSchema);
export const Project = models.Project ?? model("Project", projectSchema);
export const DailyLog = models.DailyLog ?? model("DailyLog", dailyLogSchema);

type Doc = Record<string, unknown> & { _id: unknown };

export function toUserDto(doc: Doc): UserDTO {
  return {
    id: String(doc._id),
    username: String(doc.username),
    display_name: String(doc.display_name),
    avatar_url: doc.avatar_url ? String(doc.avatar_url) : undefined,
    created_at: String(doc.createdAt ?? doc.created_at ?? new Date().toISOString()),
  };
}

export function toProjectDto(doc: Doc): ProjectDTO {
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

export function toLogDto(doc: Doc): DailyLogDTO {
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

export function toPublicLogDto(doc: Doc): DailyLogDTO {
  const dto = toLogDto(doc);
  for (const field of PRIVATE_FIELDS) {
    if (dto[field] !== undefined) {
      delete dto[field];
    }
  }
  return dto;
}