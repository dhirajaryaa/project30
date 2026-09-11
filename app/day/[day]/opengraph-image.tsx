import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Project 30 — a daily entry.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function DayOpengraphImage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  return new ImageResponse(<OgCard variant="day" day={Number(day)} />, size);
}