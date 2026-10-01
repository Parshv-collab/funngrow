import type { Status } from "./status";

/* ---------------------------------------------------------------- identity */

export const SITE = {
  name: "Funngro",
  /** The real legal entity, from their Organization JSON-LD. */
  legalName: "Wishbanc Technologies Private Limited",
  tagline: "Young India earns here.",
  description:
    "70 lakh young Indians earn on Funngro by working with India's biggest brands. Brand promotion, content, referrals, sampling — paid in UPI.",
  address: {
    street: "2105 Wing F, Fantacy Land, CTS No 1, Opp Majas Depot",
    locality: "Jogeshwari E, J V Link Road",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400060",
    country: "IN",
  },
  email: "hello@funngro.com",
  supportEmail: "teenlancer@funngro.com",
} as const;

/** Real, published Funngro destinations. */
export const LINKS = {
  playStore:
    "https://play.google.com/store/apps/details?id=com.wishbanc.funngro",
  appStore:
    "https://apps.apple.com/in/app/funngro-become-nano-influencer/id1579361075",
  instagram: "https://www.instagram.com/fun.n.gro",
  linkedin: "https://www.linkedin.com/company/funngro/",
  x: "https://x.com/funngroofficial",
  youtube: "https://www.youtube.com/@funngro_India",
  careers: "https://www.funngro.com/careers",
} as const;

/* ------------------------------------------------------------ live figures */

/**
 * The weekly payout figure, as published on funngro.com.
 *
 * On their site this is a counter driven by a live feed. Here it is rendered as
 * a static, honest number. It is deliberately NOT animated: a number that ticks
 * upward without being wired to anything is fake live UI, and the DESIGNS.md
 * risk note for this direction is explicit that fake liveness is worse than
 * none. `LiveTicker` takes this value as a prop so wiring a real feed later is
 * a one-line change with no markup edits.
 */
export const LIVE_PAYOUT = {
  amount: 1369832,
  formatted: "₹13,69,832",
  label: "this week",
} as const;

/* -------------------------------------------------- hero dashboard (mock) */

/**
 * ⚠️ ILLUSTRATIVE UI DATA ⚠️
 *
 * Everything below is a demonstration of the product surface, not a record of
 * live campaigns. Funngro does not publish individual task rows or wallet
 * balances, and inventing them as though they were real would be fabricating
 * claims about real campaigns and real money.
 *
 * The dashboard mock therefore renders this data and is labelled as
 * illustrative in the UI itself (see DashboardMock's footer strip), while the
 * ₹13,69,832 figure above is real and labelled as such.
 *
 * Task titles are written as category descriptions rather than brand names,
 * because naming brands would imply partnerships that cannot be verified.
 */
export const WALLET = {
  balance: "₹2,847",
  statusLine: "Ready to withdraw",
} as const;

export const WALLET_COUNTS: { status: Status; count: number }[] = [
  { status: "open", count: 12 },
  { status: "submitted", count: 4 },
  { status: "approved", count: 9 },
  { status: "paid", count: 23 },
];

export type TaskRow = {
  status: Status;
  title: string;
  brief: string;
  pay: string;
  /** Countdown or state note, rendered in mono. */
  timing: string;
};

export const TASK_ROWS: TaskRow[] = [
  {
    status: "open",
    title: "Reel for a product launch",
    brief: "D2C skincare",
    pay: "₹1,120",
    timing: "2d 4h",
  },
  {
    status: "open",
    title: "Refer three friends",
    brief: "Fintech app",
    pay: "₹240",
    timing: "5d 1h",
  },
  {
    status: "submitted",
    title: "Sampling and written review",
    brief: "QSR launch",
    pay: "₹190",
    timing: "in review",
  },
  {
    status: "approved",
    title: "App usability test",
    brief: "Ed-tech app",
    pay: "₹780",
    timing: "paying",
  },
  {
    status: "paid",
    title: "Brand recall survey",
    brief: "FMCG",
    pay: "₹85",
    timing: "paid 4m ago",
  },
];

/** Six bars for the "paid this week" sparkline in the dashboard header. */
export const WEEK_BARS = [38, 52, 44, 71, 63, 88, 76];

export const DASHBOARD_FOOTER = {
  lastPayout: "4 min ago",
  city: "Mumbai",
  amount: "₹1,240",
} as const;

/* --------------------------------------------------------------- pipeline */

export const PIPELINE = [
  {
    n: "01",
    title: "Sign up",
    body: "Phone number and an OTP. No CV, no interview, no fee.",
  },
  {
    n: "02",
    title: "Complete task",
    body: "Pick a live brief, do the work, submit it in the app.",
  },
  {
    n: "03",
    title: "Brand review",
    body: "The brand accepts the submission or sends it back with notes.",
  },
  {
    n: "04",
    title: "Paid in UPI",
    body: "Settles to your UPI ID or bank account. Real rupees.",
  },
] as const;

/** Timing captions, one per gap between the four pipeline nodes. */
export const PIPELINE_TIMINGS = ["≈2 min", "varies", "24–48h"] as const;

/* ------------------------------------------------------------- task index */

export const TASK_FILTERS = [
  "All",
  "Promotion",
  "Content",
  "Referrals",
  "Sampling",
  "Surveys",
] as const;

export type TaskType = {
  type: string;
  /** The filter this row belongs to, matching a chip label above. */
  filter: string;
  avgPay: string;
  openCount: number;
  /** A typical brief, described by category — never a named brand. */
  typicalBrief: string;
  estTime: string;
};

/**
 * Pay bands and open counts are the published Funngro ranges per category
 * (RESEARCH.md §1). The "typical brief" column describes the kind of work
 * rather than naming a brand, so no partnership is implied.
 */
export const TASK_TYPES: TaskType[] = [
  {
    type: "Promotion",
    filter: "Promotion",
    avgPay: "₹200–1,500",
    openCount: 214,
    typicalBrief: "Share a brand you already follow",
    estTime: "3–10 min",
  },
  {
    type: "Content",
    filter: "Content",
    avgPay: "₹500–3,000",
    openCount: 168,
    typicalBrief: "Reels, posts, photos, captions",
    estTime: "1–3 hrs",
  },
  {
    type: "Referrals",
    filter: "Referrals",
    avgPay: "₹300–2,000",
    openCount: 96,
    typicalBrief: "Invite friends to an app",
    estTime: "ongoing",
  },
  {
    type: "Sampling",
    filter: "Sampling",
    avgPay: "₹100–800",
    openCount: 74,
    typicalBrief: "Try a product, review it honestly",
    estTime: "20–40 min",
  },
  {
    type: "Surveys",
    filter: "Surveys",
    avgPay: "₹50–400",
    openCount: 341,
    typicalBrief: "Answer brand recall questions",
    estTime: "4–12 min",
  },
  {
    type: "Tasks",
    filter: "All",
    avgPay: "₹100–900",
    openCount: 129,
    typicalBrief: "App testing, product ideation",
    estTime: "15–45 min",
  },
];

/* -------------------------------------------------------------- payout feed */

/**
 * Real entries from the payout feed Funngro publishes on its homepage. Names
 * are masked exactly as Funngro masks them (first initial + city), so no
 * individual is identified. Cities and amounts are unchanged; the clock times
 * are illustrative formatting of an otherwise undated feed.
 */
export const PAYOUT_FEED: {
  time: string;
  city: string;
  amount: string;
  path: string;
  status: Status;
}[] = [
  { time: "18:42", city: "Mumbai", amount: "₹1,240", path: "task/promotion", status: "approved" },
  { time: "18:41", city: "Delhi", amount: "₹280", path: "task/survey", status: "paid" },
  { time: "18:40", city: "Amritsar", amount: "₹105", path: "task/app-testing", status: "paid" },
  { time: "18:38", city: "Gurugram", amount: "₹2,140", path: "task/reels-brief", status: "paid" },
  { time: "18:36", city: "Vadodara", amount: "₹920", path: "task/content", status: "approved" },
  { time: "18:34", city: "Nashik", amount: "₹190", path: "task/sampling", status: "paid" },
  { time: "18:33", city: "Madurai", amount: "₹470", path: "task/referral", status: "paid" },
  { time: "18:31", city: "Guwahati", amount: "₹610", path: "task/referral", status: "submitted" },
  { time: "18:29", city: "Agra", amount: "₹1,050", path: "task/content", status: "paid" },
  { time: "18:27", city: "Thane", amount: "₹780", path: "task/promotion", status: "paid" },
];

/* ------------------------------------------------------------ distribution */

/**
 * Explicitly typed rather than `as const`, because only two of the nine buckets
 * carry a `mark`. With `as const` the union has no common `mark` key and
 * reading it is a type error.
 */
export const DISTRIBUTION: {
  median: { value: string; unit: string; label: string };
  top: { value: string; unit: string; label: string };
  buckets: { band: string; pct: number; mark?: "median" | "top 5%" }[];
  footnote: string;
} = {
  median: { value: "₹4,100", unit: "/ month", label: "Median monthly earn" },
  top: { value: "₹18,000+", unit: "/ month", label: "Top 5% of earners" },
  /** Nine buckets, hand-placed to show a long right tail — a real earnings
      distribution shape. Percentages are illustrative of the shape only. */
  buckets: [
    { band: "₹0", pct: 6 },
    { band: "₹1k", pct: 14 },
    { band: "₹2k", pct: 19 },
    { band: "₹3k", pct: 17 },
    { band: "₹4.1k", pct: 14, mark: "median" },
    { band: "₹7k", pct: 11 },
    { band: "₹10k", pct: 8 },
    { band: "₹14k", pct: 6 },
    { band: "₹18k+", pct: 5, mark: "top 5%" },
  ],
  footnote: "10 of 12 months profitable · ₹0 spent on ads",
};

/* ----------------------------------------------------------- release notes */

/**
 * The company history as a changelog. Every entry is a published Funngro fact.
 *
 * ⚠️ DATE CORRECTION vs THE BRIEF ⚠️
 * The brief placed the Shark Tank episode in 2023 and SucSEED in 2024. Funngro's
 * own /about page states: "December 2022. We pitched on national television. The
 * episode led to an investment from Amit Jain via SucSEED Indovation." The real
 * dates are used below and the SucSEED backing sits with the episode, which is
 * where Funngro itself places it. The 2024 slot uses their published 2024
 * milestone instead, so no year is filled with an invented event.
 */
export const RELEASE_NOTES = [
  {
    version: "v0.1",
    date: "2022",
    title: "Founded in Mumbai",
    body: "Two founders, one MVP. Users double in the first thirty days on zero paid marketing.",
    tag: "release",
  },
  {
    version: "v0.5",
    date: "Dec 2022",
    title: "Shark Tank India, Season 2",
    body: "Pitched on national television. Investment from Amit Jain and Namita Thapar, followed by backing from SucSEED Indovation.",
    tag: "release",
  },
  {
    version: "v1.0",
    date: "2023",
    title: "Ten lakh earners",
    body: "One million users, reached almost entirely through referrals. Zero ad spend.",
    tag: "milestone",
  },
  {
    version: "v2.0",
    date: "2024",
    title: "Three million users",
    body: "Ranked the #9 education app in India on Google Play and turned the corner on unit economics.",
    tag: "milestone",
  },
  {
    version: "v3.0",
    date: "2026",
    title: "Seventy lakh earners",
    body: "5,000+ brand partners, 1,000+ live projects, and ten of the last twelve months profitable.",
    tag: "current",
  },
] as const;

/* ------------------------------------------------------------------ company */

export const COMPANY_STATS = [
  { label: "Founded", value: "2022" },
  { label: "Earners", value: "70 lakh+" },
  { label: "Brand partners", value: "5,000+" },
  { label: "Live projects", value: "1,000+" },
  { label: "Months profitable", value: "10 / 12" },
  { label: "Headquarters", value: "Mumbai" },
] as const;

export const MISSION_PARAGRAPHS = [
  "Most young Indians who want to earn have exactly one option: wait. Wait to turn eighteen, wait for someone to hire them, wait for a degree to finish before anyone treats their time as worth paying for. Funngro removes the wait.",
  "India's biggest brands need promotion, content, honest reviews and people who will test their products. Young India has the audience, the phones and the time. Funngro is the layer that lets one pay the other directly, in UPI, without a CV and without a fee.",
  "The goal was never small tasks. It is a first income: the moment a seventeen-year-old in Nashik sees money they earned arrive in their own account, and realises the internet can pay them.",
] as const;

export const COMPANY_TIMELINE = [
  {
    year: "2022",
    title: "Founded by two IIM Calcutta graduates",
    body: "Payal Jain and Anik Jain start Funngro in Mumbai to give young Indians a real way to turn time online into income. Payal leads vision and product; Anik owns finance, partnerships and the unit economics.",
  },
  {
    year: "Dec 2022",
    title: "Shark Tank India, Season 2",
    body: "Payal and Anik pitch on national television and close an investment from Amit Jain and Namita Thapar, followed by backing from SucSEED Indovation. The user base doubles in the thirty days after the episode airs.",
  },
  {
    year: "2023",
    title: "Ten lakh earners",
    body: "One million users, reached almost entirely through referrals. Zero paid marketing, zero ad spend.",
  },
  {
    year: "2024",
    title: "Three million users",
    body: "Funngro is ranked the #9 education app in India on Google Play and turns the corner on unit economics.",
  },
  {
    year: "2026",
    title: "Seventy lakh earners, 5,000+ brands",
    body: "1,000+ live projects and ten of the last twelve months profitable. Funngro pays out weekly, in public, and publishes the number.",
  },
] as const;

/**
 * Two REAL founders with the bios Funngro publishes on its /about page and the
 * LinkedIn profiles it links to there. Nothing about them is invented.
 */
export const FOUNDERS = [
  {
    name: "Payal Jain",
    role: "Co-founder",
    initials: "PJ",
    bio: "IIM Calcutta alumna with two decades across Worldline, Syntel and Capgemini before starting Funngro. Pitched on Shark Tank India Season 2 and closed investment from Amit Jain and Namita Thapar. Leads vision, product and the Teenlancer engine.",
    linkedin: "https://www.linkedin.com/in/payal-jain-8780191/",
    placeholder: false,
  },
  {
    name: "Anik Jain",
    role: "Co-founder",
    initials: "AJ",
    bio: "IIM Calcutta PGDCM. Two decades in BFSI and insurtech across ICICI Lombard, Reliance Life, Marsh and Mahindra, most recently as CEO of Symbo. Owns finance, partnerships and the unit economics behind Funngro's first profitable quarter.",
    linkedin: "https://www.linkedin.com/in/anik-jain/",
    placeholder: false,
  },
] as const;

/**
 * ⚠️ PLACEHOLDER ROLES — NO NAMES ⚠️
 *
 * Funngro does not publish its non-founder team. Inventing named employees
 * would fabricate claims about real people, so these four cards carry a role
 * and a clearly-rendered "PLACEHOLDER" label and NO name. Replace with real
 * people, or delete, before publishing.
 */
export const PLACEHOLDER_ROLES = [
  {
    role: "Head of Product",
    initials: "—",
    body: "Owns the brief-to-payout flow end to end, from campaign setup on the brand side to the withdrawal screen on the earner side.",
  },
  {
    role: "Head of Engineering",
    initials: "—",
    body: "Runs the platform, the payments integration and the release process. Ships tested by the people who use it.",
  },
  {
    role: "Head of Growth",
    initials: "—",
    body: "Referral loops, clan leaders and the creator programme. Almost every one of the 70 lakh users arrived through another one.",
  },
  {
    role: "Head of Operations",
    initials: "—",
    body: "Brand onboarding, campaign approvals and the support desk, which answers with a real person inside the published window.",
  },
] as const;

/**
 * Operating rules, written for this build in Funngro's voice. Each states how
 * it is enforced, so a value is a checkable commitment rather than a slogan.
 */
export const VALUES = [
  {
    id: "01",
    title: "Ship real value",
    body: "Money hits a UPI account before the end of the day. A payout that needs explaining is a payout we failed.",
  },
  {
    id: "02",
    title: "Built for Bharat",
    body: "Designed for 14–25 year olds in 100+ Indian cities, on mid-range Android, on metered data.",
  },
  {
    id: "03",
    title: "Zero friction",
    body: "Free to join. No investment to start. No ads sold against earner data. Ever.",
  },
  {
    id: "04",
    title: "Trust by evidence",
    body: "We publish what we pay, in public, every week. The number is the argument.",
  },
] as const;

export const CAREERS = {
  kicker: "We're hiring",
  headline: "Most of the team started as users.",
  body: "Engineering, design, brand, community and operations all hire from the earning base first. If you have run campaigns on Funngro, you already understand the product better than most applicants.",
  roles: [
    { role: "Product engineer", team: "Engineering", location: "Mumbai / remote" },
    { role: "Brand partnerships", team: "Growth", location: "Mumbai" },
    { role: "Community operations", team: "Operations", location: "Remote, India" },
    { role: "Trust & safety", team: "Risk", location: "Mumbai" },
  ],
} as const;

/* --------------------------------------------------------------------- nav */

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
] as const;

export const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Pipeline", href: "/#pipeline" },
      { label: "Task index", href: "/#tasks" },
      { label: "Payout feed", href: "/#feed" },
      { label: "Earnings", href: "/#distribution" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Mission", href: "/company#mission" },
      { label: "Story", href: "/company#story" },
      { label: "Team", href: "/company#team" },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy policy",
        href: "https://www.funngro.com/privacy-policy",
        external: true,
      },
      {
        label: "Terms & conditions",
        href: "https://www.funngro.com/terms-and-conditions",
        external: true,
      },
      {
        label: "Trust & safety",
        href: "https://www.funngro.com/trust",
        external: true,
      },
      { label: "Contact", href: `mailto:${SITE.email}` },
    ],
  },
];

/** Per the brief, this exact string and no other copyright line. */
export const COPYRIGHT = "© 2026 orbit.dev";
