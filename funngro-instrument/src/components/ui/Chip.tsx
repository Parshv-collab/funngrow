"use client";

import type { ReactNode } from "react";

/**
 * A filter chip.
 *
 * A real <button> with `aria-pressed`, not a styled <span>, so it is focusable,
 * keyboard-operable and announces its own toggle state. `.chip` and
 * `.chip-active` live in globals.css inside `@layer components`, and these
 * class names are the reference that keeps them in the build.
 */
export default function Chip({
  children,
  active = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`chip ${active ? "chip-active" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
