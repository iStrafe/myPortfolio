/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:   '#303841',
          mid:    '#3A4750',
          yellow: '#F6C90E',
          light:  '#EEEEEE',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body:    ['Barlow', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'scan':       'scan 10s linear infinite',
        'pulse-y':    'pulseY 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'grid-drift': 'gridDrift 20s linear infinite',
        'marquee':    'marquee 28s linear infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseY: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        gridDrift: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '80px 80px' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
