import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // TRON custom colors
        neon: {
          cyan: "oklch(0.85 0.2 196 / <alpha-value>)",
          blue: "oklch(0.65 0.18 255 / <alpha-value>)",
          amber: "oklch(0.82 0.19 80 / <alpha-value>)",
          green: "oklch(0.78 0.19 155 / <alpha-value>)",
          red: "oklch(0.62 0.22 15 / <alpha-value>)",
        },
        tron: {
          dark: "oklch(0.06 0.015 240)",
          darker: "oklch(0.04 0.01 240)",
          panel: "oklch(0.09 0.02 240)",
          surface: "oklch(0.12 0.03 240)",
          border: "oklch(0.25 0.07 210)",
          "border-dim": "oklch(0.15 0.04 220)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
        display: ["Outfit", "system-ui", "sans-serif"],
        data: ["Geist Mono", "JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0",
      },
      boxShadow: {
        "neon-cyan": "0 0 8px oklch(0.85 0.2 196 / 0.4), 0 0 24px oklch(0.85 0.2 196 / 0.15)",
        "neon-cyan-strong": "0 0 16px oklch(0.85 0.2 196 / 0.7), 0 0 40px oklch(0.85 0.2 196 / 0.3)",
        "neon-blue": "0 0 8px oklch(0.65 0.18 255 / 0.4), 0 0 24px oklch(0.65 0.18 255 / 0.15)",
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 8px oklch(0.85 0.2 196 / 0.4), 0 0 20px oklch(0.85 0.2 196 / 0.15)",
          },
          "50%": {
            boxShadow: "0 0 16px oklch(0.85 0.2 196 / 0.7), 0 0 40px oklch(0.85 0.2 196 / 0.3)",
          },
        },
        flicker: {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.8" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.9" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-6px)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "grid-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        flicker: "flicker 8s infinite",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "grid-pulse": "grid-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
