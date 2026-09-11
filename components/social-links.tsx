import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";

const SOCIAL_ICONS = {
  github: IconBrandGithub,
  twitter: IconBrandX,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  instagram: IconBrandInstagram,
} as const;

export function SocialLinks({ socials }: { socials?: Record<string, string> }) {
  if (!socials) return null;
  const links = Object.entries(socials).filter(
    ([key, url]) => key in SOCIAL_ICONS && url
  );
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {links.map(([key, url]) => {
        const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
        return (
          <Link
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            title={key}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon size={18} />
          </Link>
        );
      })}
    </div>
  );
}