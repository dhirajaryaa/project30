"use client";

import Link from "next/link";
import { useApp } from "@/components/app-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function LandingCta() {
  const { status, user, project } = useApp();
  const hasProject = status === "ready" && user && project;

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link
        href={hasProject ? "/dashboard" : "/onboarding"}
        className={cn(buttonVariants({ size: "lg" }), "px-6 text-base")}
      >
        {hasProject ? "Open your dashboard" : "Start Project 30"}
      </Link>
      <Link
        href={hasProject ? `/u/${user!.username}` : "#how-it-works"}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "px-6 text-base"
        )}
      >
        {hasProject ? "View public progress" : "See how it works"}
      </Link>
    </div>
  );
}