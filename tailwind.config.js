/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: "#fff5eb",
          100: "#fff2e5",
          200: "#ffe9d6",
          300: "#ffca9e",
          400: "#feaa77",
          500: "#fd965e",
          600: "#f98558",
          700: "#f56c42",
          800: "#eb5d3d",
          900: "#e35535",
          950: "#d33212",
        },
        matcha: {
          50: "#f2f9ec",
          100: "#e4f3d8",
          200: "#d1eabe",
          300: "#aed88d",
          400: "#8dc567",
          500: "#71b643",
          600: "#5b9c35",
          700: "#4c7e30",
          800: "#466f2f",
          900: "#40652f",
          950: "#2a4a1c",
        },
        cove: {
          50: "#f4f6fa",
          100: "#e5e7f4",
          200: "#d2d7eb",
          300: "#b3bddd",
          400: "#8e9bcc",
          500: "#7e88c3",
          600: "#6066b0",
          700: "#5557a0",
          800: "#494984",
          900: "#3e406a",
          950: "#292942",
        },
        lilac: {
          50: "#f9f7fb",
          100: "#f3f0f7",
          200: "#e8e3f1",
          300: "#d7cce6",
          400: "#c3afd6",
          500: "#b296c9",
          600: "#9b73b4",
          700: "#8961a0",
          800: "#735186",
          900: "#5e446e",
          950: "#3e2b4a",
        },
      },
      // fontFamily: {
      //   sans: ["var(--font-playfairDisplay)", ...fontFamily.sans],
      // },
      keyframes: {
        letterFadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".letter-fade-in": {
          animation: "letterFadeIn 1s both",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
