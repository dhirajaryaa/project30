import type { NextRequest } from "next/server";
import { User } from "./models";

export function bearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
}

export function newToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tok-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function findUserByToken(token: string | null) {
  if (!token) return null;
  return User.findOne({ auth_token: token });
}