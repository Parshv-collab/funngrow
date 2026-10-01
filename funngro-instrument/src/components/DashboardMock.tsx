import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  DASHBOARD_FOOTER,
  LIVE_PAYOUT,
  TASK_ROWS,
  WALLET,
  WALLET_COUNTS,
  WEEK_BARS,
} from "@/content/site";
import StatusPill from "./ui/StatusPill";

/**
 * The hero's right panel: a working dashboard, built entirely out of DOM.
 *
 * This is the component that carries the whole direction. Funngro's live site
 * pairs its headline with a raster screenshot of a phone. This pairs the
 * headline with living state — statuses, a wallet balance, a real <table> of
 * tasks with countdowns, a bar chart and a last-payout strip. It is not an
 * image, not an SVG illustration of a UI, and not a phone frame.
 *
 * HONESTY
 *  The task rows, wallet balance and bar chart are illustrative product data —
 *  Funngro does not publish individual task records, and inventing them as
 *  though they were real would fabricate claims about real campaigns. The panel
 *  says so in its own footer strip, and the ₹13,69,832 figure alongside it is a
 *  genuinely published number. See src/content/site.ts.
 *
 * NO LAYOUT SHIFT
 *  Every element has a fixed or content-independent box: the chart has an
 *  explicit height, the table rows have a min height, and nothing is
 *  asynchronously injected. The panel cannot reflow after paint.
 */
export default function DashboardMock() {
  const maxBar = Math.max(...WEEK_BARS);

  return (
    <div className="panel overflow-hidden">
      {/* ----------------------------------------------------- wallet header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div>
          <p className="label-mono">Your wallet</p>
          <p className="type-figure mt-1.5 text-foreground">
            {WALLET.balance}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
            <span className="text-xs text-muted-foreground">
              {WALLET.statusLine}
            </span>
          </p>
        </div>

        {/* A real button, not a styled div. */}
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-frame-border bg-background/60 px-3.5 py-2 text-[12px] font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
        >
          Withdraw to UPI
          <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </div>

      {/* ------------------------------------------------------ status counts */}
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {WALLET_COUNTS.map(({ status, count }) => (
            <StatusPill key={status} status={status} count={count} />
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- task table */}
      <div className="px-4 pt-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label-mono">Open tasks</p>
          <span className="label-mono flex items-center gap-1 !text-[10px]">
            This week
            <ChevronDown size={11} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="table-scroll mt-2">
        <table className="data-table">
          <caption className="sr-only">
            Illustrative list of Funngro tasks with their payout status, reward
            and remaining time.
          </caption>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Task</th>
              <th scope="col" className="!text-right">
                Pay
              </th>
              <th scope="col" className="col-collapse !text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {TASK_ROWS.map((row) => (
              <tr key={row.title}>
                <td className="!py-3 !pl-4 !pr-2 sm:!pl-5">
                  <StatusPill status={row.status} />
                </td>
                <td className="!px-2 !py-3">
                  <span className="block text-[13px] font-semibold leading-snug text-foreground">
                    {row.title}
                  </span>
                  <span className="label-mono mt-1 hidden !text-[10px] sm:block">
                    {row.brief}
                  </span>
                </td>
                <td className="!px-2 !py-3 text-right">
                  <span className="num tabular font-semibold text-foreground">
                    {row.pay}
                  </span>
                </td>
                <td className="col-collapse !py-3 !pl-2 !pr-4 text-right sm:!pr-5">
                  <span className="num tabular text-[12px] text-muted-foreground">
                    {row.timing}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------ paid this week */}
      <div className="mt-1 border-t border-border px-4 py-4 sm:px-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="label-mono">Paid this week</p>

            {/* Bar chart from divs — no SVG, no canvas, no image. */}
            <div
              className="mt-3 flex h-9 items-end gap-1.5"
              role="img"
              aria-label={`Paid this week: ${LIVE_PAYOUT.formatted}`}
            >
              {WEEK_BARS.map((v, i) => (
                <span
                  key={i}
                  className={`w-full rounded-sm ${
                    i === WEEK_BARS.length - 1 ? "bg-accent" : "bg-status-paid/35"
                  }`}
                  style={{ height: `${Math.round((v / maxBar) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          <p className="type-figure shrink-0 text-accent">
            {LIVE_PAYOUT.formatted}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------- footer strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background/50 px-4 py-2.5 sm:px-5">
        <p className="num tabular flex items-center gap-2 !text-[11px] text-muted-foreground">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-status-paid"
          />
          Last payout {DASHBOARD_FOOTER.lastPayout} · {DASHBOARD_FOOTER.city} ·{" "}
          {DASHBOARD_FOOTER.amount}
        </p>
        {/* The honesty label. Illustrative product data is labelled as such. */}
        <p className="label-mono !text-[10px]">Illustrative dashboard</p>
      </div>
    </div>
  );
}
