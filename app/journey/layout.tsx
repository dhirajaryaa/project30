import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Journey",
  description:
    "Your complete 30-day Project 30 journey — every day, one view.",
  url: "/journey",
  image: "/journey/opengraph-image",
});

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}