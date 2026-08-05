/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        bgAlt: '#F1F0EC',
        ink: '#15181B',
        inkSoft: '#52565C',
        line: '#E4E2DC',
        accent: '#4C7A3F',
        accentSoft: '#E9EFE4',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
