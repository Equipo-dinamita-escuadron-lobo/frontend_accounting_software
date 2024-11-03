/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'blue-900': '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
      },
      colors: {
        'sidebar': '#334155',
        'blueP1': '#000066',
        'blueP2': '#78BEF9',
        'blueP3': '#DAEDFD',
        'purpleP1': '#9814E5',
        'purpleP2': '#BD69EE',
        'purpleP3': '#DAAAF6',
        'grayP1': '#7B7B7B',
        'grayP2': '#E4E3E3',
        // Botones
        'button-default': '#000066',
        'button-hover': '#5056AC',
        'button-pressed': '#828AE3',
        'button-disabled': '#C8C5D0',
        'button-text-default': '#FFFFFF',
        'button-text-disabled': '#46464F'
      },
      backgroundColor: {
        "gray-ligth": "#F9FAFD"
      },
      borderColor: {
        "gray-ligth": "#E5EAF1"
      },
      textColor: {
        "menu-item": "#334155",
        "subtitle": "#78BEF9"
      },
      fontFamily: {
        projectFont: ['Inria Sans'],
        landing: ['Montserrat'],
        titillium: ['"Titillium Web"', ...defaultTheme.fontFamily.sans],
        opensans: ['"Open Sans"', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        h1: ['32px', '41px'],
        h2: ['22px', '30px'],
        h3: ['18px', '22.5px'],
        h4: ['16px', '30px'],
        h5: ['16px', '30px'],
        h6: ['14px', '23px'],
        body1: ['14px', '26px'],
        body2: ['14px', '26px'],
        body3: ['12px', '21px'],
        button: ['12px', '19px'],
      },
      fontWeight: {
        semibold: 600,
        bold: 700,
      },
      width: {
        "21": ['6rem'] /* 80px */
      },
      height: {
        "21": ['6rem'] /* 80px */
      },
      screens: {
        'tm': '360px',
        'mmm': '200px',
        'mp': '360px',
        'mm': '375px',
        'im': '500px',
        'sg': '720px',
        'opm': '1366px',
        'oem': '1440px',
        'pcg': '1920px'
      },
      borderRadius: {
        'button': '9999px' // Bordes redondeados para los botones
      },
      spacing: {
        'px-20': '20px',  // Altura del botón principal (padding superior/inferior)
        'px-11': '11px',  // Altura del botón principal (padding lateral)
        'px-30': '30px',  // Altura del botón sidebar (padding superior/inferior)
        'px-15': '15px',  // Altura del botón sidebar (padding lateral)
        'px-13': '13px'   // Altura del botón sidebar (padding entre icono y texto)
      }
    },
  },
  plugins: [],
}
