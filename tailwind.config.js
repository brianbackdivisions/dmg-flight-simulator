/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':       '#080D17',
        'bg-surface1':   '#0C1426',
        'bg-surface2':   '#0F1D35',
        'border-subtle': '#1A2D45',
        'border-active': '#00C4E8',
        'text-primary':  '#EEF2F7',
        'text-secondary':'#7E9BB5',
        'text-tertiary': '#3D5570',
        'accent-ai':     '#00C4E8',
        'accent-action': '#F26522',
        'status-pass':   '#10B981',
        'status-warn':   '#F59E0B',
        'status-fail':   '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow-ai':     '0 0 0 1px rgba(0,196,232,0.3), 0 0 16px rgba(0,196,232,0.12)',
        'glow-action': '0 0 0 1px rgba(242,101,34,0.3), 0 0 16px rgba(242,101,34,0.12)',
      },
    },
  },
  plugins: [],
};
