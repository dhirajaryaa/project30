import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Project 30 — 30 minutes. 30 days. One area.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgCard variant="landing" />, size);
}