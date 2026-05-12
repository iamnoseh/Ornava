import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: "#7A1F1F",
          paper: "#E8DCCB",
          bronze: "#5C4632",
          gold: "#C9A227",
          black: "#0F0F0F",
        },
      },
      boxShadow: {
        glow: "0 24px 90px rgba(201, 162, 39, 0.16)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.32)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
