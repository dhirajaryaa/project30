import { STATUS_CONFIG } from "@/lib/constants";
import type { LogStatus } from "@/lib/types";
import { cn } from "cn";

type Props = {
  status?: LogStatus;
  className?: string;
};

export function StatusMark({ status, className }: Props) {
  if (!status)
    return (
      <span
        aria-label="Not completed yet"
        className={cn("text-muted-foreground/60", className)}
      >
        ○
      </span>
    );

  const config = STATUS_CONFIG[status];

  if (status === "completed")
    return (
      <span aria-label="Completed" className={cn("text-primary", className)}>
        {config.mark}
      </span>
    );

  if (status === "missed")
    return (
      <span aria-label="Missed" className={cn("text-muted-foreground/70", className)}>
        {config.mark}
      </span>
    );

  return (
    <span
      aria-label="Partial"
      className={cn("text-primary/60", className)}
    >
      {config.mark}
    </span>
  );
}