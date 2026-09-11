import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { getPublicDay } from "@/lib/queries";

export const alt = "Project 30 — a 30-day accountability build log.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function DayOpengraphImage({
  params,
}: {
  params: Promise<{ username: string; day: string }>;
}) {
  const { username, day } = await params;
  const entry = await getPublicDay(username, Number(day));
  return new ImageResponse(
    <OgCard
      variant="day"
      day={entry?.log.day_number ?? Number(day)}
      status={entry?.log.status}
      task={entry?.log.task}
      area={entry?.project.area}
      username={entry?.user.username ?? username}
    />,
    size
  );
}