/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'shop-dark-blue': '#22223b',
        'shop-light-blue': '#4a4e69',
        'shop-light-perpel': '#9f86c0',
        'shop-light-vanilla': '#f2e3e0',
        'shop-btn-dark-green': '#063d29',
        'shop-light-orange': '#c9ada7',
        'shop-light-pink': '#9a8c98',
        'shop-white': '#f2e9e4',
        'darkColor': '#151515',
        'lightColor': '#52525b',
        'lightOrange': '#fca99b',
        'shop-light-green': '#3b9c3c',
        'deal-bg': '#f1f3f8',
        'dark-blue': '#6c7fd8',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 6s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}