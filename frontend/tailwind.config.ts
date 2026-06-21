import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        paper: "#f7f8f3",
        line: "#d8ddcf",
        teal: "#147d73",
        saffron: "#c98218",
        berry: "#8c2f55",
      },
      boxShadow: {
        panel: "0 10px 30px rgba(24, 33, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
