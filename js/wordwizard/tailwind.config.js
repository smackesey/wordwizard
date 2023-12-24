/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    screens: {
      tall: { raw: '(min-height: 1280px)' },
    },
  },
  plugins: [],
};
