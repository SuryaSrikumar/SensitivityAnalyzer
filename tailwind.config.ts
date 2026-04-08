import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0f0f14",
          soft: "#1a1a24",
          muted: "#2a2a38",
        },
        slate: {
          border: "#2e2e42",
        },
        signal: {
          bull: "#22c55e",
          bear: "#ef4444",
          neutral: "#f59e0b",
        },
        accent: "#6366f1",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
