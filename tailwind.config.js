/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1a202c',
      },
    },
  },
  plugins: [],
}

