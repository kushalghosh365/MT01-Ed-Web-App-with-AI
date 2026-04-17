/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        less800: { max: '800px' }, // Target screens less than 800px
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

