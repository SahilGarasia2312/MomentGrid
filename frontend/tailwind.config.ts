import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Class-based dark mode — toggled by adding/removing .dark on <html>
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Brand Palette (mode-stable) ─────────────────────────────────
        // ── Brand Palette (mode-stable) ─────────────────────────────────
        brand: {
          primary:  "#D4A052",   // Golden
          accent:   "#E5B873",   // Pale Golden
          secondary:"#121111",   // Black Tie
          emerald:        "#234F60", // Sapphire
          emeraldLight:   "#35677B", // Lighter Sapphire
          emeraldSubtle:  "var(--color-emerald-subtle)",  // adaptive
          burgundy:       "#234F60", // Sapphire deep tie
          burgundyLight:  "#3D6B7E",
          burgundySubtle: "var(--color-burgundy-subtle)", // adaptive
          obsidian: "#121111", // Black Tie
          charcoal: "#1D262B", // Sapphire-laced Black Tie
          goldSubtle: "var(--color-gold-subtle)",         // adaptive
        },

        // ── Adaptive Surfaces (CSS-var backed, flip in dark mode) ───────
        surface: {
          0: "var(--color-surface-0)",
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
          3: "var(--color-surface-3)",
        },

        // ── Adaptive Borders ────────────────────────────────────────────
        borderColor: {
          DEFAULT: "var(--color-border)",
          strong:  "var(--color-border-strong)",
        },

        // ── Adaptive Text ───────────────────────────────────────────────
        textPalette: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary:  "var(--color-text-tertiary)",
          inverse:   "var(--color-text-inverse)",
          brand:     "var(--color-text-brand)",
          emerald:   "var(--color-emerald-text)",  // adaptive bright/dark
          burgundy:  "var(--color-burgundy-text)", // adaptive bright/dark
        },
      },

      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans:    ["Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "Menlo", "monospace"],
      },

      boxShadow: {
        // Golden glow
        glow:         "0 0 0 1px rgba(212,160,82,0.18), 0 4px 24px rgba(212,160,82,0.22)",
        "glow-lg":    "0 0 0 1px rgba(212,160,82,0.22), 0 8px 40px rgba(212,160,82,0.38)",
        // Sapphire glow
        "glow-emerald":    "0 0 0 1px rgba(35,79,96,0.30), 0 4px 28px rgba(35,79,96,0.32)",
        "glow-emerald-lg": "0 0 0 1px rgba(35,79,96,0.25), 0 8px 40px rgba(35,79,96,0.40)",
        // Burgundy/Deep tie glow
        "glow-burgundy":    "0 0 0 1px rgba(35,79,96,0.30), 0 4px 28px rgba(35,79,96,0.32)",
        // Card elevation
        card:  "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.12)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)"   },
          "50%":      { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.25" },
          "50%":      { opacity: "0.55" },
        },
        themeIconIn: {
          from: { opacity: "0", transform: "scale(0.6) rotate(-30deg)" },
          to:   { opacity: "1", transform: "scale(1) rotate(0deg)"     },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        float:        "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "theme-icon": "themeIconIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },

      backgroundImage: {
        "gradient-gold":    "linear-gradient(135deg, #E5B873 0%, #D4A052 50%, #B08039 100%)",
        "gradient-emerald": "linear-gradient(135deg, #35677B 0%, #234F60 100%)",
        "gradient-burgundy":"linear-gradient(135deg, #234F60 0%, #121111 100%)",
        "gradient-obsidian":"linear-gradient(135deg, #121111 0%, #1D262B 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
