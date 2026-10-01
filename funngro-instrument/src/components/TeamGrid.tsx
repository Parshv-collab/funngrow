import { Linkedin } from "lucide-react";
import { FOUNDERS, PLACEHOLDER_ROLES } from "@/content/site";
import Kicker from "./ui/Kicker";

/**
 * Team.
 *
 * ⚠️ READ BEFORE PUBLISHING ⚠️
 * The first two cards are REAL. Payal Jain and Anik Jain are Funngro's
 * co-founders, and their role, bio and LinkedIn URL are exactly what Funngro
 * publishes on its own /about page.
 *
 * The other four are PLACEHOLDER ROLES WITH NO NAMES. Funngro does not publish
 * its non-founder team, so inventing named employees would fabricate claims
 * about real people. Each card therefore carries a role, a one-line scope, an
 * em-dash avatar, and a visible "PLACEHOLDER" label in mono — the label is in
 * the UI, not just in a code comment, so it cannot be mistaken for real staff.
 * Replace or delete before this goes anywhere public.
 *
 * LAYOUT: six cards in a single horizontal row at xl, degrading to three, two
 * and one as the viewport narrows. All six stayed in the row because the
 * founder cards' real bios are short enough to survive a 186px column at a
 * 13px size — checked in the 1280px screenshot rather than assumed.
 */
export default function TeamGrid() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>The team</Kicker>
            <h2 id="team-heading" className="type-section mt-4 text-foreground">
              <span className="block">Small team.</span>
              <span className="emphasis block">Unusually close to the work.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            Most of what would be outsourced elsewhere — support, QA, content,
            community — is done by young Indians who started as earners.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* ------------------------------------------------ real founders */}
          {FOUNDERS.map((person) => (
            <article
              key={person.name}
              className="panel flex h-full flex-col p-5"
            >
              <span
                role="img"
                aria-label={`Initials ${person.initials}`}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10 font-serif text-lg text-accent"
              >
                {person.initials}
              </span>

              <h3 className="mt-4 font-serif text-xl leading-tight text-foreground">
                {person.name}
              </h3>
              <p className="label-mono mt-1.5">{person.role}</p>

              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {person.bio}
              </p>

              <p className="mt-auto pt-4">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-foreground"
                >
                  <Linkedin size={12} aria-hidden="true" />
                  LinkedIn
                </a>
              </p>
            </article>
          ))}

          {/* --------------------------------------------- placeholder roles */}
          {PLACEHOLDER_ROLES.map((role) => (
            <article
              key={role.role}
              className="panel flex h-full flex-col border-dashed p-5"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-frame-border font-serif text-lg text-muted-foreground"
              >
                {role.initials}
              </span>

              {/* The label is in the UI, not hidden in a comment. */}
              <p className="mt-4">
                <span className="inline-flex items-center rounded-chip border border-status-submitted/40 bg-status-submitted/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-status-submitted">
                  Placeholder
                </span>
              </p>

              <h3 className="mt-3 font-serif text-lg leading-tight text-foreground">
                {role.role}
              </h3>

              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {role.body}
              </p>
            </article>
          ))}
        </div>

        <p className="label-mono mt-6 !text-[10px]">
          Co-founders as published by Funngro · amber cards are placeholder
          roles with no names attached
        </p>
      </div>
    </section>
  );
}
