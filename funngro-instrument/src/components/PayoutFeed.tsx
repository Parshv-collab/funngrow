import { PAYOUT_FEED } from "@/content/site";
import { STATUS } from "@/content/status";
import Kicker from "./ui/Kicker";

/**
 * The payout feed, as a terminal.
 *
 * Funngro's live feed is genuinely their best asset and on their own site it is
 * a small widget wedged beside the hero. Here it gets a whole section, set in
 * JetBrains Mono the way a log file reads: timestamp, city, amount, then the
 * event path with its terminal status highlighted.
 *
 * The panel is the ONE element in this build with a shadow — the specified
 * subtle mint inset glow — and it is what separates the feed from every other
 * flat surface on the page.
 *
 * The entries are Funngro's real published payouts; names are masked exactly as
 * Funngro masks them, so no individual is identified. Clock times are an
 * illustrative formatting of an otherwise undated feed.
 *
 * The blinking cursor is real caret animation, not a fake data tick — nothing
 * on this page claims to be live data that is not.
 */
export default function PayoutFeed() {
  return (
    <section id="feed" aria-labelledby="feed-heading" className="section border-b border-frame-border">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Kicker>Payout feed</Kicker>
            <h2 id="feed-heading" className="type-section mt-4 text-foreground">
              <span className="block">We publish</span>
              <span className="emphasis block">what we pay.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Every settled payout hits this log. Cities, categories and amounts
              are real; earner names are masked at the first letter, the way
              Funngro masks them.
            </p>
            <p className="mt-6 border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-prose-soft">
              &ldquo;Trust by evidence&rdquo; is only worth saying if the
              evidence is checkable. This is the evidence.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="panel panel-glow overflow-hidden">
              {/* panel header */}
              <div className="panel-head">
                <p className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-status-paid"
                  />
                  <span className="label-mono !text-foreground">
                    payouts.log
                  </span>
                </p>
                <p className="label-mono !text-[10px]">
                  {PAYOUT_FEED.length} entries
                </p>
              </div>

              {/* the log */}
              <ol className="divide-y divide-border/60 px-4 py-2 sm:px-5">
                {PAYOUT_FEED.map((entry) => (
                  <li
                    key={`${entry.time}-${entry.city}-${entry.amount}`}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2.5"
                  >
                    <span className="num tabular !text-[12px] text-muted-foreground">
                      {entry.time}
                    </span>
                    <span
                      aria-hidden="true"
                      className="num !text-[12px] text-border"
                    >
                      ·
                    </span>
                    <span className="num !text-[12px] text-foreground">
                      {entry.city}
                    </span>
                    <span
                      aria-hidden="true"
                      className="num !text-[12px] text-border"
                    >
                      ·
                    </span>
                    <span className="num tabular !text-[12px] font-semibold text-accent">
                      {entry.amount}
                    </span>
                    <span
                      aria-hidden="true"
                      className="num !text-[12px] text-border"
                    >
                      ·
                    </span>
                    {/* The event path, with the terminal state in its own
                        status colour. This is the only place in the feed where
                        status colour appears, and it is the only signal of
                        state in the row — so the state word is also written
                        out in full. */}
                    <span className="num !text-[12px] text-muted-foreground">
                      {entry.path}/
                      <span
                        className={
                          entry.status === "paid"
                            ? "text-status-paid"
                            : entry.status === "approved"
                              ? "text-status-approved"
                              : "text-status-submitted"
                        }
                      >
                        {STATUS[entry.status].label.toLowerCase()}
                      </span>
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-1.5 py-2.5" aria-hidden="true">
                  <span className="num !text-[12px] text-accent">$</span>
                  <span className="inline-block h-3.5 w-1.5 animate-blink bg-accent" />
                </li>
              </ol>
            </div>

            <p className="label-mono mt-3 !text-[10px]">
              Amounts as published by Funngro · settled to UPI or bank
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
