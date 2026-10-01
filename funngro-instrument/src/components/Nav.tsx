"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LINKS, LIVE_PAYOUT, NAV_LINKS } from "@/content/site";
import Wordmark from "./Wordmark";
import LiveTicker from "./LiveTicker";
import Button from "./ui/Button";

/**
 * Sticky navigation.
 *
 * Deliberately different from the current Funngro bar, which carries seven links
 * plus a language switcher plus a download button. This one has two
 * destinations, a live payout readout and a single primary action.
 *
 * The ticker is the point: the number Funngro is most proud of sits permanently
 * in the chrome, so every scroll position has proof in view. It appears at `lg`
 * and above — below that, the space belongs to the CTA and the menu.
 *
 * ACCESSIBILITY
 *  - "Skip to content" is the first focusable element on the page.
 *  - The toggle carries aria-expanded / aria-controls, Escape closes it, and
 *    the panel closes on route change.
 *  - Focus rings come from the global :focus-visible rule.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-frame-border bg-background/90 backdrop-blur-xl">
        <nav
          aria-label="Primary"
          className="shell flex h-16 items-center justify-between gap-3"
        >
          <Link
            href="/"
            className="shrink-0 rounded-md transition-opacity hover:opacity-85"
            aria-label="Funngro home"
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LiveTicker
              value={LIVE_PAYOUT.formatted}
              label={LIVE_PAYOUT.label}
              className="hidden lg:inline-flex"
            />

            <Button
              href={LINKS.playStore}
              external
              withArrow
              className="hidden !px-5 !py-2.5 !text-[13px] sm:inline-flex"
              ariaLabel="Download the Funngro app from Google Play"
            >
              Download app
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-frame-border text-foreground transition-colors hover:border-accent/50 hover:text-accent md:hidden"
            >
              {open ? (
                <X size={18} aria-hidden="true" />
              ) : (
                <Menu size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          hidden={!open}
          className="border-t border-frame-border bg-background md:hidden"
        >
          <ul className="shell flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex min-h-[52px] items-center border-b border-border py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-3 pt-4">
              <LiveTicker
                value={LIVE_PAYOUT.formatted}
                label={LIVE_PAYOUT.label}
                className="self-start"
              />
              <Button
                href={LINKS.playStore}
                external
                withArrow
                className="w-full"
              >
                Download app
              </Button>
            </li>
          </ul>
          <div className="h-4" />
        </div>
      </header>
    </>
  );
}
