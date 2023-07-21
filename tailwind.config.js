const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        'accents-1': 'hsl(var(--accents-1) / <alpha-value>)',
        'accents-2': 'hsl(var(--accents-2) / <alpha-value>)',
        'accents-3': 'hsl(var(--accents-3) / <alpha-value>)',
        'accents-4': 'hsl(var(--accents-4) / <alpha-value>)',
        'accents-5': 'hsl(var(--accents-5) / <alpha-value>)',
        'accents-6': 'hsl(var(--accents-6) / <alpha-value>)',
        'accents-7': 'hsl(var(--accents-7) / <alpha-value>)',
        'accents-8': 'hsl(var(--accents-8) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        'error-light': 'hsl(var(--error-light) / <alpha-value>)',
        'error-dark': 'hsl(var(--error-dark) / <alpha-value>)',
        'error-lighter': 'hsl(var(--error-lighter) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        'success-light': 'hsl(var(--success-light) / <alpha-value>)',
        'success-dark': 'hsl(var(--success-dark) / <alpha-value>)',
        'success-lighter': 'hsl(var(--success-lighter) / <alpha-value>)',
        violet: 'hsl(var(--violet) / <alpha-value>)',
        'violet-light': 'hsl(var(--violet-light) / <alpha-value>)',
        'violet-dark': 'hsl(var(--violet-dark) / <alpha-value>)',
        'violet-lighter': 'hsl(var(--violet-lighter) / <alpha-value>)',
        cyan: 'hsl(var(--cyan) / <alpha-value>)',
        'cyan-light': 'hsl(var(--cyan-light) / <alpha-value>)',
        'cyan-dark': 'hsl(var(--cyan-dark) / <alpha-value>)',
        'cyan-lighter': 'hsl(var(--cyan-lighter) / <alpha-value>)',
        'highlight-purple': 'hsl(var(--highlight-purple) / <alpha-value>)',
        'highlight-pink': 'hsl(var(--highlight-pink) / <alpha-value>)',
        'highlight-magenta': 'hsl(var(--highlight-magenta) / <alpha-value>)',
        'highlight-yellow': 'hsl(var(--highlight-yellow) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
