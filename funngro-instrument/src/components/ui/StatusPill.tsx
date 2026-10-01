import { STATUS, type Status } from "@/content/status";

/**
 * A status indicator.
 *
 * Always renders a coloured dot AND the state name, never colour alone — which
 * is what keeps the dashboard readable in greyscale and for anyone with a
 * colour-vision deficiency. The `meaning` string goes on the title attribute so
 * hovering explains the state.
 *
 * `size` switches between the compact table variant and the roomier count
 * variant used in the hero's summary row.
 */
export default function StatusPill({
  status,
  count,
  size = "sm",
  className = "",
}: {
  status: Status;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = STATUS[status];

  return (
    <span
      className={`status-pill ${meta.pill} ${
        size === "md" ? "!px-2.5 !py-1.5 !text-[11px]" : ""
      } ${className}`}
      title={meta.meaning}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`}
      />
      <span>{meta.label}</span>
      {typeof count === "number" ? (
        <span className="tabular opacity-70">{count}</span>
      ) : null}
    </span>
  );
}
