import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          300: '#fdba74',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      spacing: {
        safe: 'max(0.75rem, env(safe-area-inset-left))',
      },
    },
  },
  plugins: [],
};

export default config;
