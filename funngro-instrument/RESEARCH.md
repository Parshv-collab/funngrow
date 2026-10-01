# RESEARCH.md — Funngro brand research

**Research date:** 30 September 2026
**Primary source:** `https://funngro.com` — its served HTML, its compiled
stylesheet (`/assets/index-*.css`) and its JavaScript bundle
(`/assets/index-*.js`), plus the sitemap, robots.txt and public store listings.

Everything in this file is evidence, not invention. Where I inferred something
rather than reading it, it is labelled **inference**.

---

## 0. Domain correction — read this first

`https://funngrow.com` **does not resolve.** `getaddrinfo` returns
`ENOTFOUND` for both the apex and `www`. There is no such site.

The real site is **`https://funngro.com`** — *fun* + *gro*, no "w". Every
detail in the brief matches it exactly: the 70 lakh user figure, the ₹13,69,832
live payout counter, the mint italic accent on the hero headline, the
promotion/content/referrals/sampling/surveys categories, the 4.2 Play Store
rating and the phone mockup.

**Decision:** the redesign is built as **Funngro**, the real brand. The
requested folder name `funngrow-redesign/` is kept as specified.

---

## 1. What they do

**One sentence:** Funngro is an Indian earning app where young Indians get paid
in UPI for real work from India's biggest brands — promotion, content,
referrals, sampling and surveys.

| | |
|---|---|
| **Audience** | Young Indians, **14–25**. Their own store listing says 14–25; their FAQ addresses minors explicitly. |
| **Geography** | India-first. Registered office in Mumbai. Earners span Delhi, Mumbai, Chennai, Bengaluru, Surat, Kolkata, Lucknow, Indore, Jaipur, Bhopal, Nagpur, Patna, Guwahati, Faridabad, Nashik, Vadodara, Amritsar, Madurai, Coimbatore, Ranchi, Bhubaneswar, Mysuru, Trichy, Chandigarh, Noida, Mangalore, Thane, Gurugram, Dehradun, Raipur, Jodhpur, Varanasi, Agra, Meerut — the city list is read off their live payout ticker. |
| **Payment** | UPI or bank transfer. First payout promised in under 24 hours. |
| **Cost** | Free. "Zero fees" appears in their own hero copy. |
| **Sign-up** | Phone number + OTP, about two minutes. No CV, no interview. |

### The numbers they cite (all real, all reused in the redesign)

| Value | What it means |
|---|---|
| **70 Lakh+** | Young Indians earning |
| **5,000+** | Brand partners |
| **1,000+** | Live projects right now |
| **₹13,69,832** | Live payout figure (a counter that ticks upward every 6s) |
| **★ 4.2** | Play Store rating, as rendered in their own UI |
| **₹4,100 / month** | Average active earner (their blog) |
| **₹18,000+ / month** | Top 5% of earners (their blog) |
| **10 of 12** | Months profitable |
| **#9** | Education app ranking in India on Google Play |
| **40,000 → 70 lakh** | Users before vs after their Shark Tank episode |
| **170 → 5,000+** | Brand partners, same before/after |

### Identity and history (from their `/about` page)

- **Legal entity:** Wishbanc Technologies Private Limited
- **Registered office:** 2105 Wing F, Fantacy Land, CTS No 1, Opp Majas Depot,
  Jogeshwari E, J V Link Road, Mumbai, Maharashtra 400060, India
- **Emails:** `hello@funngro.com`, `teenlancer@funngro.com`
- **Founded:** 2022
- **Co-founders:** **Payal Jain** (IIM Calcutta; two decades across Worldline,
  Syntel and Capgemini) and **Anik Jain** (IIM Calcutta PGDCM; two decades in
  BFSI and insurtech across ICICI Lombard, Reliance Life, Marsh and Mahindra,
  most recently CEO of Symbo)
- **Television:** Shark Tank India Season 2 (Dec 2022). Investment from **Amit
  Jain** and **Namita Thapar**, followed by **SucSEED Indovation**.
- **Growth:** entirely referral-driven — "One million users. Zero ad spend."

### Product structure

Four **work categories**, using their own wording:

| # | Category | Their blurb |
|---|---|---|
| 01 | Content creation | "Reels, posts, blogs, photos — for real brand campaigns. Your phone is the studio." |
| 02 | Brand promotion | "Share, post, talk about brands you already follow. Get paid for genuine recommendations." |
| 03 | Referrals | "Bring friends to brands they'll like. Earn when they sign up, transact, or stay." |
| 04 | Micro tasks from brands | "Sampling, surveys, app testing, product ideation. Small, fast, paid by the task." |

Plus verticals: **Teenlancer** (the main earners), **SheLancer** (a dedicated
vertical for young women), **Clan leaders** (a community/referral layer, "one
hundred clan leaders managing tens of thousands of earners"), and **Arcade**.

---

## 2. Brand identity — sampled, not guessed

Every value below was read out of their compiled CSS custom properties. They
publish in HSL; the hex is my conversion of their exact triple.

| Token | Their HSL | Hex | Role |
|---|---|---|---|
| `--background` | `138 52% 5%` | **`#06130a`** | Near-black with a deep forest-green tint |
| `--foreground` | `138 33% 93%` | **`#e7f3eb`** | Warm, green-tinted off-white — not pure white |
| `--card` | `144 23% 8%` | **`#101913`** | Panel surface |
| `--border` / `--input` | `145 24% 13%` | **`#192920`** | Hairline |
| `--primary` | `152 92% 35%` | **`#07ab5f`** | Brand green — button fill |
| `--accent` | `146 65% 62%` | **`#5ddd96`** | **The mint.** The italic lines, all highlights |
| `--muted-foreground` | `140 11% 54%` | **`#7d9785`** | Muted olive-grey |
| `--prose-soft` | `140 19% 80%` | **`#c2d6c9`** | Body copy on dark |
| `--frame-border` | `144 27% 16%` | **`#26342a`** | Outer frame |
| `--leaf` | `87 96% 87%` | **`#e1febe`** | Pale lime highlight |
| `--primary-foreground` | `138 52% 5%` | `#06130a` | Text on a mint button |

Additional evidence: `<meta name="theme-color" content="#0b0f0d">` and
`<html class="dark">`. Their mint glow is a hard-coded
`box-shadow: 0 0 0 1px #07ab5f73, 0 14px 40px #07ab5f52`.

**Contrast check (mine, WCAG 2.1):**

| Pair | Ratio | Verdict |
|---|---|---|
| `#5ddd96` mint on `#06130a` | **11.08:1** | AAA |
| `#07ab5f` green on `#06130a` | **6.33:1** | AA |
| `#06130a` on `#07ab5f` (button text) | **6.33:1** | AA |
| `#7d9785` muted on `#06130a` | **6.00:1** | AA |

The palette is genuinely well-built. The green-on-black brand reads clearly
because they chose a green bright enough to clear AA on near-black.

### Typography — the real font stack

Read from their `@font-face` rules and utility classes:

| Family | Role | Weights actually shipped |
|---|---|---|
| **Instrument Serif** | Display headlines | **400 roman only** |
| **Work Sans** | Body | 400, 600, 700 |
| **JetBrains Mono** | Kickers, labels, numerals | 400 |

Their `@font-face` files are self-hosted through `@fontsource` — six woff2 +
woff files under `/assets/` — deliberately, per the comment in their HTML:
*"Fonts are self-hosted via @fontsource so the first paint isn't blocked on a
Google Fonts CSS request."* That is a good decision and the redesign keeps it.

**⚠️ Two real typographic bugs found in their type system:**

1. `.h1-cinema` and `.h2-cinema` both declare `font-weight: 600`, but the only
   Instrument Serif face loaded is **400**. Instrument Serif has no 600 weight
   at all. Every headline on their site is therefore faux-bolded by the
   browser, inconsistently across platforms.
2. **No italic Instrument Serif file is loaded anywhere.** This matters a great
   deal, because italic is their signature move — `text-accent italic font-serif`
   is applied to the second half of the hero headline. So their most
   recognisable typographic gesture is a browser-synthesised oblique.

Both are fixed in the redesign (see §3 and `globals.css`).

### Scale, spacing and shape

| Element | Their value |
|---|---|
| `.h1-cinema` | `clamp(38px, 7vw, 96px)` / line-height `1.02` / tracking `-0.02em` |
| `.h2-cinema` | `clamp(28px, 5vw, 64px)` / line-height `1.05` / tracking `-0.02em` |
| `.kicker` | JetBrains Mono 11px / `0.25em` tracking / uppercase / mint |
| `.muted-mono` | JetBrains Mono 10px / `0.2em` tracking / uppercase / `#7d9785` |
| Section padding | `py-20 md:py-28` → **80px mobile / 112px desktop** |
| Container | `max-w-[1280px]` + `px-6` (24px) |
| `--radius` | **`.25rem` (4px)** — very square; cards override to `rounded-2xl` (16px) |
| `.pill-primary` | padding `14px 28px 14px 32px`, `border-radius: 999px`, `#07ab5f` fill, 14px bold. **Hover: `padding-right: 42px`** and fill flips to mint |
| `.circ` | 28px circle inside the pill — dark fill, mint arrow |

That hover behaviour — the pill widening by 14px while the icon chip slides —
is a genuinely good micro-interaction and it is kept verbatim in the redesign.

---

## 3. The visual signature (kept)

The hero headline is the most recognisable thing on the site: **serif roman for
the setup, serif italic in mint for the payoff.**

Their hero renders exactly two DOM nodes:

```jsx
<h1 className="h1-cinema mt-10 text-foreground">
  {h1a}                                   {/* "Get Paid by India's biggest brands with" */}
  <br />
  <span className="text-accent italic font-serif">{h1b}</span>  {/* "flexible remote opportunities." */}
</h1>
```

The brief describes this as a **four-line pattern** — two roman lines, then two
italic-mint lines. That is what it looks like when rendered at desktop width,
because `h1a` is long enough to wrap. It is worth being precise about: the
*visual* pattern is four lines, but the *implementation* is two nodes and a
`<br>`, so the roman/italic boundary is at the mercy of the viewport.

The redesign reproduces the visual rhythm and makes it structural — four
explicit line blocks — so it holds at every width. See §6.

The same two-part pattern repeats in their section headings: for example
`h2a: "Real brands."` / `h2bItalic: "Real rupees."` and
`h2a: "Your first"` + `h2mid: "rupee"` + `h2b: "is three taps away."` — the
emphasis word always landing in italic mint. That is the tell, and the redesign
reuses it on every section heading on both pages.

---

## 4. The voice (kept)

Direct, money-positive, and unmistakably written for Indian youth. It is
genuinely good copy and much of it is better than what most funded startups
ship. Characteristics worth naming:

- **Contractions and second person.** "Get paid by the brands you already use."
- **Blunt numerals.** "70 lakh", "₹4,100", "5,000+" — never "a growing community".
- **Anti-corporate framing.** "Funngro is not a gig site." "Zero fees. Real
  money." "Not hype."
- **Code-switching to Hinglish.** The site ships three languages — `en`,
  `hien` (Hinglish, roman script) and `hi` (Devanagari). Hinglish is the
  default *fallback*, not a novelty: `"Aaj ke brand drops, tumhare liye sorted."`
- **Concrete geography.** Nashik, Vadodara, Amritsar, Madurai — named, not
  "tier-2 cities".

**The redesign carries the English voice and drops the Hinglish.** That is a
deliberate scope decision, documented in README.md under "What was skipped":
a Hinglish translation done badly is worse than none, and the brief asks for
two English pages.

---

## 5. What's weak on the current site — the design opportunities

These are the observations that became the redesign's brief. Each is something
I could evidence, not a matter of taste.

### Design and layout

1. **The navigation is genuinely cramped.** Seven top-level links (Earn,
   Stories, For Brands, Arcade, SheLancer, About, Blog) *plus* a language
   switcher *plus* a download button, all in one 1280px bar. Nothing is
   prioritised, so the eye has no entry point. On mobile it collapses to a
   hamburger, hiding the primary CTA.
2. **Body copy is set in italic serif.** The hero lead is
   `font-serif italic text-lg`. It is beautiful for one line and hard work for
   three, and it is the single most-read paragraph on the site.
3. **Faux-bold and faux-italic headlines** (§2). Their signature gesture
   renders as a browser approximation.
4. **The hero headline is a two-node string**, so the roman/italic boundary
   drifts with the viewport and the four-line rhythm is not reliable.
5. **Section rhythm is thin and uneven.** Sections run at 80/112px against
   96px headlines — the type is bigger than the space around it. Several major
   blocks (`/about`) sit at `py-20 md:py-24` with no separating rule, so bands
   run together.
6. **The ₹13,69,832 figure is buried.** It lives in a small pill beside the
   primary CTA, competing with the button, at roughly 13px. It is the single
   strongest proof point on the page and it is almost invisible.
7. **The "what you can do" block hides its best content.** Four numbered rows,
   where each row's most useful detail — the examples — is a comma-separated
   string in 10px mono at 54% lightness. It is the hardest text on the page to
   read and the most specific.
8. **The footer has four columns and a very long link list** (Earn, Brands,
   Company, Legal — with Company carrying seven items including FAQ, Press and
   a mailto), which pushes the bottom row far from the wordmark.
9. **Testimonial density.** Real earner stories are buried on `/stories`;
   the homepage does not carry a single named earner with a number attached.

### Accessibility

10. **`:focus-visible` is never styled.** There is no focus ring rule anywhere in
    their stylesheet, so keyboard navigation depends on browser defaults.
11. **No skip link.** There is no way to jump past the seven-link nav.
12. **No `prefers-reduced-motion` handling.** The site animates on scroll and
    runs a live counter with no opt-out.
13. **Good news, honestly:** image alt text is in better shape than expected —
    four `<img>` tags, thirteen `alt` attributes, and **zero** empty or missing
    alts. Their alt strings are descriptive ("Funngro home screen showing
    today's brand tasks"). This is a strength, not a weakness.
14. **Contrast is fine** (all pairs ≥ 6:1, see §2). Also a strength.

### Technical / SEO (full treatment in SEO-AUDIT.md)

15. **Client-rendered only.** `<body>` contains exactly `<div id="root"></div>`.
    No server-rendered content at all.
16. **No `<meta name="description">` in the HTML** — on any page. It is injected
    client-side by Helmet, so non-JS crawlers never see it.
17. **No canonical tag in the HTML** — on any page, for the same reason.
18. **Canonicals point at a redirect.** Where the canonical *is* emitted
    (client-side), it uses `https://funngro.com`, but the site 302-redirects
    non-www to www. So every canonical points to a URL that redirects.
19. **302 instead of 301** on the www redirect.
20. **Soft 404s.** `/nonexistent-page-xyz` and `/About` both return HTTP 200.
21. **Rating inconsistency.** The UI renders **★ 4.2**; their `MobileApplication`
    JSON-LD claims **4.6 with 70,000 ratings**; the Play Store listing returned
    by search shows **4.8 from 50,797 reviews**. Three different numbers.
22. **Legal-name inconsistency.** The static HTML's `Organization` JSON-LD says
    `"Funngro Innovations Pvt Ltd"`; the runtime bundle overrides it with
    `"Wishbanc Technologies Private Limited"`. Two legal names for one company.
23. **No `hreflang`** despite shipping three language variants.
24. **Payload.** One 636 KB (192 KB gzipped) JS bundle plus 87 KB (21 KB
    gzipped) of CSS, and 40 more route chunks. TTFB is healthy at ~256 ms, but
    nothing paints until that bundle parses.
25. **No Company page in any meaningful sense.** `/about` exists, but it is a
    founder story and a timeline. There is no mission statement, no values, no
    team beyond two people, and no careers path on the page itself.

---

## 6. What the redesign takes, and what it changes

**Kept, deliberately:**
the near-black forest-green field · the mint accent · the green pill with the
sliding arrow chip · Instrument Serif + Work Sans + JetBrains Mono, self-hosted ·
the four-line roman/italic headline pattern · the kicker/mono-label system ·
rounded-2xl panels over a 4px base radius · the direct, money-positive voice ·
the real numbers, the real founders and the real city names.

**Changed, deliberately:**
seven nav links → three · italic-serif body copy → Work Sans · invented italic
→ a real italic face · two-node headline → four explicit lines · 80/112px
section rhythm → 88–148px · a 13px payout pill → a serif display figure on its
own panel · four dense rows → six scannable cards · four footer columns → three ·
no focus styles → a mint focus ring on everything · no skip link → one ·
no reduced-motion support → full support · and the `--radius` lifted from 4px
to 16px so panels read as deliberate surfaces.

**Added, because it was missing:** a real Company page with a mission, a
values section, a team section and a careers path — the page the brief asks for
and the page their site does not have.
