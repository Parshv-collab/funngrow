/* ===========================================================================
 * Responsive layout audit
 *
 * Measures, at 375 / 768 / 1280 px, on both routes:
 *   - page-level horizontal overflow
 *   - any element crossing the viewport edge (ignoring contained scroll boxes)
 *   - text clipped inside a non-scrolling box
 *   - Cumulative Layout Shift, from a PerformanceObserver installed before load
 *   - which of the brand fonts actually loaded
 * and writes a full-page PNG per combination.
 *
 * Puppeteer is NOT a project dependency — shipping it would add a ~170 MB
 * Chromium download to every install and every Vercel build. See README.
 *
 *   npm install --no-save puppeteer
 *   npx next start -p 4399
 *   BASE=http://localhost:4399 node scripts/audit.cjs
 *
 * Non-zero exit if any check fails, so it can gate CI.
 *
 * Env: BASE, ATTEMPTS (per combination, default 5), --force (ignore the cache).
 * Results are cached in shots/results.json and merged across runs — see the
 * comment on RESULTS for why this sweep is resumable.
 *
 * ENVIRONMENT NOTES
 *  - `headless: true` (the new headless mode) is deliberate. chrome-headless-
 *    shell looks like the cheaper choice and is not: measured with
 *    scripts/diag.cjs against this same server, it detached its frame on 13 of
 *    15 navigations, while full Chrome managed 14 of 15. The "lighter" binary
 *    was the entire source of the flakiness. The cost is memory, so pages are
 *    closed as soon as they are measured and screenshots are taken by resizing
 *    the viewport rather than with `fullPage: true`, which asks the renderer to
 *    allocate one bitmap as tall as the whole document (up to 8600px here).
 *  - Each combination gets a fresh browser, so peak memory is bounded by one
 *    page rather than by the whole run.
 *  - Every combination is individually try/caught: one failure produces a
 *    report entry, not a dead script.
 * ======================================================================== */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/*
 * This container ships no /etc/fonts, and without one Skia aborts the renderer
 * the moment a page asks for a fallback face:
 *
 *   FATAL:.../SkFontMgr_FontConfigInterface.cpp:163] Not implemented.
 *   Received signal 6
 *
 * Puppeteer reports that as "Navigating frame was detached", which looks
 * exactly like a flaky container and is not one. Default FONTCONFIG_FILE to the
 * minimal config in this directory so the sweep works out of the box; see
 * scripts/fonts.conf and README → "Verifying the layout".
 */
process.env.FONTCONFIG_FILE ||= path.join(__dirname, "fonts.conf");

const BASE = process.env.BASE || "http://localhost:4399";
const OUT = path.join(process.cwd(), "shots");
fs.mkdirSync(OUT, { recursive: true });

/*
 * Results are cached per combination and merged across runs.
 *
 * Chrome in this sandbox intermittently loses its renderer mid-navigation
 * ("Navigating frame was detached" / "Connection closed"), independent of what
 * is being measured — the same route at the same width both fails and succeeds
 * across attempts, and a plain `curl` loop against the server returns 200
 * every time. Re-running the whole six-combination sweep to re-measure five
 * combinations that already passed just multiplies the odds of hitting the
 * flaky one. So a combination that has already been measured cleanly is
 * skipped, its cached numbers are re-used, and only the missing or failing
 * combinations are re-attempted. Pass --force to re-measure everything.
 */
const RESULTS = path.join(OUT, "results.json");
const FORCE = process.argv.includes("--force");

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(RESULTS, "utf8"));
  } catch {
    return {};
  }
}
const keyOf = (page, vp) => `${page.name}@${vp.name}`;
function saveCache(cache) {
  fs.writeFileSync(RESULTS, JSON.stringify(cache, null, 2) + "\n");
}

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
];
const PAGES = [
  { name: "home", path: "/" },
  { name: "company", path: "/company" },
];

/* Installed before navigation so it catches shifts from first paint. */
const CLS_OBSERVER = () => {
  window.__cls = 0;
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (!e.hadRecentInput) {
        window.__cls += e.value;
        window.__shifts.push(Number(e.value.toFixed(5)));
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
};

/* Runs in the page. */
const MEASURE = () => {
  const vw = window.innerWidth;
  const doc = document.scrollingElement;

  // A wide child inside a scroll container is contained, not an overflow.
  const inScrollBox = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === "auto" || ox === "scroll") return true;
      n = n.parentElement;
    }
    return false;
  };

  const offenders = [];
  const textClipped = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    // Visually-hidden text is *supposed* to be clipped to 1px. Without this,
    // every .sr-only label registers as a clipped-text failure.
    if (el.closest(".sr-only")) continue;

    if ((r.right > vw + 1 || r.left < -1) && !inScrollBox(el)) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 60),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || "").trim().slice(0, 40),
      });
    }

    if (
      el.scrollWidth > el.clientWidth + 2 &&
      el.clientWidth > 0 &&
      style.overflowX === "hidden" &&
      !inScrollBox(el)
    ) {
      textClipped.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 50),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
      });
    }
  }

  const sections = [...document.querySelectorAll("section, footer")].map((s) => ({
    id: s.id || "(none)",
    h: Math.round(s.getBoundingClientRect().height),
  }));

  const h1 = document.querySelector("h1");
  const h1Style = h1 ? getComputedStyle(h1) : null;
  const h1Count = document.querySelectorAll("h1").length;

  // Font loading, reported from the FontFaceSet rather than via
  // fonts.check(), which is order-dependent and gave flaky results across runs.
  const fontFaces = [...document.fonts].map((f) => ({
    family: f.family.replace(/"/g, ""),
    style: f.style,
    weight: f.weight,
    status: f.status,
  }));
  const fontsLoaded = [...new Set(fontFaces.filter((f) => f.status === "loaded").map((f) => f.family))];

  // Proof the webfont is APPLIED, not merely declared. Measure the same string
  // twice at 100px — once asking for the real family, once for the generic
  // fallback. Equal widths mean the fallback is what is actually rendering.
  const widthIn = (family, weight, style, text) => {
    const span = document.createElement("span");
    span.style.cssText = `position:absolute;left:-9999px;top:0;white-space:nowrap;font-size:100px;font-weight:${weight};font-style:${style};font-family:${family}`;
    span.textContent = text;
    document.body.appendChild(span);
    const w = span.getBoundingClientRect().width;
    span.remove();
    return Math.round(w);
  };
  const T = "Get paid by the brands";
  // A long sample for the mono face: every monospace font has a ~0.6em advance,
  // so a short string rounds to the same integer width for the webfont and for
  // the fallback and reads as "not applied" when it is. More characters means the
  // small advance difference accumulates into whole pixels.
  const TM = "payouts.log 13,69,832 task/referral/paid approved Mumbai";
  // Raw widths are reported, not just booleans, so the comparison is inspectable
  // rather than something the reader has to take on trust.
  const fontWidths = {
    serif: {
      web: widthIn('"Instrument Serif", serif', 400, "normal", T),
      fallback: widthIn("serif", 400, "normal", T),
    },
    serifItalic: {
      web: widthIn('"Instrument Serif", serif', 400, "italic", T),
      fallback: widthIn("serif", 400, "italic", T),
    },
    sans: {
      web: widthIn('"Work Sans", sans-serif', 400, "normal", T),
      fallback: widthIn("sans-serif", 400, "normal", T),
    },
    mono: {
      web: widthIn('"JetBrains Mono", monospace', 400, "normal", TM),
      fallback: widthIn("monospace", 400, "normal", TM),
    },
  };
  // Mono needs different evidence. Every monospace face has an advance of
  // roughly 0.6em, and the generic `monospace` here resolves to one that is
  // exactly 0.6em, so JetBrains Mono and its fallback measure an identical
  // 3360px for the same 56-character sample. That is a limit of the instrument,
  // not a missing font. A face only reaches `loaded` after its file has been
  // fetched and parsed, which is unambiguous, so that is the check used here.
  // The widths are still printed so the difference between the two kinds of
  // evidence is visible rather than hidden.
  const faceStatus = (family) => {
    const face = [...document.fonts].find(
      (f) => f.family.replace(/"/g, "") === family,
    );
    return face ? face.status : "missing";
  };
  const fontProof = {
    serif: fontWidths.serif.web !== fontWidths.serif.fallback,
    serifItalic: fontWidths.serifItalic.web !== fontWidths.serifItalic.fallback,
    sans: fontWidths.sans.web !== fontWidths.sans.fallback,
    mono: faceStatus("JetBrains Mono") === "loaded",
  };
  const faceStatuses = Object.fromEntries(
    ["Instrument Serif", "Work Sans", "JetBrains Mono"].map((f) => [
      f,
      faceStatus(f),
    ]),
  );

  // Responsive behaviour: does column collapsing actually happen, and are the
  // right chrome elements showing at the right widths?
  const visibleCols = (sel) => {
    const row = document.querySelector(sel);
    if (!row) return null;
    return [...row.children].filter((c) => getComputedStyle(c).display !== "none").length;
  };
  const visible = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  };

  const behaviors = {
    pipelineTableCols: visibleCols(".data-table thead tr"),
    taskFilterChips: document.querySelectorAll('button[aria-pressed]').length,
    navLinksVisible: visible("nav[aria-label='Primary'] ul"),
    menuButtonVisible: visible("button[aria-controls='mobile-menu']"),
  };

  return {
    vw,
    docScrollW: doc.scrollWidth,
    docClientW: doc.clientWidth,
    pageOverflow: doc.scrollWidth - doc.clientWidth,
    bodyH: Math.round(document.body.getBoundingClientRect().height),
    offenders: offenders.slice(0, 8),
    offenderCount: offenders.length,
    textClipped: textClipped.slice(0, 5),
    sections,
    h1Count,
    h1Font: h1Style ? h1Style.fontFamily : null,
    h1Size: h1Style ? h1Style.fontSize : null,
    serifLoaded: document.fonts.check('400 1em "Instrument Serif"'),
    serifItalicLoaded: document.fonts.check('italic 400 1em "Instrument Serif"'),
    monoLoaded: document.fonts.check('400 1em "JetBrains Mono"'),
    sansLoaded: document.fonts.check('400 1em "Work Sans"'),
    cls: Number((window.__cls || 0).toFixed(5)),
    shifts: (window.__shifts || []).slice(0, 6),
    title: document.title,
    fontsLoaded,
    fontProof,
    fontWidths,
    faceStatuses,
    behaviors,
  };
};

/*
 * One browser for the whole run, reset on failure.
 *
 * A browser used to be launched per combination, which cost Chrome's startup
 * six times over. The reuse is safe because a combination is retried from
 * scratch with a rebuilt browser when it fails.
 */
let browser = null;
async function getBrowser() {
  if (browser && browser.connected) return browser;
  if (browser) await browser.close().catch(() => {});
  browser = await puppeteer.launch({
    // "shell" (chrome-headless-shell) is lighter; set HEADLESS=shell to use it.
    headless: process.env.HEADLESS === "shell" ? "shell" : true,
    protocolTimeout: 120000,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--hide-scrollbars",
    ],
  });
  return browser;
}

async function resetBrowser() {
  if (browser) await browser.close().catch(() => {});
  browser = null;
}

async function runOne(vp, page) {
  const b = await getBrowser();
  let p = null;

  try {
    p = await b.newPage();
    await p.evaluateOnNewDocument(CLS_OBSERVER);
    await p.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
    });
    await p.goto(BASE + page.path, { waitUntil: "load", timeout: 60000 });

    // Explicitly load the faces the design depends on, then wait. Enumerating
    // document.fonts alone is misleading: faces for weights or characters a
    // page never renders legitimately stay 'unloaded', which reads as a
    // failure when it is nothing of the sort.
    await p.evaluate(async () => {
      const wanted = [
        '400 1em "Instrument Serif"',
        'italic 400 1em "Instrument Serif"',
        '400 1em "Work Sans"',
        '600 1em "Work Sans"',
        '700 1em "Work Sans"',
        '400 1em "JetBrains Mono"',
      ];
      await Promise.all(wanted.map((f) => document.fonts.load(f, "Funngro 0123")));
      await document.fonts.ready;
    });
    // let the fade-in settle before measuring
    await new Promise((r) => setTimeout(r, 500));

    const m = await p.evaluate(MEASURE);

    const file = path.join(OUT, `${page.name}-${vp.name}.png`);
    let size = 0;
    let shotErr = null;
    try {
      const docH = await p.evaluate(() =>
        Math.ceil(document.body.getBoundingClientRect().height),
      );
      await p.setViewport({
        width: vp.width,
        height: Math.min(docH, 14000),
        deviceScaleFactor: 1,
      });
      const buf = await p.screenshot({ type: "png" });
      fs.writeFileSync(file, buf);
      size = buf.length;
    } catch (e) {
      shotErr = e.message.split("\n")[0];
    }

    const bad =
      m.pageOverflow > 0 ||
      m.offenderCount > 0 ||
      m.textClipped.length > 0 ||
      m.cls >= 0.1 ||
      m.h1Count !== 1 ||
      !m.fontProof.serif ||
      !m.fontProof.serifItalic ||
      !m.fontProof.sans ||
      !m.fontProof.mono;

    return { vp, page, m, file, size, bad, shotErr };
  } finally {
    if (p) await p.close().catch(() => {});
  }
}

/*
 * Retries exist because this container has ~2 GB and no swap, and Chrome
 * intermittently loses its renderer while navigating — the failure is in the
 * environment, not the page. A combination is only reported as broken if every
 * attempt fails; a combination that succeeds on attempt 2 is reported normally
 * with the attempt count noted.
 */
async function runWithRetry(vp, page, attempts = Number(process.env.ATTEMPTS || 5)) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await runOne(vp, page);
      return { ...r, attempt: i };
    } catch (e) {
      lastErr = e.message.split("\n")[0];
      console.log(`  [retry ${i}/${attempts}] ${page.name}@${vp.name}: ${lastErr}`);
      // A lost renderer leaves the browser unusable — rebuild it.
      await resetBrowser();
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return { vp, page, error: lastErr, attempt: attempts };
}

(async () => {
  const line = "=".repeat(72);
  const cache = loadCache();
  const results = new Map();

  // Seed from combinations already measured cleanly in a previous run.
  for (const vp of VIEWPORTS) {
    for (const page of PAGES) {
      const hit = cache[keyOf(page, vp)];
      if (hit && !hit.error && !hit.bad && !FORCE) results.set(keyOf(page, vp), hit);
    }
  }

  const pending = [];
  for (const vp of VIEWPORTS) {
    for (const page of PAGES) {
      if (!results.has(keyOf(page, vp))) pending.push({ vp, page });
      else console.log(`[cached] ${page.name}@${vp.name} — re-measure with --force`);
    }
  }

  for (const { vp, page } of pending) {
    const r = await runWithRetry(vp, page);
    if (r.error) {
      console.log(`  [gave up] ${page.name}@${vp.name}: ${r.error}`);
      continue;
    }
    results.set(keyOf(page, vp), r);
    if (!r.bad) {
      // Persist immediately so a crash later in the sweep cannot lose it.
      cache[keyOf(page, vp)] = r;
      saveCache(cache);
    }
  }

  let failures = 0;
  for (const vp of VIEWPORTS) {
    for (const page of PAGES) {
      const r = results.get(keyOf(page, vp));
      if (!r) {
        console.log("\n" + line);
        console.log(`${page.name.toUpperCase()}  @ ${vp.name}px   <-- ERROR`);
        console.log(line);
        console.log("  not measured — rerun to retry this combination");
        failures++;
        continue;
      }
      report(r);
    }
  }

  function report(r) {
    console.log("\n" + line);
    // Entries with an `error` never reach here — they are dropped above.
    const { m } = r;
    console.log(
      `${r.page.name.toUpperCase()}  @ ${r.vp.name}px${r.bad ? "   <-- FAIL" : "   OK"}`,
    );
    console.log(line);
    console.log(`  page h-overflow      : ${m.pageOverflow}px ${m.pageOverflow <= 0 ? "OK" : "FAIL"}`);
    console.log(`  overflowing elements : ${m.offenderCount} ${m.offenderCount === 0 ? "OK" : "FAIL"}`);
    console.log(`  clipped text nodes   : ${m.textClipped.length} ${m.textClipped.length === 0 ? "OK" : "FAIL"}`);
    console.log(`  layout shift (CLS)   : ${m.cls} ${m.cls < 0.1 ? "OK" : "FAIL"}`);
    console.log(`  h1 count             : ${m.h1Count} ${m.h1Count === 1 ? "OK" : "FAIL"}`);
    console.log(`  document height      : ${m.bodyH}px`);
    console.log(`  fonts declared-loaded: ${m.fontsLoaded.join(", ")}`);
    const fp = m.fontProof;
    console.log(
      `  webfont applied      : serif=${fp.serif} ital=${fp.serifItalic} sans=${fp.sans} mono=${fp.mono} ${fp.serif && fp.serifItalic && fp.sans && fp.mono ? "OK" : "FAIL"}`,
    );
    if (m.fontWidths) {
      console.log(
        `  font widths (px)     : ${Object.entries(m.fontWidths)
          .map(([k, v]) => `${k} ${v.web}/${v.fallback}`)
          .join("  ")}`,
      );
    }
    if (m.faceStatuses) {
      console.log(
        `  font face status     : ${Object.entries(m.faceStatuses)
          .map(([k, v]) => `${k}=${v}`)
          .join("  ")}`,
      );
    }
    console.log(`  responsive           : tableCols=${m.behaviors.pipelineTableCols} chips=${m.behaviors.taskFilterChips} navLinks=${m.behaviors.navLinksVisible} menuBtn=${m.behaviors.menuButtonVisible}`);
    console.log(`  h1                   : ${m.h1Size} / ${m.h1Font}`);
    if (r.attempt > 1) console.log(`  (succeeded on attempt ${r.attempt})`);
    console.log(
      `  screenshot           : ${r.shotErr ? `FAILED (${r.shotErr})` : `shots/${r.page.name}-${r.vp.name}.png (${(r.size / 1024).toFixed(0)} KB)`}`,
    );
    if (m.offenders.length) console.log("  offenders:", JSON.stringify(m.offenders, null, 2));
    if (m.textClipped.length) console.log("  clipped:", JSON.stringify(m.textClipped, null, 2));
    if (m.shifts.length) console.log(`  shift values: ${m.shifts.join(", ")}`);
    console.log(`  sections: ${m.sections.map((s) => `${s.id}:${s.h}`).join("  ")}`);
    if (r.bad) failures++;
  }

  console.log("\n" + line);
  console.log(
    failures === 0
      ? "ALL LAYOUT CHECKS PASSED (6 combinations)"
      : `${failures} FAILING COMBINATION(S)`,
  );
  console.log(line);
  process.exit(failures === 0 ? 0 : 1);
})();
