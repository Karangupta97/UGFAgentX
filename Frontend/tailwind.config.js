/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ugf: {
          accent: '#7C3AED',
          violet: '#A78BFA',
        },
      },
      maxWidth: {
        app: '1440px',
      },
    },
  },
  plugins: [],
};
