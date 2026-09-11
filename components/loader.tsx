import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-xs font-medium tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </p>
    </div>
  );
}