import { ArrowUpRight } from "lucide-react";
import { CAREERS, LINKS } from "@/content/site";

/**
 * Careers teaser — a full-width band.
 *
 * Funngro's real hiring position is unusually specific and worth keeping close
 * to verbatim: most of the team started as Funngro users, and hiring is weighted
 * toward people who already ran campaigns on the platform. That is a genuinely
 * differentiated pitch, so the band leads with it instead of with a rocket ship.
 *
 * The four roles are rendered as a real table, keeping the page's data-surface
 * grammar to the end. They are illustrative openings — this build has no
 * careers API — and the band says so.
 *
 * The brief allows two pages, so there is no /careers route to link to. The
 * action points at Funngro's real, live careers page instead of at a dead
 * anchor. On a production build that href becomes /careers and nothing else
 * changes.
 */
export default function CareersTeaser() {
  return (
    <section
      id="careers"
      aria-labelledby="careers-heading"
      className="section border-b border-frame-border"
    >
      <div className="shell">
        <div className="panel overflow-hidden">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <p className="kicker !text-accent">{CAREERS.kicker}</p>
              <h2
                id="careers-heading"
                className="type-section mt-4 text-foreground"
              >
                <span className="block">Most of the team</span>
                <span className="emphasis block">started as users.</span>
              </h2>
              <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                {CAREERS.body}
              </p>
              <p className="mt-7">
                <a
                  href={LINKS.careers}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-foreground"
                >
                  See open roles
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </p>
            </div>

            {/* open roles as a table, keeping the page's grammar to the end */}
            <div className="lg:col-span-6">
              <div className="table-scroll rounded-panel border border-frame-border">
                <table className="data-table">
                  <caption className="sr-only">
                    Illustrative open roles at Funngro.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Role</th>
                      <th scope="col" className="col-collapse">
                        Team
                      </th>
                      <th scope="col" className="!text-right">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAREERS.roles.map((r) => (
                      <tr key={r.role}>
                        <td className="!pl-4 font-semibold text-foreground sm:!pl-5">
                          {r.role}
                        </td>
                        <td className="col-collapse text-muted-foreground">
                          {r.team}
                        </td>
                        <td className="!pr-4 text-right sm:!pr-5">
                          <span className="num tabular !text-[12px] text-muted-foreground">
                            {r.location}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="label-mono mt-3 !text-[10px]">
                Illustrative roles · engineering, design, brand, ops and trust
                &amp; safety
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
