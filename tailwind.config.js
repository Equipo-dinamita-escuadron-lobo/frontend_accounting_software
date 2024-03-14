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
        'blueP2':'#78BEF9',
        'blueP3':'#DAEDFD',
        'purpleP1':'#9814E5',
        'purpleP2': '#BD69EE',
        'purpleP3':'#DAAAF6'

      },
      backgroundColor:{
        "gray-ligth":"#F9FAFD"
      },
      borderColor:{
        "gray-ligth":"#E5EAF1"
      },
      textColor:{
        "menu-item":"#334155"
      },
      fontFamily:{
        projectFont: ['Inria Sans']
      }
    },
  },
  plugins: [],
}

