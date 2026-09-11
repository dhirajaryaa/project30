import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getAuthDb } from "@/lib/db";

const baseURL =
  process.env.AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

const hasGoogle = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const db = await getAuthDb();

export const auth = betterAuth({
  baseURL,
  secret: process.env.AUTH_SECRET,
  trustedOrigins: [baseURL],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: false },
  socialProviders: hasGoogle
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  advanced: {
    cookiePrefix: "project30",
  },
});

export const googleConfigured = hasGoogle;