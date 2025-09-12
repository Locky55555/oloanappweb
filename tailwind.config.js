/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-thai': ['Noto Sans Thai', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3A4DFF',
          600: '#2E3EBF',
          700: '#1d4ed8',
        },
        orange: {
          500: '#FF9F00',
        },
        purple: {
          500: '#5B3FFF',
          300: '#C5A8FF',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2E3EBF 0%, #4A5DFF 100%)',
      },
    },
  },
  plugins: [],
}
