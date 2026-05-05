import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        focus: "hsl(var(--focus))",
        timeline: "hsl(var(--timeline))",
        memory: {
          DEFAULT: "hsl(var(--memory))",
          foreground: "hsl(var(--memory-foreground))",
        },
        reflection: {
          DEFAULT: "hsl(var(--reflection))",
          foreground: "hsl(var(--reflection-foreground))",
        },
        future: {
          DEFAULT: "hsl(var(--future))",
          foreground: "hsl(var(--future-foreground))",
        },
        imported: {
          DEFAULT: "hsl(var(--imported))",
          foreground: "hsl(var(--imported-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
        soft: "var(--radius-soft)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        panel: "var(--shadow-panel)",
      },
      fontSize: {
        "page-title": ["var(--text-page-title)", { lineHeight: "1.15" }],
        "section-title": ["var(--text-section-title)", { lineHeight: "1.25" }],
        body: ["var(--text-body)", { lineHeight: "1.5" }],
        meta: ["var(--text-meta)", { lineHeight: "1.4" }],
      },
      lineHeight: {
        reflective: "var(--leading-reflective)",
      },
      spacing: {
        "lifeline-1": "calc(var(--space-unit) * 1)",
        "lifeline-2": "calc(var(--space-unit) * 2)",
        "lifeline-3": "calc(var(--space-unit) * 3)",
        "lifeline-4": "calc(var(--space-unit) * 4)",
        "lifeline-6": "calc(var(--space-unit) * 6)",
        "lifeline-8": "calc(var(--space-unit) * 8)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
