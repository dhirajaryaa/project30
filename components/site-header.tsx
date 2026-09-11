import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "cn";

export function SiteHeader({
  username,
  displayName,
  avatarUrl,
}: {
  username: string;
  displayName: string;
  avatarUrl?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest text-foreground"
        >
          PROJECT&nbsp;30
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/journey"
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            )}
          >
            Journey
          </Link>
          <Link
            href="/profile"
            className="ml-1 flex items-center gap-2 rounded-md p-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="View profile"
            title={displayName || username}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              className="h-6 w-6 rounded-md border border-border bg-primary/10 object-cover"
            />
            <span className="hidden max-w-[120px] truncate lg:inline">
              {displayName}
            </span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}