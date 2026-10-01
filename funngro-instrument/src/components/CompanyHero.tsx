import { LIVE_PAYOUT } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * The /company hero: pure typography, at a larger scale than the home hero.
 *
 * Deliberately carries NO dashboard. The home page argues with the product; this
 * page argues with the record. So the only data on it is one thin strip at the
 * bottom carrying the weekly payout figure in mono — the same number, presented
 * as a footnote rather than a sales point, which is the right register for a
 * page whose job is authority.
 *
 * Same four-line roman→italic-mint pattern as the home hero, at a scale one step
 * up, because here the type is the whole composition.
 */
export default function CompanyHero() {
  return (
    <section
      aria-labelledby="company-heading"
      className="border-b border-frame-border"
    >
      <div className="shell py-16 md:py-24 lg:py-28">
        <Kicker>India&rsquo;s youth · Built in Mumbai</Kicker>

        <h1
          id="company-heading"
          className="mt-6 font-serif font-normal leading-[1.02] tracking-[-0.025em] text-foreground"
          style={{ fontSize: "clamp(2.75rem, 7.6vw, 6.5rem)" }}
        >
          <span className="block">A company built by</span>
          <span className="block">two IIM graduates</span>
          <span className="emphasis block">for 70 lakh Indian</span>
          <span className="emphasis block">teenagers.</span>
        </h1>

        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-prose-soft">
          Funngro exists so that a seventeen-year-old in Nashik and a
          twenty-two-year-old in Madurai can earn from the same brands, with a
          phone, a UPI ID and no permission from anyone.
        </p>

        {/* the single thin data strip */}
        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
          <p className="num tabular !text-[13px] text-muted-foreground">
            <span className="text-accent">{LIVE_PAYOUT.formatted}</span> paid{" "}
            {LIVE_PAYOUT.label}
          </p>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-border sm:block"
          />
          <p className="num tabular !text-[13px] text-muted-foreground">
            70 lakh+ earners
          </p>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-border sm:block"
          />
          <p className="num tabular !text-[13px] text-muted-foreground">
            5,000+ brand partners
          </p>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-border sm:block"
          />
          <p className="num tabular !text-[13px] text-muted-foreground">
            Founded 2022, Mumbai
          </p>
        </div>
      </div>
    </section>
  );
}
