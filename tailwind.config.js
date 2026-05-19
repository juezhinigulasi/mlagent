/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
        },
        'gold': {
          400: '#facc15',
          500: '#FFD700',
          600: '#eab308',
        },
      },
    },
  },
  plugins: [],
}
