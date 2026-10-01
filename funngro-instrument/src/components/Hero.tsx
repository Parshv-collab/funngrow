import { ArrowRight, Star } from "lucide-react";
import { LINKS } from "@/content/site";
import Button from "./ui/Button";
import Kicker from "./ui/Kicker";
import DashboardMock from "./DashboardMock";

/**
 * The hero: two panels, 5 columns and 7 columns of a 12-column grid.
 *
 * LEFT carries the brand's signature four-line headline — two roman lines, then
 * two italic lines in the mint accent — plus one line of body copy, two CTAs
 * and a stat row.
 *
 * RIGHT carries the dashboard, which is where this design diverges hardest from
 * the live site. There is no phone here: a flat panel of working state does the
 * arguing instead, and it keeps going down the rest of the page.
 *
 * The whole hero fades in once. That is one of only three animations in the
 * build (the pill arrow, this fade, the feed cursor) and it collapses to nothing
 * under prefers-reduced-motion.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-frame-border"
    >
      <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        {/* ------------------------------------------------------- left panel */}
        <div className="animate-fade-in lg:col-span-5 lg:pt-2">
          <Kicker>India&rsquo;s youth · India&rsquo;s brands · 2026</Kicker>

          <h1 id="hero-heading" className="type-hero mt-5 text-foreground">
            <span className="block">Get paid by the brands</span>
            <span className="block">you already use.</span>
            <span className="emphasis block">70 lakh young Indians</span>
            <span className="emphasis block">already are.</span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-foreground/85">
            Brand campaigns, content, referrals and surveys from 5,000+ Indian
            brands. Free to join, paid to UPI.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              href={LINKS.playStore}
              external
              withArrow
              ariaLabel="Download the Funngro app from Google Play"
            >
              Download app
            </Button>
            <Button href="#pipeline" variant="outline">
              See how it works
              <ArrowRight size={14} aria-hidden="true" />
            </Button>
          </div>

          {/* stat row */}
          <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Play Store rating</dt>
              <dd className="flex items-center gap-1.5">
                <Star
                  size={13}
                  className="fill-accent text-accent"
                  aria-hidden="true"
                />
                <span className="num tabular text-foreground">4.2</span>
                <span className="label-mono">Play Store</span>
              </dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="sr-only">Total earners</dt>
              <dd className="flex items-center gap-2">
                <span className="num tabular text-foreground">70 Lakh+</span>
                <span className="label-mono">users</span>
              </dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="sr-only">Television</dt>
              <dd className="inline-flex items-center rounded-chip border border-frame-border px-2.5 py-1">
                <span className="label-mono !text-[10px]">
                  Shark Tank India S2
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* ------------------------------------------------------ right panel */}
        <div
          className="animate-fade-in lg:col-span-7"
          style={{ animationDelay: "80ms" }}
        >
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
