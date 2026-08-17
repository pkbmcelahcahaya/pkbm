/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
      },
      lineHeight: {
        relaxed: '1.6',
        loose: '1.65',
      },
      colors: {
        brand: {
          red: '#C8102E',
          'red-hover': '#A30D25',
          navy: '#172033',
          charcoal: '#1F2937',
          bg: '#F5F6F8',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}
