/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class strategy
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // custom colors can be referenced from design-tokens.css via CSS variables
    },
  },
  plugins: [],
};
