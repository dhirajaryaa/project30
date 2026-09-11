import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { getPublicProfile } from "@/lib/queries";

export const alt = "Project 30 — a 30-day accountability build log.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function ProfileOpengraphImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  return new ImageResponse(
    <OgCard
      variant="profile"
      username={profile?.user.username ?? username}
      area={profile?.project.area}
      goal={profile?.project.goal}
      day={profile?.currentDay}
    />,
    size
  );
}