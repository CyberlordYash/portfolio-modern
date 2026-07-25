import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const defaultTheme = require("tailwindcss/defaultTheme");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

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
        sans: ["var(--font-quicksand)", ...defaultTheme.fontFamily.sans],
        // `mono` previously resolved to Quicksand — a rounded sans — so every
        // terminal/HUD microlabel rendered proportional. Now a real mono face.
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
        Quicksand: ["var(--font-quicksand)", "sans-serif"],
        Orbitron: ["var(--font-orbitron)", "sans-serif"],
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
        black: {
          "100": "#000319",
          "200": "rgba(17, 25, 40, 0.75)",
          "300": "rgba(255, 255, 255, 0.125)",
          DEFAULT: "#000",
        },
        white: {
          "100": "#BEC1DD",
          "200": "#C1C2D3",
          DEFAULT: "#FFF",
        },
        // ── Monochrome graphite scale ──────────────────────────────
        // The accent family is intentionally hueless. A trace of cool
        // tint (~250deg at <4% sat) keeps it from reading muddy on pure
        // black without ever becoming "blue". All former navy/indigo/
        // cyan aliases now point at this one scale, so the whole UI
        // resolves to graphite-on-black with no palette drift.
        graphite: {
          "50": "#F7F7F8",
          "100": "#EDEDEF",
          "200": "#D8D8DC",
          "300": "#B7B7BE",
          "400": "#91919A",
          "500": "#6D6D76",
          "600": "#53535B",
          "700": "#3D3D44",
          "800": "#29292E",
          "900": "#19191C",
          "950": "#0E0E10",
        },
        // Legacy aliases — components still reference blue-/sky-/indigo-/
        // cyan-*. Repointing them here neutralises every call site at once
        // instead of rewriting hundreds of class names.
        blue: {
          "50": "#F7F7F8",
          "100": "#EDEDEF",
          "200": "#D8D8DC",
          "300": "#B7B7BE",
          "400": "#91919A",
          "500": "#6D6D76",
          "600": "#53535B",
          "700": "#3D3D44",
          "800": "#29292E",
          "900": "#19191C",
          "950": "#0E0E10",
        },
        sky: {
          "50": "#F7F7F8",
          "100": "#EDEDEF",
          "200": "#D8D8DC",
          "300": "#B7B7BE",
          "400": "#91919A",
          "500": "#6D6D76",
          "600": "#53535B",
          "700": "#3D3D44",
          "800": "#29292E",
          "900": "#19191C",
          "950": "#0E0E10",
        },
        indigo: {
          "50": "#F7F7F8",
          "100": "#EDEDEF",
          "200": "#D8D8DC",
          "300": "#B7B7BE",
          "400": "#91919A",
          "500": "#6D6D76",
          "600": "#53535B",
          "700": "#3D3D44",
          "800": "#29292E",
          "900": "#19191C",
          "950": "#0E0E10",
        },
        cyan: {
          "50": "#F7F7F8",
          "100": "#EDEDEF",
          "200": "#D8D8DC",
          "300": "#B7B7BE",
          "400": "#91919A",
          "500": "#6D6D76",
          "600": "#53535B",
          "700": "#3D3D44",
          "800": "#29292E",
          "900": "#19191C",
          "950": "#0E0E10",
        },
        purple: "#B7B7BE",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
