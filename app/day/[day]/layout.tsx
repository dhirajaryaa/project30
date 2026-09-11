import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const n = Math.trunc(Number(day));
  return pageMetadata({
    title: `Day ${Number.isFinite(n) ? n : 0} / 30`,
    description: "A single day of your Project 30 journey.",
    url: `/day/${day}`,
    image: `/day/${encodeURIComponent(day)}/opengraph-image`,
  });
}

export default function DayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}