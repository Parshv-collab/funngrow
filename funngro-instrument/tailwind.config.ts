import type { Config } from "tailwindcss";

/**
 * Every colour resolves to a CSS custom property in src/app/globals.css.
 *
 * Two groups:
 *  - The brand tokens, which are the real Funngro values (RESEARCH.md §2).
 *  - The status set, which is the one addition this design makes. Their current
 *    site uses green and mint for everything, so nothing can signal anything.
 *    Functional colour is what makes a dashboard grammar possible.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        "frame-border": "hsl(var(--frame-border) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        "prose-soft": "hsl(var(--prose-soft) / <alpha-value>)",

        // Functional status colour. Used ONLY for state indicators — never
        // for decoration. See src/content/status.ts.
        "status-open": "hsl(var(--status-open) / <alpha-value>)",
        "status-submitted": "hsl(var(--status-submitted) / <alpha-value>)",
        "status-approved": "hsl(var(--status-approved) / <alpha-value>)",
        "status-paid": "hsl(var(--status-paid) / <alpha-value>)",
        "status-rejected": "hsl(var(--status-rejected) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "ui-serif", "Georgia", "serif"],
        sans: ["Work Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        panel: "16px",
        chip: "6px",
        pill: "999px",
      },
      maxWidth: {
        shell: "1200px",
      },
      spacing: {
        section: "clamp(56px, 8vw, 120px)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        blink: "blink 1.1s step-end infinite",
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
