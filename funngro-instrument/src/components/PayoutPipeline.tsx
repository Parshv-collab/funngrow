import { Banknote, ClipboardCheck, ShieldCheck, UserPlus } from "lucide-react";
import { PIPELINE, PIPELINE_TIMINGS } from "@/content/site";
import Kicker from "./ui/Kicker";

const ICONS = [UserPlus, ClipboardCheck, ShieldCheck, Banknote];

/**
 * The payout pipeline.
 *
 * This replaces the "how it works" three-step section entirely, and it is a
 * different object: not a list of instructions but a process diagram. Four
 * nodes sit on one continuous track, and the three gaps between them carry the
 * timings — ≈2 min, varies, 24–48h — which is the actual information someone
 * deciding whether to sign up wants. Funngro's own copy promises a first payout
 * inside twenty-four hours; this is that promise drawn as a timeline instead of
 * asserted in a sentence.
 *
 * Semantically an <ol>, because the order is the meaning.
 */
export default function PayoutPipeline() {
  return (
    <section id="pipeline" aria-labelledby="pipeline-heading" className="section border-b border-frame-border">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>Payout pipeline</Kicker>
            <h2 id="pipeline-heading" className="type-section mt-4 text-foreground">
              <span className="block">From signing up to</span>
              <span className="emphasis block">money in UPI.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Four stages, no fee at any of them. The only variable is how long a
            brand takes to review the work.
          </p>
        </div>

        <ol className="mt-12 grid md:mt-16 md:grid-cols-4">
          {PIPELINE.map((node, i) => {
            const Icon = ICONS[i] ?? UserPlus;
            const timing = PIPELINE_TIMINGS[i];
            return (
              <li
                key={node.n}
                className="relative border-l border-frame-border pb-9 pl-6 last:pb-0 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-6 md:pt-8"
              >
                {/* the node marker sitting on the track */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[3.5px] top-[22px] h-[7px] w-[7px] rounded-full bg-accent md:left-0 md:top-[-3.5px]"
                />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="num text-accent">{node.n}</span>
                  {timing ? (
                    <span className="label-mono !text-[10px]">
                      <span aria-hidden="true">→ </span>
                      {timing}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
                  <Icon
                    size={17}
                    className="shrink-0 text-accent"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {node.title}
                </h3>

                <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
                  {node.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
