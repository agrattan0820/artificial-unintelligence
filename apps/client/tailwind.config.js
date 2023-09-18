/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        space: ["var(--font-space)", ...fontFamily.sans],
      },
      keyframes: {
        "blink-caret": {
          "from, to": { borderColor: "inherit" },
          "50%": { borderColor: "transparent" },
        },
        dot: {
          "0%": { opacity: 0 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        modal: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        typing: {
          from: { width: 0 },
          to: { width: "100%" },
        },
      },
      animation: {
        "dot-bounce": "dot 2s infinite",
        "dot-bounce-2": "dot 2s infinite .25s",
        "dot-bounce-3": "dot 2s infinite .5s",
        modal: "modal 300ms ease-in-out",
        typewriter:
          "typing 3.5s steps(40, end), blink-caret .75s step-end infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
