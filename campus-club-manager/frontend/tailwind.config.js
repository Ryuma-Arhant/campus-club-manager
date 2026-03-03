/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#0F172A',
        accent: '#FBBF24',
        background: '#0A0F1A',
        surface: '#111827',
        border: '#1F2937',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
}
