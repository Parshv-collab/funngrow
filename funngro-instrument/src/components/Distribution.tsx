import { DISTRIBUTION } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * Earnings distribution.
 *
 * Not one average — a shape. Funngro publishes both the median monthly earn
 * (₹4,100) and the top-5% figure (₹18,000+), and showing those against a
 * distribution is more honest and considerably more persuasive than a single
 * headline number, because it tells a reader where they would plausibly land
 * rather than what the best case looks like.
 *
 * The chart is built from divs with percentage heights. No SVG, no canvas, no
 * image, and an explicit container height so it cannot shift.
 *
 * The two marked buckets — the median and the top 5% — are the only bars in the
 * accent colour, so the eye lands on the two numbers that carry the claim.
 */
export default function Distribution() {
  const maxPct = Math.max(...DISTRIBUTION.buckets.map((b) => b.pct));

  return (
    <section
      id="distribution"
      aria-labelledby="distribution-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>Earnings, in the open</Kicker>
            <h2
              id="distribution-heading"
              className="type-section mt-4 text-foreground"
            >
              <span className="block">Not an average.</span>
              <span className="emphasis block">A distribution.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Published Funngro benchmarks, plotted so you can see where most
            earners actually sit rather than what the best case looks like.
          </p>
        </div>

        <div className="panel mt-10 overflow-hidden">
          {/* the two headline numbers */}
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {[DISTRIBUTION.median, DISTRIBUTION.top].map((item) => (
              <div key={item.label} className="p-6 sm:p-8">
                <p className="label-mono">{item.label}</p>
                <p className="type-figure mt-3 flex items-baseline gap-2 text-foreground">
                  {item.value}
                  <span className="num !text-[13px] text-muted-foreground">
                    {item.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* the distribution */}
          <div className="border-t border-border p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label-mono">Share of active earners, by band</p>
              <p className="label-mono !text-[10px]">Illustrative shape</p>
            </div>

            <div
              className="mt-7 flex h-40 items-end gap-1.5 sm:gap-3"
              role="img"
              aria-label="Distribution of monthly earnings across nine bands, peaking between one and four thousand rupees and tapering to the top five percent above eighteen thousand rupees."
            >
              {DISTRIBUTION.buckets.map((bucket) => {
                const marked = Boolean(bucket.mark);
                return (
                  <div
                    key={bucket.band}
                    className="flex h-full flex-1 flex-col justify-end gap-2"
                  >
                    <span
                      className={`num tabular text-center !text-[10px] ${
                        marked ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {bucket.pct}%
                    </span>
                    <span
                      className={`w-full rounded-t-sm ${
                        marked ? "bg-accent" : "bg-status-paid/30"
                      }`}
                      style={{ height: `${(bucket.pct / maxPct) * 100}%` }}
                    />
                    <span
                      className={`num tabular text-center !text-[10px] ${
                        marked ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {bucket.band}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* where the two marked bands sit */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5">
              <p className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm bg-accent"
                />
                <span className="label-mono">
                  Median ₹4,100 · top 5% ₹18,000+
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm bg-status-paid/30"
                />
                <span className="label-mono">All other bands</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background/50 px-6 py-3 sm:px-8">
            <p className="label-mono !text-[10px]">
              {DISTRIBUTION.footnote}
            </p>
            <p className="label-mono !text-[10px]">
              Median and top-5% are published Funngro figures
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
