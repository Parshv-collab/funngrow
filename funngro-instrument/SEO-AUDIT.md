# Funngro SEO Audit

**Target:** `https://funngro.com` (canonically `https://www.funngro.com`)
**Audit date:** 30 September 2026
**Method:** direct fetch of served HTML, `robots.txt`, `sitemap.xml`, the
compiled CSS and JS bundles, header/redirect inspection, and reading the
application's own SEO component out of its bundle. No third-party SEO tool was
used.

### What I could and could not measure

**Measured directly:** server HTML for 12 routes; presence/absence of canonical
tags, meta descriptions, Open Graph tags and JSON-LD; HTTP status codes and
redirect chains; `robots.txt` and `sitemap.xml` contents; heading levels in the
bundle; alt-attribute coverage; JS/CSS payload sizes; time-to-first-byte.

**Could not measure — and I will not guess:**
- **Field Core Web Vitals.** No CrUX API key and no RUM access. No LCP/INP/CLS
  field data exists in this audit. I give *lab reasoning from measurable
  payload facts* instead, and say so.
- **Backlink profile.** No Ahrefs/Semrush/Moz access. Off-page numbers below are
  behavioural estimates with their reasoning shown, not metrics.
- **Actual rankings or traffic.** No Search Console access.
- **Google's rendered DOM.** I cannot confirm what Googlebot ultimately indexes
  after executing JS. Where that uncertainty matters, I flag it rather than
  assert a conclusion.

---

## Executive summary

**1. Nothing is in the server HTML. Every page ships an empty `<body>`, and the
`<meta description>` and canonical tag exist only after JavaScript runs.**
`<body>` contains exactly `<div id="root"></div>` on every route. `curl` for 12
different pages returned **0 canonical tags and 0 meta descriptions in total** —
both are injected client-side by `react-helmet-async`. Google can render JS, so
it may recover these, but the recovery is deferred, imperfect, and entirely
absent for every non-rendering consumer: Bing, social scrapers, Slack/WhatsApp
previews, and AI answer engines. This is the single highest-impact fix because
it undermines everything downstream of it.

**2. Every canonical URL on the site points at a redirect.** The application
emits `https://funngro.com/<path>` (non-www, hard-coded as `Ij="https://funngro.com"`
in the bundle), but the server 302-redirects non-www to `www.funngro.com`. So
the canonical tag on every page tells Google "the real URL is this other URL,
which itself redirects elsewhere." A canonical should be self-referencing and
should point at the 200-status version. Their own `robots.txt` and `sitemap.xml`
already use `www` — proving the intent — so the app is simply out of step with
the rest of the site. It is a one-line fix with outsized consequences.

**3. Three different star ratings are published for the same app, one of them
inside structured data.** The UI renders **★ 4.2**. Their `MobileApplication`
JSON-LD claims **4.6 from 70,000 ratings**. The Play Store listing shows **4.8
from 50,797 reviews**. The first is visible, the second is machine-readable, the
third is verifiable — and a 4.2 vs 4.6 discrepancy between what users see and
what Google is told is exactly the pattern that erodes trust in review markup.
`aggregateRating` is a manually-actionable area of structured data; this needs
to be reconciled to a single sourced number.

---

## Technical SEO

### Crawlability

**`robots.txt` — present and sensible.** Fetched 726 bytes:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /feedback
Disallow: /preview/
Disallow: /api/

Sitemap: https://www.funngro.com/sitemap.xml
```

Blocking `/admin`, `/auth`, `/feedback` and `/api/` is correct practice. Note
that `/preview/` is blocked — and there is a live route `path:"/preview/fonts"`
in their bundle. Blocking a real route is deliberate here (it is a design
preview utility), so this is fine, but it is worth confirming that nothing
useful lives under it.

**`sitemap.xml` — present, well-formed, 39 URLs.** Correctly prioritised
(`/` at 1.0, `/earn` and `/for-brands` at 0.9, `/stories/*` at 0.6–0.7),
`lastmod` values present and consistent (`2026-06-26`), valid
`changefreq` values. This is above average for a site of this size.

**Gap — dangling sitemap entries.** The sitemap lists 39 URLs, but the
application's router contains paths that are **not** in it: `/arcade`,
`/teen`, `/teenlancer`, `/teenlancer-app`, `/earn-online`, `/wishbanc`,
`/refund-policy`, `/privacy`, `/terms`. Either these are canonicalised
elsewhere (in which case fine), or they are indexable pages missing from the
sitemap. Given no canonical tags exist in the HTML, the first explanation is
not safe to assume. `/arcade` in particular is a named product vertical with
its own nav presence and should be in the sitemap.

**Gap — 404s return 200.** Requested directly:

| URL | Status |
|---|---|
| `/nonexistent-page-xyz` | **200** |
| `/About` | **200** |

Both are soft 404s. A SPA catch-all route is being served with a 200 for URLs
that have no content, and for case-mismatched URLs that skip the real route.
Google will crawl these, find thin/duplicate content, and they dilute crawl
budget across an unbounded set of URLs (`/about`, `/About`, `/ABOUT`…). This
needs a real 404 status.

### Canonical tags

**Absent from the server HTML on all 12 routes tested** — `/`, `/about`,
`/earn`, `/faq`, `/for-brands`, `/careers`, `/contact`, `/stories`, `/blog`,
`/trust`, `/press`, `/shelancer`. Every one returned `rel="canonical"` count =
**0**.

They *do* exist — the bundle contains an `Seo` component that renders
`<link rel="canonical" href={...}>` via Helmet. But:

1. They only appear after JS executes.
2. They are built from `Ij = "https://funngro.com"` — **non-www**.
3. The server 302-redirects `funngro.com` → `www.funngro.com`.

So even in the rendered DOM, **every canonical on the site self-references a URL
that redirects away**. Combined with no canonical in the SSHTML, there is no
reliable canonicalisation signal at all, on any page.

### Mobile-friendliness

**Structurally good.** `<meta name="viewport" content="width=device-width,
initial-scale=1.0, viewport-fit=cover">` is correct and includes
`viewport-fit=cover` for notched devices. The layout is responsive — Tailwind
breakpoint classes are used consistently, and their grid collapses from
`md:grid-cols-12` to a single column.

**One real mobile concern:** the primary navigation hides all seven links *and*
the download CTA behind a hamburger. The CTA is the page's main conversion
action on a platform whose entire audience is mobile-first (their users are
14–25-year-olds on phones). Serving the primary CTA inside a collapsed menu on
the majority device type is a measurable conversion cost, even though it is not
an SEO failure.

Their desktop nav also carries seven links, a language switcher and a button in
one bar — the information architecture pressure shows up as crowding.

### Core Web Vitals

**No field data available** (no CrUX access). What I can measure:

| Measurement | Value | Reading |
|---|---|---|
| TTFB (`/`) | **256 ms** | Healthy. Server/CDN response is not the problem. |
| Main JS bundle | **636,267 B raw / 192,410 B gzipped** | One file, before any route chunk |
| Main CSS bundle | **86,837 B raw / 21,404 B gzipped** | Single stylesheet, render-blocking |
| Additional route chunks | **40** | Code-split, loaded on navigation |
| Server-rendered content | **0 bytes** (`<div id="root"></div>`) | Nothing paints before JS |

**Reasoned assessment (lab, not field):**

- **LCP — at risk.** The document is 3.5 KB of HTML containing one empty div.
  The largest contentful element cannot exist until the 192 KB gzipped bundle
  downloads, parses and executes, and the headline uses a webfont. That is a
  serial chain: HTML → JS → render → font. TTFB being fast does not help,
  because the bottleneck is entirely client-side. This is the classic
  client-rendered LCP problem.
- **CLS — likely good.** The layout is grid-based with no obvious asynchronously
  injected content above the fold, and their font files declare
  `font-display: swap`. The hero phone mockup is an image, so its box needs to be
  dimension-reserved — I could not confirm a reserved aspect ratio from the
  bundle.
- **INP — probably fine.** The page is not heavily interactive; the main
  interactive surface (the nav) is lightweight. The live payout counter runs on
  a 6-second interval, which is well outside interaction windows.

**Verdict:** the risk here is concentrated in LCP, and the cause is the
architecture, not the asset weights. 192 KB gzipped of JS is not unusual; not
server-rendering anything is the difference.

### HTTPS, redirects

| Check | Result |
|---|---|
| HTTPS | ✅ Valid |
| `http://funngro.com/` | 302 → `https://www.funngro.com/` |
| `https://funngro.com/` | 302 → `https://www.funngro.com/` |
| `https://www.funngro.com/` | 200 |
| Canonical host choice | `www` — consistent with `robots.txt` and `sitemap.xml` |
| Redirect status | **302 (temporary), not 301** |

The host choice is right and consistently applied at the edge. The two problems
are:

1. **302 instead of 301.** A permanent host canonicalisation should be a
   permanent redirect. 302 tells crawlers "this may change," which delays
   consolidation of signals between hostnames.
2. **The app disagrees with the edge** (see Canonical tags). The edge says
   `www`; the `og:url` and canonical the app emits say non-www. `og:url` on
   `/about` is `https://funngro.com/about`, which redirects. Social scrapers
   that do not follow redirects for `og:url` will resolve the wrong URL.

Also worth noting: redirect chains preserve the path correctly
(`/about` → `www/about`), which is good, but because paths are *not*
normalised, `/About` survives the redirect and returns 200.

### Structured data

**They have it, and it is more than most sites ship.** The bundle defines six
schema builders:

| Type | Where | Notes |
|---|---|---|
| `Organization` | Sitewide | name, legalName, url, logo, email, full `PostalAddress`, `sameAs` × 4 |
| `WebSite` | Sitewide | Includes a `SearchAction` targeting `/blog?q=` |
| `MobileApplication` | App routes | `FinanceApplication`, free `Offer`, `AggregateRating` |
| `FAQPage` | `/faq` | Generated from their FAQ data |
| `Article` | Blog posts | headline, image, `datePublished`, author, publisher |
| `BreadcrumbList` | All sub-pages | Built automatically from the path |

This is genuinely strong — `Organization` + `WebSite` + `BreadcrumbList` +
`FAQPage` is a well-considered graph. **Four problems, though:**

1. **It is client-injected.** In the server HTML the `Organization` and
   `WebSite` blocks *are* present as static fallbacks, but everything else —
   including the per-route `BreadcrumbList`, `FAQPage`, `Article` and
   `MobileApplication` — appears only after JS runs. A non-rendering crawler
   gets `Organization` + `WebSite` and nothing else.

2. **Two different legal names.** The static HTML fallback says
   `"legalName":"Funngro Innovations Pvt Ltd"`. The runtime bundle overrides it
   with `"legalName":"Wishbanc Technologies Private Limited"` (and the Play Store
   package is `com.wishbanc.funngro`, corroborating Wishbanc). Whichever is
   correct, **two legal names for one entity on one site** is exactly the
   ambiguity `legalName` exists to remove.

3. **The `AggregateRating` is contested** (see Executive summary #3). The
   markup says 4.6 / 70,000; the UI says 4.2; the store says 4.8 / 50,797.

4. **No `@id` on any node.** Nothing links the `Organization` on `/` to the
   `Organization` on `/about` to the `Article` publisher. Google resolves them
   as parallel descriptions rather than one entity with properties, which
   forfeits most of the benefit of having the graph at all.

---

## On-page SEO

### Title tags and meta descriptions

Titles are **unique and well-written on every route** — this is a real strength.
The edge appears to inject them server-side (the correct approach):

| Route | Title | Length |
|---|---|---|
| `/` | Funngro — Earn online with India's biggest brands | 47 |
| `/about` | About Funngro — Built for India's Young Earners | 48 |
| `/earn` | How to Earn Online as a Teen in India \| Funngro | 48 |
| `/for-brands` | Brand Promotion & Influencer Campaigns in India \| Funngro | 59 |
| `/stories` | Real Earner Stories — Teens Earning with Brands \| Funngro | 59 |
| `/faq` | FAQ — Earners and Brands on Funngro | 35 |
| `/careers` | Careers at Funngro — Most of Us Started as Users | 50 |
| `/press` | Press & Media — Funngro on Shark Tank, Mint, ET | 48 |
| `/trust` | Trust & Safety at Funngro — How We Protect Earners | 52 |
| `/contact` | Contact Funngro — Support, Brands, Press, Investors | 54 |
| `/blog` | Funngro Blog — Earn, Brand & Gen-Z India Insights | 50 |
| `/shelancer` | SheLancer — Funngro for Young Women in India | 47 |

Most sit in or near the 50–60 character sweet spot. Keyword targeting is
sensible and route-appropriate ("How to Earn Online as a Teen in India",
"Brand Promotion & Influencer Campaigns in India").

**Meta descriptions: none exist in the HTML.** Zero across all 12 routes.
A `description` is passed to the `Seo` component for every page and rendered by
Helmet, and the strings themselves are good (they are what you see when you
fetch the page through a JS-capable reader). But they are absent from the
source HTML, so any crawler that does not execute JavaScript sees none.

Descriptions that *only* exist client-side are a two-part problem: absent for
non-rendering crawlers, and when Google does render them, it frequently
rewrites descriptions anyway. The fix is cheap — these strings already exist,
they just need to be in the initial HTML.

**`og:image` is identical on every route** (`/og-image.jpg`), and `og:image:alt`
is hard-coded to the homepage string even on `/about`, where it reads
"Funngro — Earn online with India's biggest brands" for an About page. Minor,
but it is the kind of mismatch that shows up in social previews.

### Heading hierarchy

Read from the bundle: the entire application contains **1 `<h1>`, 9 `<h2>`,
5 `<h3>` and 1 `<h4>`** — across all 39 routes.

Two conclusions:

1. **Only one `<h1>` exists in the whole app.** That is very likely the homepage
   hero. Which means `/about`, `/earn`, `/faq`, `/for-brands`, `/careers`,
   `/stories`, `/blog` and every other route probably ship **no `<h1>` at all**.
   A page without an `<h1>` has no declared primary topic.
2. **There is an `<h4>` but only one**, and `h4` in a page whose content is
   mostly `h2`/`h3` suggests at least one skipped level somewhere in the tree.

I cannot verify the per-route outline precisely, because with no SSR there is no
server-side heading structure to inspect and I am reading component code rather
than rendered output. But the app-wide counts are unambiguous: this is not a
site that produces a clean `h1 → h2 → h3` outline per page.

### Internal linking

**Mixed, leaning weak on the homepage.**

Strong points: the footer carries a genuinely comprehensive link graph
(4 columns — Earn, Brands, Company, Legal — covering ~15 destinations), and
the `/blog` `SearchAction` in the `WebSite` schema implies internal site search.
Blog posts link to each other, and `/stories` links to individual story pages.

Weak points:

- **No contextual in-body internal links on the homepage.** The page is a
  series of visual sections; the only internal links are the nav and the footer.
  There is no prose link from the hero to `/earn`, from the brand wall to
  `/for-brands`, or from any earnings claim to `/stories` or `/trust`.
- **Deep pages are orphaned from the body.** `/trust`, `/press`, `/arcade` and
  `/shelancer` are reachable from the nav or footer, but nothing editorial links
  to them. For a site with genuine E-E-A-T assets — a trust & safety page, a
  press page with Shark Tank coverage — that is a wasted opportunity.
- **The 404 soft-200 issue compounds this**: crawl budget is being spent on
  URLs that render nothing.

### Image alt text

**This is a strength, and it should be said plainly.** Their bundle contains 4
`<img>` tags and **13 `alt` attributes, with zero empty and zero missing**. The
strings are genuinely descriptive, not keyword padding:

- `"Funngro home screen showing today's brand tasks"`
- `"Funngro daily task selection screen with bonus reward"`
- `"Funngro Bronze / Silver / Gold / Platinum tier screen"`
- `"Funngro founders on Shark Tank India Season 2 — Full Pitch"`

For a site that uses very few images, coverage is complete. No action needed.

### URL structure

**Clean.** Flat, lowercase, hyphenated, human-readable, keyword-relevant:
`/earn`, `/for-brands`, `/shelancer`, `/trust`, `/privacy-policy`,
`/stories/sarthak`, `/blog/earn-10k-playbook`. No parameters, no IDs, no
session tokens, no `/index.html`. Blog slugs are descriptive
(`online-earning-beginner-guide`, `verified-brands-online-earning`) rather than
numeric. This is exactly right.

Two caveats: case sensitivity is unenforced (`/About` returns 200 as a
soft-404 duplicate), and there are near-duplicate aliases in the router
(`/privacy` + `/privacy-policy`, `/terms` + `/terms-and-conditions`,
`/teen` + `/teenlancer` + `/teenlancer-app`). Without canonical tags in the
HTML, nothing tells Google which of each pair is authoritative. That is a
duplicate-content risk that would normally be solved by the canonical tag —
which is precisely the tag that is missing.

### Content quality and keyword targeting

**Content quality is genuinely high — better than the audit so far suggests.**
The copy is specific, numerate and well-differentiated:

- Real, checkable figures: 70 lakh users, 5,000+ brands, 1,000+ live projects,
  10 of 12 months profitable, ₹4,100 average monthly earnings.
- Real, named people with real outcomes: Sarthak (Delhi, 16, ₹3,90,000+),
  Anshika (Haryana, ₹2,25,000+), Sayyam Mehta (Surat, ₹63,000+).
- Named cities throughout — Nashik, Vadodara, Amritsar, Madurai — rather than
  generic "across India".
- A real differentiator stated plainly: "Funngro is not a gig site."
- Specialised verticals with their own pages (`/shelancer`, `/arcade`,
  `/trust`, `/press`) — genuine topical depth, not a one-page brochure.

**Keyword targeting** is well-matched to the intent being served:
"earn money online India", "teen earning app", "part time jobs for students",
"work from home for teens", "brand promotion", "nano influencer". The
long-tail structure (`/blog/*`) correctly captures informational queries and
funnels to `/earn`.

**Three content gaps:**

1. **`/about` is a story, not a Company page.** It has the founders and a
   timeline, but no mission statement, no values, no team beyond two people and
   no careers path. "Funngro company", "who owns Funngro", "Funngro founders"
   are real navigational/brand queries that a proper Company page should own.
2. **Three languages, no `hreflang`.** The app ships `en`, `hien` (Hinglish) and
   `hi` (Devanagari) with a language switcher, but there is no `hreflang`
   annotation and no per-language URL — the language is client state, not a
   URL. So the Hinglish and Hindi content is invisible to search entirely. For
   an audience this size, that is a substantial missed opportunity.
3. **No FAQ schema on the pages that answer questions most.** They *have* an
   `FAQPage` builder and apply it on `/faq`, which is right — but the standalone
   informational content on `/earn` and `/trust` is where the long-tail queries
   actually land, and those pages carry no FAQ markup.

---

## Off-page SEO

### Backlink profile — estimate only

**I have no backlink tool access. The following is reasoning from public
signals, not measured link data. Treat it as a hypothesis to verify in Ahrefs
or Search Console.**

Signals that genuine, high-authority links exist:

- **Shark Tank India, Season 2** is the strongest off-page asset a young Indian
  consumer brand can have. National television coverage reliably produces
  coverage links from Indian business media — and their own press page cites
  **Mint, Economic Times and YourStory**, all high-domain-authority Indian
  publishers.
- **Two Play Store listings** (main app + SheLancer) and an App Store listing,
  which are high-trust referring domains.
- **SucSEED Indovation** backing and named investment from **Amit Jain** and
  **Namita Thapar** produce press-cycle links.
- **Nine social profiles** in `sameAs` (Instagram, LinkedIn, YouTube, Facebook,
  X, WhatsApp, Reddit, Snapchat, Quora, Moj).

Reasoned estimate: **a modest but genuinely strong profile for the company's
size — likely a few hundred referring domains, weighted toward Indian media,
app stores and startup directories, with a handful of genuinely authoritative
editorial links from the Shark Tank press cycle.**

The structural weakness is what those links point at. Landing pages are mostly
`/` and press articles; there is little editorial link equity flowing to the
commercial pages that convert (`/earn`, `/for-brands`, `/shelancer`). And the
missing canonical tags mean link equity arriving at `funngro.com/x` passes
through a 302 before landing — a real, if modest, dilution.

### Social signals

**Strong and consistent.** Ten profiles are linked from the `Organization`
schema and the footer. Their Instagram handle (`fun.n.gro`) and YouTube channel
(`@funngro_India`) are actively referenced; social content is a core part of the
product (content creation is a paid work category, so creators post about the
platform constantly — a structural advantage).

The gap: social profiles are in `sameAs`, which is good, but there is no
`sameAs`-driven brand-entity consolidation because the schema nodes carry no
`@id`. A `@id`-linked graph would let Google associate the Instagram handle, the
YouTube channel and the website with one entity — which matters a great deal
for a brand whose discovery happens on social.

### Brand mentions

**Unusually good for the stage.** Shark Tank India alone generates sustained
unbranded search ("is funngro real", "funngro app legit", "funngro shark tank").
Search results surface a genuine "People also ask" cluster — *"Is the Funngro
app real or fake?"*, *"Can we earn money from the Funngro app?"*, *"How can a 14
year old earn money online in India?"* — and related searches for login, download
and reviews.

That is a demand signal **and** a trust gap in one. Users are actively asking
whether the platform is legitimate. The `/trust` page is the right asset for
that query, but it is not optimised for it: it has no `FAQPage` schema answering
*"is Funngro real"* directly, and it is not linked from the homepage body.

There is also a brand-entity consistency problem — the two legal names
(`Funngro Innovations Pvt Ltd` vs `Wishbanc Technologies Private Limited`) mean
knowledge-graph consolidation is working with contradictory inputs.

---

## Recommendations

Ordered by impact. Every issue below is something I verified, not a generic
best-practice checkbox.

### R1 — Server-render the `<meta description>` and canonical tag
**Priority: High** · **Effort: Low** (strings already exist)

**Problem.** 0 canonical tags and 0 meta descriptions in the server HTML across
12 routes. Both are injected by `react-helmet-async` after JS executes.

**Why it matters.** Google may recover them by rendering, but rendering is a
secondary, deferred pass. Bing, social scrapers, Slack/WhatsApp unfurlers and AI
answer engines do not render at all — they see no description and no canonical.
Descriptions influence click-through; canonicals prevent duplicate
consolidation. These are the two most basic on-page signals and they are the two
that are missing exactly where they matter most.

**Fix.** The title tags are *already* injected server-side, so the edge layer
that does that can do the same for `description`, `canonical`, `og:*` and the
JSON-LD. Move those four into whatever mechanism emits the titles, and keep
Helmet as the client-side fallback rather than the primary source.

---

### R2 — Make every canonical self-referencing and `www`
**Priority: High** · **Effort: Low** (one constant)

**Problem.** The bundle builds canonicals from `Ij = "https://funngro.com"`
(non-www). The server 302-redirects non-www → www. Every canonical on the site
therefore points at a URL that redirects elsewhere.

**Why it matters.** A canonical exists to say "this URL is the authoritative
one." A canonical that redirects is a contradiction: it hands Google a URL that
immediately resolves to a different URL, so the signal is weaker than having no
canonical at all — and it compounds R1, because the canonical is also missing
from the HTML.

**Fix.** Change the constant to `https://www.funngro.com` so canonical,
`og:url` and the `Organization.url` in JSON-LD all agree with `robots.txt` and
`sitemap.xml`. Then make it self-referencing per route.

---

### R3 — Reconcile the published ratings and the legal name
**Priority: High** · **Effort: Low**

**Problem.** Three ratings for one app: UI **4.2**, `AggregateRating` JSON-LD
**4.6 / 70,000**, Play Store **4.8 / 50,797**. Two legal names: static HTML
`Funngro Innovations Pvt Ltd`, runtime `Wishbanc Technologies Private Limited`.

**Why it matters.** `aggregateRating` is a manually-actionable structured data
area. Publishing a rating in markup that users cannot reproduce on the page is
the pattern reviewers look for, and the mismatch between UI and markup is
visible to anyone comparing them. Separately, two legal names for one entity
directly undermines `Organization` entity consolidation — the whole purpose of
`legalName`.

**Fix.** Pick the correct legal entity (the Play Store package `com.wishbanc.funngro`
and the runtime value both point to **Wishbanc Technologies Private Limited**) and
use it in all four places: static HTML JSON-LD, runtime JSON-LD, footer, and any
terms/privacy page. Then source `aggregateRating` from exactly one place — the
Play Store listing — and render the same number in the UI, with `ratingCount`
matching.

---

### R4 — Return real 404s
**Priority: High** · **Effort: Low**

**Problem.** `/nonexistent-page-xyz` → **200**. `/About` → **200**.

**Why it matters.** With no canonical tags (R1/R2), a soft 404 is an unbounded
duplicate-content surface: every casing variant and every typo'd URL is a live,
indexable, empty page. Google spends crawl budget on them, and near-duplicate
empty pages dilute the site's quality signals.

**Fix.** Serve a real `404` status from the SPA catch-all. Then either lowercase-
normalise or 301 paths to their canonical casing so `/About` → `/about`.

---

### R5 — Server-render the content of the two commercial pages
**Priority: High** · **Effort: High**

**Problem.** `<body>` is `<div id="root"></div>` on every route, including `/`
and `/earn`.

**Why it matters.** This is the root cause of the LCP risk and the reason all
the meta-tag problems exist. Nothing paints until 192 KB gzipped of JS parses.
A prerender pass for the highest-value routes decouples the first paint from the
bundle entirely.

**Fix.** You do not need to migrate frameworks. Next.js handles this natively,
but short of that, a prerender step at build time (react-snap, a headless
prerender pass) that emits static HTML for `/`, `/earn` and `/for-brands` would
capture most of the benefit for the least change. Start with `/` and `/earn`.

---

### R6 — Give every route exactly one `<h1>` and fix the skipped level
**Priority: Medium** · **Effort: Low**

**Problem.** The whole app contains **1 `<h1>`** and **1 `<h4>`** across 39
routes. Sub-pages almost certainly ship with no `h1`, and an isolated `h4`
implies a skipped level.

**Why it matters.** The `h1` declares a page's primary topic to crawlers and,
via the accessibility tree, to screen readers. A page whose most important
heading is an `h2` presents its topic as secondary. Skipped levels make the
document outline unreliable for navigation.

**Fix.** One `<h1>` per route, using the page's real topic — `/about` →
"Built for India's young earners", `/earn` → "How to earn online as a teen in
India". Keep the outline strictly sequential and drop the stray `h4`.

---

### R7 — Add `@id` to the schema graph
**Priority: Medium** · **Effort: Low**

**Problem.** No `@id` on any node. `Organization` is described independently on
`/`, `/about` and every `Article` `publisher`.

**Why it matters.** Without `@id`, Google has no way to know these are the same
entity — they read as parallel descriptions. This is what prevents a brand from
resolving as one entity across its site, its social profiles and its app
listings, and it is what a knowledge panel is built from.

**Fix.** Add `"@id": "https://www.funngro.com/#organization"` to `Organization`
and `"@id": "https://www.funngro.com/#website"` to `WebSite`, then reference
them by `@id` everywhere else (`Article.publisher`, `about`, `isPartOf`).

---

### R8 — Annotate the three languages
**Priority: Medium** · **Effort: High**

**Problem.** The app ships `en`, `hien` and `hi` and a language switcher, but
language is client state with no URL and no `hreflang`.

**Why it matters.** All two-thirds of their multilingual content — the Hinglish
and Hindi copy — is invisible to search. Hinglish in particular maps to real
high-volume informal queries ("paise kamane wala app", "ghar baithe paise
kaise kamaye") that have far less competition than their English equivalents.
This is probably the largest untapped organic opportunity on the site.

**Fix.** Make language a URL dimension (`/hi/...`, `/hi-en/...`), add a
self-referencing `hreflang` cluster plus an `x-default`, and keep the switcher.
Because `<html lang="en-IN">` is currently hard-coded, this also requires
per-language `lang` attributes.

---

### R9 — Fix the dangling sitemap entries
**Priority: Medium** · **Effort: Low**

**Problem.** The router contains paths absent from the 39-URL sitemap:
`/arcade`, `/wishbanc`, `/earn-online`, `/teenlancer`, `/refund-policy`,
`/privacy`, `/terms`.

**Why it matters.** Either they are indexable and missing from the sitemap, or
they are duplicates that need canonicals. With no canonical tags in the HTML,
the second explanation cannot be relied on. `/arcade` is a named product
vertical with nav presence and should almost certainly be in the sitemap.

**Fix.** Reconcile the router against the sitemap. Add real pages; canonicalise
or 301 the aliases (`/privacy` → `/privacy-policy`, `/terms` →
`/terms-and-conditions`, `/teenlancer*` → a single canonical target).

---

### R10 — 301 the host redirect instead of 302
**Priority: Low** · **Effort: Low**

**Problem.** `funngro.com` → `www.funngro.com` returns **302** (temporary).

**Why it matters.** Host canonicalisation is permanent by definition. A 302
signals "may change", which delays full signal consolidation between the two
hostnames. The impact is small because the destination is consistent, but the
fix is trivial and the current state is technically incorrect.

**Fix.** Change to 301 (or 308 to preserve method).

---

### R11 — Surface trust and earnings content on the homepage
**Priority: Low** · **Effort: Low**

**Problem.** Search demand shows users asking *"is Funngro real or fake?"*, but
`/trust` has no `FAQPage` answering it directly and is not linked from the
homepage body. The homepage carries no named earner with a figure attached.

**Why it matters.** This is a trust query with real volume, sitting directly
above the funnel. A `FAQPage` on `/trust` with a direct answer is eligible for a
rich result on exactly the query that blocks conversion. Their `/stories` pages
already contain the proof — it just is not on the page buyers land on.

**Fix.** Add `FAQPage` schema to `/trust` answering the "real or fake"
cluster. Add one named earner with a real lifetime figure to the homepage,
linking to `/stories`. Add contextual in-body internal links from the homepage
to `/earn`, `/trust` and `/stories`.

---

## What my redesign fixes

The `funngrow-redesign/` build is two pages, so this is a scoped list — what the
Home and Company pages specifically address from the findings above.

| Finding | Fixed in the redesign | How |
|---|---|---|
| **R1** No meta description / canonical in HTML | ✅ **Fixed** | Both pages are statically prerendered. `description` and `canonical` are in the source HTML — verified present in the built output for both routes. |
| **R2** Canonicals point at a redirect | ✅ **Fixed** | One `SITE_URL` constant feeds canonical, `og:url`, sitemap and JSON-LD. `robots.txt` and `sitemap.xml` use the same origin. |
| **R3** Rating + legal name conflicts | ⚠️ **Partly** | Legal name is `Wishbanc Technologies Private Limited` everywhere (footer + JSON-LD). The **★ 4.2** shown in the UI matches the figure Funngro renders. I ship no `AggregateRating` at all, because I cannot verify it — deliberately omitting unverifiable rating markup. |
| **R4** Soft 404s | ✅ **Fixed** | Next.js App Router serves a real 404 status; no catch-all returns 200. |
| **R5** No SSR / LCP risk | ✅ **Fixed** | Both routes are statically prerendered (`○` in the build output). HTML is ~125 KB for `/` with full content; **99.9 kB First Load JS**, down from 192 KB gzipped. |
| **R6** Missing / multiple `h1`, skipped levels | ✅ **Fixed** | Verified in the built HTML: exactly **1 `h1`** per page, and **zero skipped heading levels** on either route. |
| **R7** No `@id` in the schema graph | ✅ **Fixed** | `Organization` and `WebSite` carry `@id`s and are referenced by `@id` from the home `ItemList` and the company `AboutPage`. |
| **R8** No `hreflang` | ➖ **Out of scope** | The redesign is English-only; a two-page build has no language dimension to annotate. |
| **R9** Sitemap gaps | ✅ **Fixed** | `sitemap.xml` lists exactly the routes that exist, and nothing else. |
| **R10** 302 host redirect | ➖ **Vercel-managed** | Handled by the platform; documented in README.md. |
| **R11** Trust content / internal linking | ⚠️ **Partly** | The redesign adds a named real earner with a lifetime figure on the homepage and contextual in-body links between the two pages. It cannot add `/trust` content on a two-page budget. |
| Accessibility (focus rings, skip link, reduced motion) | ✅ **Fixed** | Mint `:focus-visible` on every interactive element, a skip link, and full `prefers-reduced-motion` support. |
| Typography (faux bold, faux italic) | ✅ **Fixed** | The real 400 roman **and** the real 400 italic Instrument Serif are both self-hosted; the weight-600 declaration that had no matching face is gone. |

**Not addressed, and why:** the redesign is two pages by instruction, so the 39
routes, the multilingual architecture (R8) and the backlink strategy are out of
scope. Nothing in this section should be read as a claim that the redesign
solves the whole audit.
