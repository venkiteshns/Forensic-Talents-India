/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a192f', // Deep Navy Blue
          light: '#112240',
          dark: '#020c1b',
        },
        secondary: {
          DEFAULT: '#f3f4f6', // Light Grey
          light: '#ffffff', // White
          dark: '#9ca3af',
        },
        accent: {
          DEFAULT: '#d4af37', // Gold
          cyan: '#00e5ff', // Cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
