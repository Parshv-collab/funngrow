/**
 * The mono uppercase section label. Rendered as a <p> so it never competes with
 * the heading outline — every section's heading level is deliberate and no
 * level is skipped.
 */
export default function Kicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`kicker ${className}`}>{children}</p>;
}
