import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-5 text-center">
      <p className="text-sm font-semibold tracking-widest text-primary">
        PROJECT 30
      </p>
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground">
        That page doesn&apos;t exist. Maybe the journey never started, or the
        link went stale.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "px-6" })}>
        Back to Project 30
      </Link>
    </div>
  );
}