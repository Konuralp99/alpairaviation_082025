export default {
  darkMode: 'class', // Karanlık mod için bu satırı ekliyoruz
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Renk Paleti
        primary: {
          DEFAULT: '#0D2B4F', // Koyu Lacivert
          light: '#1E4976',
        },
        accent: {
          DEFAULT: '#D4A056', // Altın/Kehribar
          hover: '#C0904D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
