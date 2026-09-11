"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-5 text-center">
      <p className="text-sm font-semibold tracking-widest text-primary">
        PROJECT 30
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        We hit an unexpected problem. Your data is safe — try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className={cn(buttonVariants({ size: "lg" }), "px-6")}
      >
        Try again
      </button>
    </div>
  );
}