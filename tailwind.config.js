/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        hover: 'rgb(var(--hover) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-2': 'rgb(var(--ink-2) / <alpha-value>)',
        'ink-3': 'rgb(var(--ink-3) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
        mars: 'rgb(var(--mars) / <alpha-value>)',
        moon: 'rgb(var(--moon) / <alpha-value>)',
        emerald: 'rgb(var(--emerald) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        azure: 'rgb(var(--azure) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Instrument Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        panel: 'var(--panel-shadow)',
        'panel-lg': 'var(--panel-shadow-lg)',
      },
      borderRadius: {
        panel: '14px',
      },
    },
  },
  plugins: [],
};
