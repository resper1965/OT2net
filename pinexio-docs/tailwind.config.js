/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './docs/**/*.{md,mdx}',
    './config/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: [
          'var(--font-montserrat)',
          'Montserrat',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#E6F7FD',
          100: '#C5EBF8',
          200: '#9CDDF3',
          300: '#73CFEE',
          400: '#4BC2EA',
          500: '#00ADE8',
          600: '#0096C7',
          700: '#00749A',
          800: '#00526D',
          900: '#002F40',
        },
      },
      boxShadow: {
        glow: '0 0 30px 0 rgba(0, 173, 232, 0.35)',
      },
      borderRadius: {
        xl: '1.5rem',
      },
    },
  },
  screens: {
    xs: '100px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  plugins: [],
};
