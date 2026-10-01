"use client";

import { useMemo, useState } from "react";
import { TASK_FILTERS, TASK_TYPES } from "@/content/site";
import Kicker from "./ui/Kicker";
import Chip from "./ui/Chip";

/**
 * The task index — a filterable data table, not a card grid.
 *
 * This is the section that replaces the six feature cards the live site uses.
 * There are no rounded cards here: a real <table>, with a real mono header row,
 * hover states and a chip filter bar above it.
 *
 * The filter is genuinely functional. The spec allowed a visual-only toggle,
 * but a chip that changes colour and nothing else is a lie about interactivity,
 * so the rows actually filter and the result count updates with them.
 *
 * ON LAYOUT SHIFT: narrowing the filter does shorten the panel. That reflow is
 * excluded from Cumulative Layout Shift by definition, because it is the direct
 * result of a user interaction inside the same frame — CLS only counts shifts a
 * user did not ask for. Pinning a min-height here would trade a non-issue for a
 * panel with a permanent hole in it.
 *
 * The "Typical brief" column describes the kind of work rather than naming a
 * brand — naming brands would imply partnerships that cannot be verified.
 */
export default function TaskIndex() {
  const [active, setActive] = useState<string>("All");

  const rows = useMemo(
    () =>
      active === "All"
        ? TASK_TYPES
        : TASK_TYPES.filter((t) => t.filter === active),
    [active],
  );

  return (
    <section id="tasks" aria-labelledby="tasks-heading" className="section border-b border-frame-border">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>Task index</Kicker>
            <h2 id="tasks-heading" className="type-section mt-4 text-foreground">
              <span className="block">Every kind of work,</span>
              <span className="emphasis block">with the rate on it.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Pay bands are Funngro&rsquo;s published ranges per category. Open
            counts move as briefs are posted and filled.
          </p>
        </div>

        {/* --------------------------------------------------------- filters */}
        <div
          className="mt-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter task types"
        >
          {TASK_FILTERS.map((f) => (
            <Chip
              key={f}
              active={active === f}
              onClick={() => setActive(f)}
            >
              {f}
            </Chip>
          ))}
          <span className="label-mono ml-1 !text-[10px]" aria-live="polite">
            {rows.length} {rows.length === 1 ? "type" : "types"}
          </span>
        </div>

        {/* ----------------------------------------------------------- table */}
        <div className="panel mt-4 overflow-hidden">
          <div className="table-scroll">
            <table className="data-table">
              <caption className="sr-only">
                Funngro task categories with average pay, number of open briefs,
                a typical brief and estimated completion time.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col" className="!text-right">
                    Avg pay
                  </th>
                  <th scope="col" className="!text-right">
                    Open
                  </th>
                  <th scope="col" className="col-collapse">
                    Typical brief
                  </th>
                  <th scope="col" className="col-collapse !text-right">
                    Est. time
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.type}>
                    <td className="!pl-4 font-semibold text-foreground sm:!pl-5">
                      {row.type}
                    </td>
                    <td className="text-right">
                      <span className="num tabular text-accent">
                        {row.avgPay}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="num tabular text-foreground">
                        {row.openCount}
                      </span>
                    </td>
                    <td className="col-collapse text-muted-foreground">
                      {row.typicalBrief}
                    </td>
                    <td className="col-collapse text-right">
                      <span className="num tabular text-[12px] text-muted-foreground">
                        {row.estTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No live briefs in this category right now.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background/50 px-4 py-2.5 sm:px-5">
            <p className="label-mono !text-[10px]">
              Avg pay is the published band, not a guarantee
            </p>
            <p className="label-mono !text-[10px]">
              {active === "All" ? "All categories" : active}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
