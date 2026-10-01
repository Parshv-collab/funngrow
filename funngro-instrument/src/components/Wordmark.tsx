import { SITE } from "@/content/site";

/**
 * The Funngro wordmark: the ascending-bar mark plus the name in Instrument
 * Serif, rendered as inline SVG and HTML text. No image request, sharp at any
 * density, and the text stays selectable and crawlable.
 *
 * The same mark is at /icon.svg and /logo.svg for the favicon and the
 * Organization JSON-LD.
 */
export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? 24 : 28;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={box}
        height={box}
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" fill="#101913" />
        <rect
          x="0.75"
          y="0.75"
          width="62.5"
          height="62.5"
          rx="13.25"
          fill="none"
          stroke="#26342a"
          strokeWidth="1.5"
        />
        <rect x="15" y="36" width="7" height="14" rx="3.5" fill="#5ddd96" opacity="0.45" />
        <rect x="28.5" y="27" width="7" height="23" rx="3.5" fill="#5ddd96" opacity="0.72" />
        <rect x="42" y="17" width="7" height="33" rx="3.5" fill="#5ddd96" />
      </svg>
      <span
        className={`font-serif tracking-[-0.01em] text-foreground ${
          size === "sm" ? "text-lg" : "text-xl"
        }`}
      >
        {SITE.name}
      </span>
    </span>
  );
}
