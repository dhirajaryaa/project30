import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Daily Check-in",
  description:
    "Today's Project 30 entry — what you did, what you learned, and what's next.",
  url: "/check-in",
  image: "/check-in/opengraph-image",
});

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}