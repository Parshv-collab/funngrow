import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CompanyHero from "@/components/CompanyHero";
import Mission from "@/components/Mission";
import StoryTimeline from "@/components/StoryTimeline";
import TeamGrid from "@/components/TeamGrid";
import Values from "@/components/Values";
import CareersTeaser from "@/components/CareersTeaser";
import JsonLd from "@/components/JsonLd";
import { aboutPageSchema, buildMetadata, organizationSchema } from "@/lib/seo";

/** TITLE — 54 characters. Unique to this route. */
const TITLE = "Funngro — Company & About Us | Built for India's Youth";

/** DESCRIPTION — 154 characters. Unique to this route. */
const DESCRIPTION =
  "Funngro was founded to give every young Indian a real first income. Meet the founders, the mission and the team behind 70 lakh earners across India today.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/company",
  ogAlt:
    "Funngro — built for India's youth. Two founders, seventy lakh earners, and a real first income for young India.",
});

export default function CompanyPage() {
  return (
    <>
      {/* AboutPage + Organization, sharing the same @id graph as the home page
          so Google resolves one entity rather than two competing ones. */}
      <JsonLd
        data={[
          aboutPageSchema({ title: TITLE, description: DESCRIPTION }),
          organizationSchema,
        ]}
      />

      <Nav />

      {/*
        Heading outline on this route:
          h1  A company built by two IIM graduates  (CompanyHero)
          h2  Make earning normal for young India    (Mission)
          h2  Four years from an MVP to 70 lakh      (StoryTimeline)
              h3  each timeline milestone
          h2  Small team. Unusually close to work.   (TeamGrid)
              h3  each team member or placeholder role
          h2  Four rules we don't bend.              (Values)
              h3  each value
          h2  Most of the team started as users.     (CareersTeaser)
          h2  footer navigation groups
        One h1, no skipped levels, and the hero is intentionally free of any
        dashboard — this page argues with the record, not the product.
      */}
      <main id="main">
        <CompanyHero />
        <Mission />
        <StoryTimeline />
        <TeamGrid />
        <Values />
        <CareersTeaser />
      </main>

      <Footer />
    </>
  );
}
