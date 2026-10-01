/**
 * The status system.
 *
 * This is the one thing this design adds to the brand. On the live Funngro site
 * green and mint carry every meaning simultaneously — accent, link, button,
 * positive signal — so nothing can signal anything. Five functional states make
 * a dashboard grammar possible without abandoning the palette.
 *
 * RULES OBEYED HERE
 *  - Status colour is used ONLY on state indicators: chips, pills and pipeline
 *    nodes. Never on decoration, never on a heading, never on a button.
 *  - Colour is never the only signal. Every pill renders a dot AND the state
 *    name, so the meaning survives greyscale and colour-vision deficiency.
 *  - Classes are written out in full below rather than composed at runtime.
 *    Tailwind scans source text, so a template literal like
 *    `text-status-${state}` would be silently dropped from the build.
 */

export type Status = "open" | "submitted" | "approved" | "paid" | "rejected";

export type StatusMeta = {
  label: string;
  /** What the state means, for the tooltip and for screen readers. */
  meaning: string;
  hex: string;
  /** Full class strings — never composed. */
  pill: string;
  dot: string;
  node: string;
};

export const STATUS: Record<Status, StatusMeta> = {
  open: {
    label: "Open",
    meaning: "Brief is live and accepting submissions",
    hex: "#5ddd96",
    pill: "text-status-open border-status-open/35 bg-status-open/10",
    dot: "bg-status-open",
    node: "border-status-open/45 bg-status-open/10 text-status-open",
  },
  submitted: {
    label: "Submitted",
    meaning: "Work sent to the brand, awaiting review",
    hex: "#e8c547",
    pill: "text-status-submitted border-status-submitted/35 bg-status-submitted/10",
    dot: "bg-status-submitted",
    node: "border-status-submitted/45 bg-status-submitted/10 text-status-submitted",
  },
  approved: {
    label: "Approved",
    meaning: "Brand approved the work, payout is queued",
    hex: "#5b9cff",
    pill: "text-status-approved border-status-approved/35 bg-status-approved/10",
    dot: "bg-status-approved",
    node: "border-status-approved/45 bg-status-approved/10 text-status-approved",
  },
  paid: {
    label: "Paid",
    meaning: "Settled to UPI or bank",
    hex: "#07ab5f",
    pill: "text-status-paid border-status-paid/35 bg-status-paid/10",
    dot: "bg-status-paid",
    node: "border-status-paid/45 bg-status-paid/10 text-status-paid",
  },
  rejected: {
    label: "Rejected",
    meaning: "Brand did not accept the submission",
    hex: "#e5573c",
    pill: "text-status-rejected border-status-rejected/35 bg-status-rejected/10",
    dot: "bg-status-rejected",
    node: "border-status-rejected/45 bg-status-rejected/10 text-status-rejected",
  },
};

export const STATUS_ORDER: Status[] = [
  "open",
  "submitted",
  "approved",
  "paid",
  "rejected",
];
