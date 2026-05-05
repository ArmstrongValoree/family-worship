/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paradise: {
          'green-deep': '#1a3d2b',
          'green-mid': '#2d6a4f',
          'green-light': '#52b788',
          'green-mist': '#d8f3dc',
          gold: '#d4a017',
          'gold-light': '#f4d35e',
          cream: '#fdf8f0',
          sand: '#e9c46a',
          sky: '#90e0ef',
          ocean: '#0077b6',
          earth: '#6b4226',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
