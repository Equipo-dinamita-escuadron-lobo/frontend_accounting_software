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
        'purpleP3':'#DAAAF6',
        'grayP1': '#7B7B7B',
        'grayP2': '#E4E3E3'

      },
      backgroundColor:{
        "gray-ligth":"#F9FAFD"
      },
      borderColor:{
        "gray-ligth":"#E5EAF1"
      },
      textColor:{
        "menu-item":"#334155",
        "subtitle":"#78BEF9"
      },
      fontFamily:{
        projectFont: ['Inria Sans']
      },
      width:{
        "21": ['6rem']/* 80px */
      },
      height:{
        "21": ['6rem']/* 80px */
      },
      screens: {
        'tm': '400px'
      }
    },
  },
  plugins: [],
}

