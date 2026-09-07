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
        "off-white": "#F7F5EF",
        "near-black": "#151512",
        "olive": {
          DEFAULT: "#5A5B33",
          hover: "#494A29",
          light: "#6E6F3E",
        },
        "warm-grey": "#77766E",
        "warm-beige": "#B49A6A",
        "sand": "#EFECE2",
        "dark-surface": "#1C1C18",
      },
      fontFamily: {
        serif: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
