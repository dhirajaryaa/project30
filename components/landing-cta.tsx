import Link from "next/link";
import { getUser } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function LandingCta() {
  const user = getUser();
  const hasProject = Boolean(user.username);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link
        href={hasProject ? `/u/${user.username}` : "/journey"}
        className={cn(buttonVariants({ size: "lg" }), "px-6 text-base")}
      >
        {hasProject ? "View public progress" : "Start Project 30"}
      </Link>
      <Link
        href={hasProject ? "/journey" : "#how-it-works"}
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