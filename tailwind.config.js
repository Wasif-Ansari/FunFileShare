/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sleek violet primary with fuchsia accent
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.06)',
        glow: '0 8px 24px rgba(124, 58, 237, 0.4)',
        glowAccent: '0 8px 24px rgba(217, 70, 239, 0.35)'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(124,58,237,0)' },
          '50%': { boxShadow: '0 0 0 12px rgba(124,58,237,0.12)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 500ms ease-out both',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
