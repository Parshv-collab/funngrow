import { COMPANY_TIMELINE } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * Story timeline — five milestones alternating either side of a vertical line.
 *
 * The vertical rule is a single absolutely-positioned line at centre (desktop)
 * or at the left (mobile), with each entry's marker dot sitting on it. The
 * alternating layout is done by placing entries in a 2-column grid and pushing
 * odd entries into the right column — not by absolute positioning, which is
 * what makes layouts like this break the moment a paragraph gets long.
 *
 * Dates are Funngro's published ones. See ReleaseNotes.tsx and site.ts for the
 * correction against the brief's dates.
 */
export default function StoryTimeline() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>The story</Kicker>
            <h2 id="story-heading" className="type-section mt-4 text-foreground">
              <span className="block">Four years from</span>
              <span className="emphasis block">an MVP to 70 lakh.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            Founded in Mumbai in 2022. Every milestone below is published by
            Funngro.
          </p>
        </div>

        {/* the timeline */}
        <ol className="relative mt-12 md:mt-16">
          {/* the spine */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2"
          />

          {COMPANY_TIMELINE.map((entry, i) => {
            const rightSide = i % 2 === 1;
            return (
              <li
                key={entry.year}
                className="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-2 md:gap-12 md:pb-12 md:pl-0"
              >
                {/* marker on the spine */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-background bg-accent md:left-1/2 md:-translate-x-1/2"
                />

                <div
                  className={
                    rightSide
                      ? "md:col-start-2 md:pl-10"
                      : "md:col-start-1 md:pr-10 md:text-right"
                  }
                >
                  <p className="num tracking-[0.1em] text-accent">
                    {entry.year}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {entry.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${
                      rightSide ? "" : "md:ml-auto"
                    } md:max-w-[46ch]`}
                  >
                    {entry.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
