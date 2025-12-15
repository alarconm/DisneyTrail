/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Disney magic palette
        'elsa-blue': '#A5F3FC',
        'magic-gold': '#FFD700',
        'cat-orange': '#F97316',
        'cat-yellow': '#FDE047',
        'cat-gray': '#9CA3AF',
        // Oregon Trail inspired
        'trail-brown': '#8B4513',
        'wagon-wood': '#DEB887',
        'prairie-green': '#228B22',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
