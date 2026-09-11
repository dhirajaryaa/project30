import Link from "next/link";
import { getUser } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function LandingCta() {
  const user = getUser();
  const hasProject = Boolean(user.username);

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
      <Link
        href="/profile"
        className={cn(buttonVariants({ size: "lg" }), "px-6 text-base")}
      >
        {hasProject ? "View my progress" : "Start Project 30"}
      </Link>
      <Link
        href="/journey"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "px-6 text-base"
        )}
      >
        {hasProject ? "See the journey" : "See how it works"}
      </Link>
    </div>
  );
}