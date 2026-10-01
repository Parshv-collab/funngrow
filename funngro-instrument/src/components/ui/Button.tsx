import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

/**
 * Button.
 *
 * `.pill-primary` is a brand constant: Funngro's pill grows by 14px on the
 * right while the circular arrow chip slides to meet it. That lives in
 * globals.css as a `padding-right` transition, because Tailwind cannot express
 * a hover padding change that the arrow follows.
 *
 * Those classes are declared inside `@layer components`, and Tailwind only
 * emits layer rules it can find referenced in the `content` glob; an
 * unreferenced component class is dropped from the build silently. The class
 * names below are therefore the reference that keeps them alive.
 */
const base =
  "inline-flex items-center justify-center gap-2.5 rounded-pill transition-all duration-200 ease-brand disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "pill-primary",
  outline: "pill-outline",
  ghost: "text-muted-foreground hover:text-accent",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  withArrow = false,
  external,
  type = "button",
  onClick,
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Renders the circular arrow chip that slides right on hover. */
  withArrow?: boolean;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const classes = `${base} ${variants[variant]} ${withArrow ? "group" : ""} ${className}`;

  const label = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <span
          aria-hidden="true"
          className="circ transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
        >
          →
        </span>
      ) : null}
    </>
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {label}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
