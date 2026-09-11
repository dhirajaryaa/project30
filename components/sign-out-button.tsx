"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useApp } from "@/components/app-provider";

export function SignOutButton() {
  const { signOut } = useApp();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        try {
          await authClient.signOut();
        } catch {
          /* session cookie may already be expired */
        }
        signOut();
        // Full reload guarantees a fresh server session state (no race with
        // protected-route redirects) after the cookie above is cleared.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/";
      }}
    >
      Sign out
    </Button>
  );
}