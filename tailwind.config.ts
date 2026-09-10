import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0A051B",
          900: "#0F0826",
          800: "#180F35",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          soft: "#A855F7",
        },
        magenta: {
          DEFAULT: "#D946EF",
        },
        ultra: {
          DEFAULT: "#6366F1",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "glow-violet": "0 0 40px -8px rgba(139,92,246,0.55)",
        "glow-magenta": "0 0 40px -8px rgba(217,70,239,0.5)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(6px)" },
          "100%": { transform: "translateY(0px) translateX(0px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
