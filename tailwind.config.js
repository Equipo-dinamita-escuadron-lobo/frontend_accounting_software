/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        'sidebar':'#334155',
        'blueP1':'#0472FA',
        'bluep2':'#78BEF9',
        'bluep3':'#DAEDFD',
        'purple1':'#9814E5',
        'purple2': '#BD69EE',
        'purple3':'#DAAAF6'

      },
      fontFamily:{
        projectFont: ['Inria Sans']
      }
    },
  },
  plugins: [],
}

