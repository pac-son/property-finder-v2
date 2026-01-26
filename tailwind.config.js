/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: This points to the "app" folder used by Expo Router
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#86EFAC', 
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}