"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/app-provider";
import { cn } from "cn";

export function SiteHeader() {
  const { status, user, project } = useApp();
  const pathname = usePathname();

  const showLinks = status === "ready" && user && project;

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/check-in", label: "Today" },
    { href: "/journey", label: "Journey" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href={showLinks ? "/dashboard" : "/"}
          className="text-sm font-semibold tracking-widest text-foreground"
        >
          PROJECT&nbsp;30
        </Link>
        <nav className="flex items-center gap-1">
          {showLinks &&
            nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          {user && project && (
            <Link
              href={`/u/${user.username}`}
              className="ml-1 hidden rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              @{user.username}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}