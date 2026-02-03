/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-bebas)"],
        sans: ["var(--font-spartan)", 'sans-serif'],
      },
    },
  },
  plugins: [],
};


