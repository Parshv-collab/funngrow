# Funngro — Design 2, "The Instrument Panel"

A rebuild of the Funngro marketing site as **Design 2** from `DESIGNS.md`: a
two-page Next.js site where the product's own grammar *is* the page. Task rows
carry real statuses, the pipeline shows real timings, payouts land in a terminal,
earnings are shown as a distribution rather than an average, and the Shark Tank
appearance is told as a changelog.

This is deliberately **not** a restyle of the live site. It keeps Funngro's brand
constants — the dark field, the self-hosted Instrument Serif / Work Sans /
JetBrains Mono, the mint pill with the sliding arrow chip, the four-line
roman→italic-mint headline — and rebuilds everything else from scratch.

- Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react
- Two routes: `/` and `/company`. Nothing else.
- No component library, no analytics, no cookie banner.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run typecheck # tsc --noEmit
```

Deployed at **https://funngro-revamp-fria.onrender.com**. One optional environment variable:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origin for canonicals, OG URLs, sitemap and JSON-LD | `https://funngro-revamp-fria.onrender.com` |

It lives in `src/lib/seo.ts` and is the single source for every absolute URL the
app renders — canonicals, Open Graph and Twitter image URLs, and all four
JSON-LD graphs move together when it is set.

Two files are the exception: `public/robots.txt` and `public/sitemap.xml` are
served statically and cannot read an environment variable, so they are
hardcoded to the deployed origin and must be edited by hand if the site moves.
Keeping those three files in agreement is the whole job — the live Funngro site
gets it wrong, advertising `www.funngro.com` in `robots.txt` and
`sitemap.xml` while the app emits `https://funngro.com` canonicals, and that
non-www host 302s to www, so every canonical points at a redirect.

---

## What's in it

### Home (`/`)

| Section | What it is |
| --- | --- |
| Sticky nav | Wordmark, two links, a payout readout, one primary CTA |
| Hero | 5/12 headline panel + 7/12 **dashboard** panel |
| Payout pipeline | Four nodes with real timings between them |
| Task index | A filterable `<table>`, not a card grid |
| Payout feed | A terminal, `payouts.log`, with a blinking caret |
| Distribution | Median vs top 5%, drawn as a bar chart |
| Release notes | Shark Tank told as a versioned changelog |
| Footer | Legal links and `© 2026 orbit.dev` |

The dashboard in the hero is real DOM — a real `<table>`, real `<button>`s, real
`<span>` status chips with `aria-pressed` state. Nothing about it is an image or
an SVG illustration. It carries no headings, because it is a product surface,
not document structure.

### Company (`/company`)

Pure typography hero (no dashboard), mission, an alternating five-milestone
timeline, a six-card team row, a 2×2 values grid and a careers band. Same nav,
same footer.

---

## Content provenance

Every figure on the site is either published by Funngro or is labelled as
illustrative **in the interface itself**, not just in this file.

**Real, taken from the live site:**

- 70 lakh+ earners, 5,000+ brands, 1,000+ live projects
- ₹13,69,832 paid this week · ₹4,100/mo median · ₹18,000+ top 5%
- ★4.2 Play Store rating · 10 of 12 months profitable · founded 2022
- The masked payout rows in the feed (Gurugram ₹2,140, Amritsar ₹105, …) are
  Funngro's own published feed entries, names masked the way Funngro masks them
- Founders **Payal Jain** and **Anik Jain**, both IIM Calcutta, with their
  LinkedIn profiles
- Legal entity: Wishbanc Technologies Private Limited, Mumbai

**Illustrative, and labelled as such on screen:**

- The five dashboard task rows. The panel is captioned "Illustrative
  dashboard" in the UI. Task titles describe *categories* and never name a
  brand — naming one would imply a partnership that cannot be verified.
- The wallet balance (₹2,847) and the count pills, which are a snapshot shape,
  not a live query.

**Marked placeholder:**

- Four of the six team cards are role placeholders (Head of Product, Head of
  Engineering, Head of Growth, Head of Operations). They carry a visible amber
  "Placeholder" chip, an em-dash avatar and **no invented names**.

### One correction to the brief

The brief dates the Shark Tank India S2 episode to 2023 and the SucSEED
Inovation backing to 2024. Funngro's own `/about` page says *"December 2022. We
pitched on national television"*, with the investment from Amit Jain via
SucSEED Inovation. The site uses **December 2022** for both and fills the 2024
slot with Funngro's real 2024 milestone instead, so no year is occupied by an
invented event.

---

## Wiring the ticker

`LiveTicker` is **deliberately not animated**.

The obvious move is to make the number count up. This build has no connection to
Funngro's payout feed, so any movement would be invented — and fake liveness is
worse than an honest static number, because a number that ticks is a claim that
something is ticking. The component renders the published figure and holds still.

It takes the value as a prop, so a real subscription is a change to the caller
and nothing inside the component:

```tsx
// src/components/Nav.tsx
<LiveTicker value={LIVE_PAYOUT.formatted} label={LIVE_PAYOUT.label} />
```

To make it live, render it from a client component that owns a WebSocket:

```tsx
"use client";
import { useEffect, useState } from "react";

export default function LiveTicker() {
  const [value, setValue] = useState(LIVE_PAYOUT.formatted);
  useEffect(() => {
    const ws = new WebSocket("wss://your-feed.example/stream");
    ws.onmessage = (e) => setValue(JSON.parse(e.data).paidThisWeek);
    return () => ws.close();
  }, []);
  return <LiveTicker value={value} label="this week" />;
}
```

The blinking caret in the payout feed is real caret animation, not a fake data
tick — it moves because carets move, not because data arrived.

---

## Verifying the layout

`scripts/audit.cjs` measures both routes at 375 / 768 / 1280 px and fails the
process if anything regresses, so it can gate CI. It checks:

- page-level horizontal overflow, and **any element** crossing the viewport edge
  (elements inside a scroll container are exempt — that's containment, not
  overflow)
- text clipped inside a non-scrolling box
- Cumulative Layout Shift, from a `PerformanceObserver` installed before load
- exactly one `<h1>`
- that the brand webfonts are actually *applied* (proportional faces are checked
  by measuring the same string against its generic fallback and comparing
  widths; the mono face is checked via `FontFaceSet` status, because every
  monospace face has a ~0.6em advance and a width comparison cannot tell them
  apart)
- that responsive behaviour actually happens: columns collapse, the nav links
  give way to the menu button

It writes a full-page PNG per combination into `shots/`.

Puppeteer is **not** a dependency — shipping it would add a ~170 MB Chromium
download to every install and every Vercel build.

```bash
npm install --no-save puppeteer
npx next start -p 4399 &
BASE=http://localhost:4399 node scripts/audit.cjs
```

`--force` re-measures combinations that already passed. Otherwise results are
merged from `shots/results.json` across runs, so an interrupted sweep resumes
instead of starting over.

### Running it in a minimal container

Two things this project's own sandbox needed, in case you hit the same walls.

**Shared libraries.** Headless Chrome will not start without a handful of
system libraries. If you cannot install them system-wide, fetch and unpack them
into a local prefix and point the loader at it:

```bash
apt-get install -y --download-only --no-install-recommends \
  -o Dir::Cache=/tmp/aptcache libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
  libgbm1 libpango-1.0-0 libcairo2 libasound2 libatspi2.0-0 fonts-liberation \
  libgtk-3-0 libx11-xcb1 libxss1
mkdir -p /tmp/aptcache/archives/partial
for d in /tmp/aptcache/archives/*.deb; do dpkg -x "$d" /tmp/chromelibs; done
export LD_LIBRARY_PATH=$(find /tmp/chromelibs -name '*.so*' -printf '%h\n' | sort -u | tr '\n' ':')
export PUPPETEER_CACHE_DIR=$PWD/.puppeteer-cache
```

**Fontconfig — the one that bites.** A container with no `/etc/fonts` makes
Skia abort the renderer the moment a page asks for a fallback face:

```
FATAL:third_party/skia/src/ports/SkFontMgr_FontConfigInterface.cpp:163] Not implemented.
Received signal 6
```

Puppeteer surfaces that as `Navigating frame was detached`, which reads exactly
like a flaky container and is not one — it is deterministic, and it hits
whichever page requests the most fallback faces. `scripts/fonts.conf` is a
minimal config that gives Skia a font to resolve; `audit.cjs` defaults
`FONTCONFIG_FILE` to it, so the sweep works without extra setup. The site
itself is unaffected: it ships its own webfonts from `/public/fonts` and never
depends on a system font.

---

## Design notes

**Status colour is the one addition.** The live palette is dark green and mint,
which is fine for brand and useless for state — green and mint mean everything
and therefore nothing. Five status tokens (`--status-open`, `-submitted`,
`-approved`, `-paid`, `-rejected`) carry state and nothing else, so a pill
colour always means a thing.

**Three motions, and only three.** The pill's arrow chip slides on hover, the
hero fades in once, the feed caret blinks. Everything else is flat with 1px
borders. The payout feed is the single element with a shadow — the specified
mint inset glow at 8% — and that is what separates it from every other surface.
`prefers-reduced-motion` disables all three.

**Tailwind component classes are referenced by name.** `.pill-primary`,
`.chip`, `.panel`, `.data-table` and friends live in `globals.css` under
`@layer components`. Tailwind purges classes it cannot see referenced, so the
string `"chip"` in a `className` expression is what keeps them in the build.
Replacing those with `clsx`-style conditional objects would silently drop them.

**`col-collapse`.** A one-line utility in `globals.css` that hides a table
column below `md`. It exists so collapsing columns does not need two copies of
the table markup.

**Fonts.** Instrument Serif ships **only a 400 face**, so any bold or heavy
weight on it is synthetic. There is no italic file in the live site's load
either, which is why their headings reflow once a synthetic oblique resolves;
this build preloads a real italic, which is why the italic-mint lines hold their
width from first paint.

---

## What was skipped, and why

| Skipped | Why |
| --- | --- |
| Animation on the payout ticker | No real feed to animate. A ticking number is a claim, not a feature. |
| A third company page section | The brief caps the site at two routes. Careers and the legal pages link out to Funngro's live equivalents. |
| Real team members beyond the two founders | Inventing names is the one thing the brief forbids outright. Four role cards, explicitly labelled, instead. |
| Phone mockups | Design 2's hero is a dashboard. A phone frame would be a leftover from the layout this replaces. |
| A third-party font source | Self-hosting avoids a third-party DNS lookup and a render-blocking stylesheet, and the brand fonts are self-hosted on the live site anyway. |
| Puppeteer as a dependency | ~170 MB of Chromium on every install and every Vercel build. Installed ad hoc instead. |
| `next/image` | There is no raster imagery in either page — every mark is inline SVG or text. The OG images are generated at build time by `next/og`, which is where the explicit 1200×630 dimensions live. |

---

## Layout audit — current results

Six combinations, all passing as of the last run:

| Route | 375 | 768 | 1280 |
| --- | --- | --- | --- |
| `/` | 0 overflow · 0 clipped · CLS 0 · 1 h1 | 0 · 0 · CLS 0.00018 | 0 · 0 · CLS 0.00018 |
| `/company` | 0 · 0 · CLS 0 · 1 h1 | 0 · 0 · CLS 0 | 0 · 0 · CLS 0 |

The responsive check is also confirming the collapse behaviour rather than
assuming it: task-table columns go 3 → 4 → 4 on `/` and 2 → 3 → 3 on
`/company`; the nav links appear and the menu button disappears at `md` and up.

The audit caught one real bug during this build. The release-notes trailing
marker was written `hidden md:flex md:col-span-0 lg:col-span-2`, and Tailwind
has no `col-span-0`, so at 768px the marker was auto-placed into a fresh row one
column wide, overflowed 3px past the left edge of the page, and the audit caught
it as a 65px element at x = −3. It now waits for `lg`, where 3 + 7 + 2 actually
fills twelve columns.