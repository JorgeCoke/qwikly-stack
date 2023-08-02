/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {},
    keyframes: {},
  },
  plugins: [require("tailwindcss-animate")],
};
