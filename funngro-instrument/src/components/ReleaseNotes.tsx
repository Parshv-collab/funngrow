import { GitCommitHorizontal } from "lucide-react";
import { RELEASE_NOTES } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * The Shark Tank story as release notes.
 *
 * Funngro's Shark Tank episode is the single most quotable thing about them and
 * their own site tells it in three large before/after tiles. Presenting it as a
 * versioned changelog does something the tiles cannot: it makes the growth read
 * as a sequence of shipped work rather than a lucky break, and it puts the
 * current state (v3.0) at the end of a trajectory rather than in a stat block.
 *
 * Every entry is a published Funngro fact. The dates come from their own
 * /about page, not from the brief — the brief placed the episode in 2023 and
 * the SucSEED backing in 2024, but Funngro states "December 2022. We pitched on
 * national television." The 2024 slot uses their real 2024 milestone instead so
 * that no year is filled with an invented event. See site.ts for the note.
 */
export default function ReleaseNotes() {
  return (
    <section
      id="releases"
      aria-labelledby="releases-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>Release notes</Kicker>
            <h2
              id="releases-heading"
              className="type-section mt-4 text-foreground"
            >
              <span className="block">Four years,</span>
              <span className="emphasis block">shipped in public.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Funngro&rsquo;s history, from an MVP in Mumbai to 70 lakh earners.
            Every entry below is published by the company.
          </p>
        </div>

        <ol className="mt-12 md:mt-16">
          {RELEASE_NOTES.map((release, i) => {
            const isCurrent = release.tag === "current";
            return (
              <li
                key={release.version}
                className="group relative grid gap-3 border-t border-border py-7 md:grid-cols-12 md:gap-6 md:py-8"
              >
                {/* version + date */}
                <div className="flex items-center gap-3 md:col-span-3">
                  <span
                    className={`inline-flex items-center rounded-chip border px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] ${
                      isCurrent
                        ? "border-accent/45 bg-accent/10 text-accent"
                        : "border-frame-border text-muted-foreground"
                    }`}
                  >
                    {release.version}
                  </span>
                  <span className="num tabular !text-[12px] text-muted-foreground">
                    {release.date}
                  </span>
                </div>

                {/* body */}
                <div className="md:col-span-9 lg:col-span-7">
                  <h3 className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                    <GitCommitHorizontal
                      size={16}
                      className={`shrink-0 ${
                        isCurrent ? "text-accent" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    {release.title}
                  </h3>
                  <p className="mt-2 max-w-[62ch] pl-[26px] text-sm leading-relaxed text-muted-foreground">
                    {release.body}
                  </p>
                </div>

                {/*
                  Trailing marker, wide viewports only.

                  This was `hidden md:flex md:col-span-0 lg:col-span-2`. Tailwind
                  has no col-span-0, so at md the span was auto-placed into a
                  fresh row one column wide and, being wider than that column,
                  overflowed past the left edge of the page — the audit caught it
                  as a 65px element at x = -3. The marker now simply waits for lg,
                  where 3 + 7 + 2 actually fills the twelve columns.
                */}
                <div className="hidden items-center justify-end lg:col-span-2 lg:flex">
                  <span
                    className={`label-mono !text-[10px] ${
                      isCurrent ? "!text-accent" : ""
                    }`}
                  >
                    {i === RELEASE_NOTES.length - 1 ? "current" : release.tag}
                  </span>
                </div>
              </li>
            );
          })}
          <li aria-hidden="true" className="border-t border-border" />
        </ol>
      </div>
    </section>
  );
}
