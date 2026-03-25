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
        'accent-2': '#FBBF24',
        'accent-3': '#3B82F6',
        background: '#0A0F1A',
        surface: '#111827',
        border: '#1F2937',
        muted: '#6B7280',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'card-hover': '#1A2433',
        danger: '#DC2626',
        success: '#22C55E',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        heading: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #FBBF24, #F59E0B)',
        'gradient-hot': 'linear-gradient(135deg, #FBBF24, #3B82F6)',
        'gradient-fire': 'linear-gradient(135deg, #3B82F6, #FBBF24)',
        'gradient-cool': 'linear-gradient(135deg, #F59E0B, #FBBF24)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(251, 191, 36, 0.3)',
        'neon-cyan': '0 0 20px rgba(251, 191, 36, 0.3)',
        'neon-pink': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
