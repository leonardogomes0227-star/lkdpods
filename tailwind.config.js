/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0e0d0c',
        bgAlt: '#1a1817',
        ink: '#f5f2ee',
        inkSoft: '#a9a29b',
        line: '#2a2725',
        accent: '#d97757',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(15px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        flipDown: {
          '0%': { transform: 'rotateX(0deg)' },
          '45%': { transform: 'rotateX(-90deg)' },
          '55%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(250%)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.2s ease-out forwards',
        'slide-left': 'slide-left 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        flipDown: 'flipDown 0.5s ease-in-out',
        sweep: 'sweep 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
