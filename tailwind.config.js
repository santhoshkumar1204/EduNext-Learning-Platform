/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Attention zone palette (kept in sync with src/hooks/useBlinkStats.js)
        zone: {
          hyperfocused: '#3b82f6',
          attentive: '#22c55e',
          neutral: '#eab308',
          fatigued: '#f97316',
          sleepy: '#ef4444',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
