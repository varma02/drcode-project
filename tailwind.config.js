import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#99cc33",
              foreground: "#ffffff"
            },
            secondary: "#e4e4e7",
          }
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#99cc33",
              foreground: "#27272A"
            },
            secondary: "#27272A",
          }
        },
      }
    }),
    require('tailwind-scrollbar'),
  ],
}

