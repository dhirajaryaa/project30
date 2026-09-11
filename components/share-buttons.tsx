"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, Check, Copy, Globe, Share2 } from "lucide-react";
import { absoluteUrl } from "@/lib/site";

type Props = {
  url: string;
  title?: string;
  text?: string;
};

export function ShareButtons({ url, title, text }: Props) {
  const hasShare = React.useSyncExternalStore(
    () => () => {},
    () => "share" in navigator,
    () => false
  );
  const [copied, setCopied] = React.useState(false);

  const shareUrl = absoluteUrl(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const webShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ url: shareUrl, title, text });
    } catch {
      /* user cancelled */
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text ?? title ?? "Project 30");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={copy} data-slot="button">
        {copied ? (
          <Check className="text-primary" />
        ) : (
          <Copy />
        )}
        {copied ? "Copied" : "Copy link"}
      </Button>
{hasShare && (
          <Button variant="secondary" onClick={webShare}>
            <Share2 />
            Share
          </Button>
        )}
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
      >
        <ArrowUpRight />
        <span className="hidden sm:inline">X</span>
      </Link>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Globe />
        <span className="hidden sm:inline">LinkedIn</span>
      </Link>
    </div>
  );
}