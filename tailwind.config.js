/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
      huninn: ['jf-openhuninn', 'sans-serif'],
      },
      colors: {
      quiz: {
        500: '#f3bbe9ff',
      },
    },
  },
},
  plugins: []
};
