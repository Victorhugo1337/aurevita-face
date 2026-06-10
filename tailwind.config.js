/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Verde profundo da Presence — natureza, ervas
        moss: {
          50:  '#f3f6f1',
          100: '#e3ebde',
          200: '#c6d6bd',
          300: '#a0bb93',
          400: '#7a9d6c',
          500: '#5d8350',
          600: '#48683e',
          700: '#3a5333',
          800: '#30432b',
          900: '#293826',
          950: '#141e12',
        },
        // Off-white quente, tipo papel
        bone: {
          50:  '#fbfaf6',
          100: '#f5f2e9',
          200: '#ece7d4',
          300: '#ddd4b6',
        },
        // Acento terroso (cobre/âmbar)
        clay: {
          400: '#c8896a',
          500: '#b06f4e',
          600: '#945636',
        },
        ink: '#1a1d1a',
      },
      fontFamily: {
        // Display: serif moderna, italic linda, ótima legibilidade
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        // Body: sans contemporânea, mais quente que Inter
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        // Mono pra detalhes (tabelas admin, códigos)
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
    },
  },
  plugins: [],
}
