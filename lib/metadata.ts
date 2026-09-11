import type { Metadata } from "next";

export function pageMetadata(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const image = input.image ?? "/og/home.png";
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.url },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.url,
      type: "website",
      siteName: "Project 30",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}