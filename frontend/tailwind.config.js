/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'oxanium': ['Oxanium', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'playfairSC': ['Playfair Display SC', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
         easeInOut: {
          '0%': { transform: 'translateX(-100%)' },
          // '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },

    animation: {
      slideDown: 'slideDown 0.5s ease-in-out',
      slideUp: 'slideUp 0.5s ease-in-out',
      easeInOut: 'easeInOut 8s ease-in-out infinite',
    },
  },
  plugins: [],
}

