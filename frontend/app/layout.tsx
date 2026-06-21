import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "B2B Directory Platform",
    template: "%s | B2B Directory Platform",
  },
  description: "Discover companies, products, articles, and events in one integrated industrial directory.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "B2B Directory Platform",
    description: "Discover companies, products, articles, and events in one integrated industrial directory.",
    siteName: "B2B Directory Platform",
    type: "website",
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Directory Platform",
    description: "Discover companies, products, articles, and events in one integrated industrial directory.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
