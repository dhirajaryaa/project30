import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getAuthDb } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

const hasGoogle = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const db = await getAuthDb();

export const auth = betterAuth({
  baseURL: SITE_URL,
  secret: process.env.AUTH_SECRET,
  trustedOrigins: [SITE_URL],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: false },
  user: {
    additionalFields: {
      username: { type: "string", required: false, input: false },
      avatar_url: { type: "string", required: false, input: false },
    },
  },
  socialProviders: hasGoogle
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  plugins: [nextCookies()],
  advanced: {
    cookiePrefix: "project30",
  },
});

export const googleConfigured = hasGoogle;