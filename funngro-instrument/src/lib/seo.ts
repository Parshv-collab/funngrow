import type { Metadata } from "next";
import { LINKS, SITE } from "@/content/site";

/**
 * SITE_URL — the single origin behind canonical tags, Open Graph URLs, the
 * sitemap and every JSON-LD block. Set NEXT_PUBLIC_SITE_URL in your Vercel
 * project to point all of them at your real domain at once.
 *
 * This centralisation is one of the things the audit flags about the live
 * Funngro build, where robots.txt and sitemap.xml use `www.funngro.com` while
 * the app emits `https://funngro.com` canonicals — and that non-www host then
 * 302-redirects to www, so every canonical points at a redirect.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://funngro-instrument.vercel.app"
).replace(/\/$/, "");

export const abs = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function buildMetadata({
  title,
  description,
  path,
  ogAlt,
}: {
  title: string;
  description: string;
  path: string;
  ogAlt: string;
}): Metadata {
  const url = abs(path);
  const image = abs(path === "/company" ? "/company/opengraph-image" : "/opengraph-image");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Funngro",
      creator: "@Funngro",
      title,
      description,
      images: [image],
    },
  };
}

/* --------------------------------------------------------------- JSON-LD ---- */

/**
 * Organization.
 *
 * The @id matters. The live Funngro site describes an Organization on every
 * route with no @id at all, so Google reads them as parallel descriptions
 * rather than one entity. Here every node is anchored to the same @id graph and
 * referenced by @id from the other nodes.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE_URL,
  email: SITE.email,
  description: SITE.description,
  logo: {
    "@type": "ImageObject",
    url: abs("/logo.svg"),
    contentUrl: abs("/logo.svg"),
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.street}, ${SITE.address.locality}`,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [LINKS.instagram, LINKS.linkedin, LINKS.x, LINKS.youtube],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE.name,
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

/** AboutPage — the correct type for /company. */
export function aboutPageSchema({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${abs("/company")}/#aboutpage`,
    url: abs("/company"),
    name: title,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * An ItemList of the task categories, so the offering is machine-readable
 * without parsing the table. Also a Service node for the platform itself —
 * appropriate here because this page is product-led in a way a marketing page
 * is not.
 */
export function taskIndexSchema(
  items: { type: string; typicalBrief: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ways to earn on Funngro",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.type,
      description: item.typicalBrief,
    })),
  };
}
