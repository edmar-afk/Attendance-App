/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // 👈 scan everything in the app directory
    "./components/**/*.{js,jsx,ts,tsx}", // 👈 also scan your components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
