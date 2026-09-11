import type { ActivityType, LogStatus, MissedReason } from "./types";

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "learning", label: "Learning" },
  { value: "building", label: "Building" },
  { value: "bug-fix", label: "Bug Fix" },
  { value: "feature", label: "Feature" },
  { value: "ui-design", label: "UI / Design" },
  { value: "research", label: "Research" },
  { value: "practice", label: "Practice" },
  { value: "other", label: "Other" },
];

export const MISSED_REASONS: { value: MissedReason; label: string }[] = [
  { value: "no-time", label: "No time" },
  { value: "work", label: "Work" },
  { value: "family-responsibility", label: "Family responsibility" },
  { value: "health", label: "Health" },
  { value: "lost-focus", label: "Lost focus" },
  { value: "unexpected-event", label: "Unexpected event" },
  { value: "other", label: "Other" },
];

export const STATUS_CONFIG: Record<
  LogStatus,
  { label: string; mark: string; description: string }
> = {
  completed: { label: "Completed", mark: "✓", description: "Done" },
  partial: { label: "Partial", mark: "◐", description: "Partial" },
  missed: { label: "Missed", mark: "—", description: "Missed" },
};

export const MAX_DAYS = 30;

export function activityTypeLabel(value: ActivityType): string {
  return ACTIVITY_TYPES.find((a) => a.value === value)?.label ?? value;
}

export function missedReasonLabel(value?: MissedReason): string {
  if (!value) return "";
  return MISSED_REASONS.find((m) => m.value === value)?.label ?? value;
}