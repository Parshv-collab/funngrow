import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

/**
 * The root layout.
 *
 * PERFORMANCE
 *  - The three fonts the first screen needs are preloaded: Instrument Serif
 *    roman and italic (the hero headline is the LCP element on both routes and
 *    every section heading uses the italic accent), plus Work Sans regular for
 *    body copy. Preloading the italic matters — the live Funngro site loads no
 *    italic file at all, so its headings re-flow once a synthetic oblique
 *    resolves.
 *  - No font is fetched from a third-party origin: no extra DNS lookup, no
 *    render-blocking stylesheet.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Funngro — Earn Money Online with India's Biggest Brands",
    template: "%s",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  other: { "geo.region": "IN-MH", "geo.placename": "Mumbai" },
};

export const viewport: Viewport = {
  themeColor: "#06130a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className="dark">
      <head>
        <link
          rel="preload"
          href="/fonts/instrument-serif-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/instrument-serif-italic-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/work-sans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
