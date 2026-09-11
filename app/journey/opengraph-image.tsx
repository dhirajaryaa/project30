import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Project 30 — the 30-day journey.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function JourneyOpengraphImage() {
  return new ImageResponse(<OgCard variant="journey" />, size);
}