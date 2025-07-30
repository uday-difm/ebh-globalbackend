/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,mdx}',
    './src/component/**/*.{js,jsx,mdx}', // Make sure this path is correct
    './src/app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],

  theme: {
  extend: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
   
  },
}

}
