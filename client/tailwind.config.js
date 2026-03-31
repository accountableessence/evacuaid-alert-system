/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Space Mono"', 'monospace'], 
      mono: ['"Space Mono"', 'monospace'],
      display: ['"Playfair Display"', 'serif'],
    },
    extend: {
      colors: {
        bwai: {
          navy: '#0B1E3B',    // Darkened Navy for supreme baseline readability
          purple: '#9A4FBA',  // Darker, intensely saturated Lilac
          muted: '#50698D',
          steel: '#4E7AB1',
          slate: '#7D9FC0',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 5s ease-in-out infinite reverse',
        'snow': 'snow 15s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        snow: {
          '0%': { transform: 'translateY(-10vh) translateX(0) scale(1)' },
          '50%': { transform: 'translateY(50vh) translateX(30px) scale(1.1)' },
          '100%': { transform: 'translateY(110vh) translateX(-20px) scale(0.9)' },
        }
      }
    },
  },
  plugins: [],
}
