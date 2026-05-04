/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        constantia: ["Constantia", "Georgia", "serif"],
        serif: ["Times New Roman", "Times", "serif"],
      },
      colors: {
        brand: {
          orange: '#ff7f11',
          blue: '#0077b6',
        }
      }
    },
  },
  plugins: [],
}
