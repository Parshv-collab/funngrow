import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PayoutPipeline from "@/components/PayoutPipeline";
import TaskIndex from "@/components/TaskIndex";
import PayoutFeed from "@/components/PayoutFeed";
import Distribution from "@/components/Distribution";
import ReleaseNotes from "@/components/ReleaseNotes";
import JsonLd from "@/components/JsonLd";
import { TASK_TYPES } from "@/content/site";
import {
  buildMetadata,
  organizationSchema,
  taskIndexSchema,
  websiteSchema,
} from "@/lib/seo";

/** TITLE — 55 characters. Unique to this route. */
const TITLE = "Funngro — Earn Money Online with India's Biggest Brands";

/** DESCRIPTION — 157 characters. Unique to this route. */
const DESCRIPTION =
  "70 lakh young Indians earn on Funngro by promoting India's biggest brands. Pick tasks, content or referrals and get paid to UPI. Free to join, no investment.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/",
  ogAlt:
    "Funngro — 70 lakh young Indians earning with India's biggest brands. Paid in UPI.",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema,
          websiteSchema,
          taskIndexSchema(
            TASK_TYPES.map(({ type, typicalBrief }) => ({ type, typicalBrief })),
          ),
        ]}
      />

      <Nav />

      {/*
        Heading outline on this route:
          h1  Get paid by the brands you already use   (Hero)
          h2  From signing up to money in UPI          (PayoutPipeline)
              h3  each of the four pipeline nodes
          h2  Every kind of work, with the rate on it   (TaskIndex)
          h2  We publish what we pay                    (PayoutFeed)
          h2  Not an average. A distribution.           (Distribution)
          h2  Four years, shipped in public.            (ReleaseNotes)
              h3  each release entry
          h2  footer navigation groups
        One h1, no skipped levels. The dashboard mock carries no headings at
        all — it is a product surface, not document structure.
      */}
      <main id="main">
        <Hero />
        <PayoutPipeline />
        <TaskIndex />
        <PayoutFeed />
        <Distribution />
        <ReleaseNotes />
      </main>

      <Footer />
    </>
  );
}
