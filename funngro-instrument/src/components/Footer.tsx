import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { COPYRIGHT, FOOTER_COLUMNS, LINKS, SITE } from "@/content/site";
import Wordmark from "./Wordmark";

/**
 * lucide-react ships a Twitter bird but no X brand mark — its `X` icon is the
 * close button. Rather than mislabel the bird as X, the X logo is drawn here.
 */
function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Funngro on Instagram", href: LINKS.instagram, Icon: Instagram },
  { label: "Funngro on LinkedIn", href: LINKS.linkedin, Icon: Linkedin },
  { label: "Funngro on X", href: LINKS.x, Icon: XLogo },
  { label: "Funngro on YouTube", href: LINKS.youtube, Icon: Youtube },
] as const;

/**
 * The system footer — identical on both routes.
 *
 * Sits in the same register as the rest of the page: mono labels, a status dot,
 * three link columns, and the legal entity spelled out. Each column is a
 * labelled <nav> with its own <h2>, so the link groups are announced as
 * navigation rather than read as an undifferentiated list of anchors.
 *
 * The bottom row is exactly "© 2026 orbit.dev" and nothing else, per the brief.
 */
export default function Footer() {
  return (
    <footer className="border-t border-frame-border bg-card/40">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* identity */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link
              href="/"
              className="inline-block rounded-md transition-opacity hover:opacity-85"
              aria-label="Funngro home"
            >
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-[28ch] font-serif text-lg italic text-prose-soft">
              {SITE.tagline}
            </p>
            <p className="mt-5 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-status-paid"
              />
              <span className="label-mono !text-[10px]">
                Paying · ₹13,69,832 this week
              </span>
            </p>
          </div>

          {/* link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="md:col-span-2"
            >
              <h2 className="label-mono">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-prose-soft transition-colors hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-prose-soft transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* socials */}
          <div className="md:col-span-1">
            <h2 className="label-mono">Follow</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-frame-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Per the brief: exactly this, and no other copyright line. */}
            <p className="label-mono">{COPYRIGHT}</p>
            <p className="label-mono !text-[10px]">
              {SITE.legalName} · {SITE.address.city}, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
