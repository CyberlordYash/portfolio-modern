import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/* ── Warm ink ramp ──────────────────────────────────────────────────
   Paper at the light end, ink at the dark end, a few points of yellow
   held through the middle so it never goes cold against the newsprint
   ground.

   The previous ramp was a cool graphite drawn for a black page: its
   900/950 steps were #19191C and #0E0E10, which is why any section
   still carrying `bg-blue-900` painted a black slab. Re-pointing the
   ramp here converts every one of those call sites at once, so the
   un-restyled sections degrade to warm grey instead of fighting the
   paper while the revamp works through them. */
const INK_RAMP = {
  "50": "#F7F6F2",
  "100": "#EFEDE7",
  "200": "#E1DED4",
  "300": "#C6C3B8",
  "400": "#A3A199",
  "500": "#8C8A80",
  "600": "#6F6D64",
  "700": "#5C5A51",
  "800": "#3A3833",
  "900": "#262520",
  "950": "#16150F",
};

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // One grotesk (Inter Tight) carries display and text alike; mono is
        // for marginalia; the serif appears italic, lowercase, and rarely.
        sans: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
        // Retired faces. Aliased onto the grotesk so the ~40 remaining
        // `font-Orbitron` / `font-Quicksand` call sites across the
        // sub-pages convert with the theme instead of after it.
        Quicksand: ["var(--font-display)", "sans-serif"],
        Orbitron: ["var(--font-display)", "sans-serif"],
      },
      // ── Type scale ───────────────────────────────────────────────
      // Named steps replacing the ad-hoc text-[7px]…text-[15px] sprawl.
      // 10px is the floor — below that, wide-tracked uppercase mono is
      // illegible. Line-height and tracking travel with the size so the
      // vertical rhythm stays consistent wherever a step is used.
      fontSize: {
        tick: ["0.625rem", { lineHeight: "1.1", letterSpacing: "0.28em" }],
        micro: ["0.6875rem", { lineHeight: "1.35", letterSpacing: "0.24em" }],
        label: ["0.75rem", { lineHeight: "1.45", letterSpacing: "0.16em" }],
        meta: ["0.8125rem", { lineHeight: "1.6", letterSpacing: "0.03em" }],
        body: ["0.875rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        "body-lg": ["0.9375rem", { lineHeight: "1.75" }],
      },
      colors: {
        // ── Theme-aware duo ───────────────────────────────────────
        // `ink` is the foreground, `paper` the ground, and they swap
        // between light and dark. Using them instead of literal
        // white/black means one class works in both themes:
        //   text-ink/70   → black at 70% on light, white at 70% on dark
        //   bg-paper/40   → white at 40% on light, black at 40% on dark
        // The rgb(... / <alpha-value>) form is what preserves Tailwind's
        // slash-opacity syntax through the CSS variable.
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        // ── Swiss editorial tokens ─────────────────────────────────
        // Named steps, so a component never has to guess an opacity for
        // "secondary text" or "a hairline" again.
        ink2: "var(--ink-2)",
        ink3: "var(--ink-3)",
        paper2: "var(--paper-2)",
        paper3: "var(--paper-3)",
        rule: "var(--rule)",
        rule2: "var(--rule-strong)",
        // The single accent. See --mark in globals.css for why it isn't
        // called `accent` (shadcn's base layer already owns that name).
        mark: "var(--mark)",
        // Hueless accent pair, flipped per theme, for the HUD chrome that
        // used to hard-code #D8D8DC / #91919A (invisible on white).
        hud: {
          DEFAULT: "rgb(var(--hud-rgb) / <alpha-value>)",
          dim: "rgb(var(--hud-dim-rgb) / <alpha-value>)",
        },
        // `text-black` / `bg-white` appear in the hundreds across the
        // un-converted sections. Re-pointing the two defaults at the
        // real ink and paper means those call sites land on the warm
        // palette rather than punching pure #000 into newsprint.
        black: {
          "100": INK_RAMP["950"],
          "200": INK_RAMP["800"],
          "300": "var(--rule)",
          DEFAULT: "#16150F",
        },
        white: {
          "100": INK_RAMP["200"],
          "200": INK_RAMP["100"],
          DEFAULT: "#F2F1EC",
        },
        // Every former navy/indigo/cyan/graphite family collapses onto
        // the one warm ink ramp, so no call site can reintroduce a hue.
        graphite: INK_RAMP,
        blue: INK_RAMP,
        sky: INK_RAMP,
        indigo: INK_RAMP,
        cyan: INK_RAMP,
        purple: INK_RAMP["400"],
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // Swiss: nothing is rounded. Overriding the whole scale (rather
      // than editing `rounded-2xl` out of forty files) makes the rule
      // structural — a corner radius can't creep back in by accident.
      // `full` survives for the genuinely circular: dots and avatars.
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "9999px",
      },
      keyframes: {
        meteor: {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100" height="100" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
