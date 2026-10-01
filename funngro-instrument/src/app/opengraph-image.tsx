import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph card for /.
 *
 * Generated at build time rather than shipped as an exported PNG, so the card
 * can never drift out of sync with the headline. It reads the same fonts the
 * pages use from src/assets/fonts.
 *
 * TWO CONSTRAINTS WORTH KNOWING
 *  1. Satori parses WOFF/TTF/OTF — not WOFF2 — so these are the .woff builds.
 *  2. Characters outside the Latin subset have no glyph, and satori responds by
 *     trying to download a fallback font at render time, which turns a pure
 *     build into a network-dependent one. So this card writes "INR" instead of
 *     the rupee sign and uses words instead of a star glyph.
 */
export const runtime = "nodejs";
export const alt =
  "Funngro — the payout pipeline, live task statuses and 70 lakh young Indians earning.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src", "assets", "fonts");
const serif = readFileSync(join(fontDir, "instrument-serif-400.woff"));
const serifItalic = readFileSync(
  join(fontDir, "instrument-serif-italic-400.woff"),
);
const sans = readFileSync(join(fontDir, "work-sans-400.woff"));
const sansBold = readFileSync(join(fontDir, "work-sans-700.woff"));

/** Mirrors the status colours used across the site. */
const PILLS = [
  { label: "OPEN", hex: "#5ddd96", count: "12" },
  { label: "SUBMITTED", hex: "#e8c547", count: "4" },
  { label: "APPROVED", hex: "#5b9cff", count: "9" },
  { label: "PAID", hex: "#07ab5f", count: "23" },
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
        {/* top: wordmark + live readout */}
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
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(38,52,42,1)",
              borderRadius: 9999,
              padding: "10px 22px",
              color: "#5ddd96",
              fontSize: 19,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                backgroundColor: "#5ddd96",
              }}
            />
            <div style={{ display: "flex" }}>INR 13,69,832 THIS WEEK</div>
          </div>
        </div>

        {/* the four-line headline pattern */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Instrument Serif",
            fontSize: 68,
            lineHeight: 1.03,
            letterSpacing: "-0.025em",
            color: "#e7f3eb",
          }}
        >
          <div style={{ display: "flex" }}>Get paid by the brands</div>
          <div style={{ display: "flex" }}>you already use.</div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              color: "#5ddd96",
            }}
          >
            70 lakh young Indians
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              color: "#5ddd96",
            }}
          >
            already are.
          </div>
        </div>

        {/* bottom: the status row that defines this design */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderTop: "1px solid rgba(38,52,42,1)",
            paddingTop: 28,
          }}
        >
          {PILLS.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: `1px solid ${p.hex}59`,
                borderRadius: 6,
                padding: "9px 15px",
                color: p.hex,
                fontSize: 19,
                letterSpacing: "0.08em",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: p.hex,
                }}
              />
              <div style={{ display: "flex" }}>
                {p.label} {p.count}
              </div>
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
