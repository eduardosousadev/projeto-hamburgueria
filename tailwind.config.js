/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './script.js'
  ],
  theme: {
    fontFamily: {
      // "sans": ['Roboto', 'sans-serif']
      "sans": ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')",
      },
      screens: {
        "2xs": "320px",
        "xs": "375px",
        "2sm": "425px"
      }
    },
  },
  plugins: [],
}

