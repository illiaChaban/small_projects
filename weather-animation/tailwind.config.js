/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      trasparent: '#ffffff4d',
    },
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeOut: {
          'from': { opacity: 1 },
          'to': { opacity: 0 }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        fadeOut: 'fadeOut 1s linear forwards',
      }
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        },
        '.animation-reversed': {
          'animation-direction': 'reverse',
        },
        '.animation-paused': {
          'animation-play-state': 'paused',
        }
      });
    }
  ],
  experimental: {
    optimizeUniversalDefaults: true
  }
}