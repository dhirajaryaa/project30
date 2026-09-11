import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Dashboard",
  description:
    "Your Project 30 dashboard — how many days done, today's focus, and your next action.",
  url: "/dashboard",
  image: "/dashboard/opengraph-image",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}