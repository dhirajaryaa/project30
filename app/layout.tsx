import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Project 30 — 30 minutes. 30 days. One area.",
    template: "%s · Project 30",
  },
  description:
    "A 30-day accountability system. Choose one area you genuinely want to improve, work on it for 30 minutes every day for 30 days, and record what you did, what you learned, and what you will do next.",
  applicationName: "Project 30",
  keywords: [
    "Project 30",
    "30 day challenge",
    "accountability",
    "habit",
    "build log",
  ],
  openGraph: {
    title: "Project 30",
    description:
      "30 minutes. 30 days. One area. Build the habit. Not the hype.",
    type: "website",
    locale: "en_US",
    siteName: "Project 30",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project 30",
    description: "30 minutes. 30 days. One area.",
    images: ["/og/home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("project30:theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}`,
          }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader
            username={user.username}
            displayName={user.display_name}
            avatarUrl={user.avatar_url}
          />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 sm:px-6">
            {children}
          </main>
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}