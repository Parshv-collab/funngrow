import { VALUES } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * Values as four operating rules in a 2×2 grid.
 *
 * Each value states how it is enforced rather than how it feels. "Money hits a
 * UPI account before the end of the day" is checkable against a payout receipt;
 * "we are customer-obsessed" is not. That distinction is the whole reason this
 * section is worth having on a page that is trying to establish trust.
 *
 * The rules between cells come from a gap over a background, not from four
 * separate bordered boxes, so the grid reads as one surface.
 */
export default function Values() {
  return (
    <section
      id="values"
      aria-labelledby="values-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>What we hold to</Kicker>
            <h2 id="values-heading" className="type-section mt-4 text-foreground">
              <span className="block">Four rules we</span>
              <span className="emphasis block">don&rsquo;t bend.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            Each one states how it is enforced, because a value you cannot check
            is a slogan.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border border-frame-border bg-frame-border sm:grid-cols-2">
          {VALUES.map((value) => (
            <li key={value.id} className="bg-card">
              <article className="flex h-full flex-col p-7 sm:p-9">
                <span className="font-mono text-3xl tracking-[0.05em] text-accent">
                  {value.id}
                </span>
                <h3 className="mt-5 font-serif text-2xl leading-tight text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
