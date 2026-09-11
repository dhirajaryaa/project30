"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useApp } from "@/components/app-provider";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useApp();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await signOut();
        await authClient.signOut();
        router.push("/");
      }}
    >
      Sign out
    </Button>
  );
}