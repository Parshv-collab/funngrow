import { ArrowUp } from "lucide-react";

/**
 * The payout readout that sits in the nav.
 *
 * ⚠️ DELIBERATELY NOT ANIMATED ⚠️
 * The obvious thing to do here is make the number tick upward. That would be
 * fake live UI: this build has no connection to Funngro's payout feed, so any
 * movement would be invented. The DESIGNS.md risk note for this direction is
 * explicit that fake liveness is worse than none, so the component renders the
 * real published figure and holds still.
 *
 * It takes `value` as a prop, so wiring a real subscription later means
 * changing the caller and nothing in here — see README "Wiring the ticker".
 *
 * The dot is a static mint marker rather than a pulsing animation, for the
 * same reason.
 */
export default function LiveTicker({
  value,
  label = "this week",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border border-frame-border bg-card/70 px-3.5 py-2 ${className}`}
      title={`${value} paid out ${label}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
      />
      <span className="num tabular text-[13px] text-foreground">{value}</span>
      <ArrowUp
        size={13}
        className="shrink-0 text-accent"
        aria-hidden="true"
      />
      <span className="label-mono hidden !text-[10px] xl:inline">{label}</span>
    </span>
  );
}
