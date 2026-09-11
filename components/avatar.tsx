"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { avatarUrl, newAvatarSeed } from "@/lib/avatar";

export function RetroAvatar({
  url,
  username,
  size = 48,
}: {
  url: string;
  username: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${username}'s avatar`}
      width={size}
      height={size}
      loading="lazy"
      className="rounded-md border border-primary/20 bg-primary/10 object-cover"
    />
  );
}

export function AvatarEditor({
  ownerId,
  username,
  avatarUrl: initialUrl,
  size = 64,
}: {
  ownerId: string;
  username: string;
  avatarUrl: string;
  size?: number;
}) {
  const { user, setAvatar } = useApp();
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const isOwner = Boolean(user && user.id === ownerId);

  async function shuffle() {
    if (!isOwner) return;
    setBusy(true);
    try {
      const next = avatarUrl(newAvatarSeed());
      const result = await setAvatar(next);
      if (result.ok) setUrl(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="group relative">
      <RetroAvatar url={url} username={username} size={size} />
      {isOwner && (
        <button
          type="button"
          onClick={shuffle}
          disabled={busy}
          aria-label="Shuffle avatar"
          title="Shuffle avatar"
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-opacity hover:text-primary focus-visible:text-primary disabled:opacity-50 max-sm:opacity-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
        </button>
      )}
    </div>
  );
}