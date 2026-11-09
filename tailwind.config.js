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
        'grid-drift': 'gridDrift 20s linear infinite',
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
        // Moves a layer rather than background-position so the GPU can animate it without repainting.
        gridDrift: {
          '0%':   { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(80px, 80px)' },
        },
      },
    },
  },
  plugins: [],
}
