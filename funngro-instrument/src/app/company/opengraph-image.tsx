import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph card for /company.
 *
 * Same system as the home card, different composition: this page argues with
 * the record rather than the product, so the card is typographic with a
 * release-notes strip instead of a status row.
 *
 * Same two satori constraints as the home card — WOFF not WOFF2, and no glyphs
 * outside the Latin subset (so "INR", not the rupee sign).
 */
export const runtime = "nodejs";
export const alt =
  "Funngro — a company built by two IIM graduates for 70 lakh Indian teenagers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src", "assets", "fonts");
const serif = readFileSync(join(fontDir, "instrument-serif-400.woff"));
const serifItalic = readFileSync(
  join(fontDir, "instrument-serif-italic-400.woff"),
);
const sans = readFileSync(join(fontDir, "work-sans-400.woff"));
const sansBold = readFileSync(join(fontDir, "work-sans-700.woff"));

const RELEASES = [
  { v: "v0.1", d: "2022" },
  { v: "v0.5", d: "Dec 2022" },
  { v: "v1.0", d: "2023" },
  { v: "v2.0", d: "2024" },
  { v: "v3.0", d: "2026" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06130a",
          padding: "60px 68px",
          fontFamily: "Work Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 40,
              color: "#e7f3eb",
              letterSpacing: "-0.02em",
            }}
          >
            Funngro
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(93,221,150,0.35)",
              borderRadius: 9999,
              padding: "10px 22px",
              color: "#5ddd96",
              fontSize: 19,
              letterSpacing: "0.14em",
            }}
          >
            COMPANY
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Instrument Serif",
            fontSize: 70,
            lineHeight: 1.03,
            letterSpacing: "-0.025em",
            color: "#e7f3eb",
          }}
        >
          <div style={{ display: "flex" }}>A company built by</div>
          <div style={{ display: "flex" }}>two IIM graduates</div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              color: "#5ddd96",
            }}
          >
            for 70 lakh Indian
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              color: "#5ddd96",
            }}
          >
            teenagers.
          </div>
        </div>

        {/* release-notes strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            borderTop: "1px solid rgba(38,52,42,1)",
            paddingTop: 28,
            fontSize: 19,
            color: "#7d9785",
          }}
        >
          {RELEASES.map((r, i) => (
            <div
              key={r.v}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: i === RELEASES.length - 1 ? "#5ddd96" : "#7d9785",
              }}
            >
              <div style={{ display: "flex" }}>{r.v}</div>
              <div style={{ display: "flex", color: "#26342a" }}>/</div>
              <div style={{ display: "flex" }}>{r.d}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal" as const },
        {
          name: "Instrument Serif",
          data: serifItalic,
          style: "italic" as const,
        },
        { name: "Work Sans", data: sans, weight: 400 as const },
        { name: "Work Sans", data: sansBold, weight: 700 as const },
      ],
    },
  );
}
