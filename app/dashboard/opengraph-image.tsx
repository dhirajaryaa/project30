import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";

export const alt = "Project 30 — your dashboard.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function DashboardOpengraphImage() {
  return new ImageResponse(<OgCard variant="dashboard" />, size);
}