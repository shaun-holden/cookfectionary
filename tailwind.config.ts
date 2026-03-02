import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff8f0",
          100: "#ffeddb",
          200: "#ffd7b3",
          300: "#ffbb80",
          400: "#ff934d",
          500: "#f97316",
          600: "#ea6c0a",
          700: "#c2570b",
          800: "#9a4511",
          900: "#7c3a12",
        },
        cream: "#FFF8F0",
        dark:  "#1a1209",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body:    ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
