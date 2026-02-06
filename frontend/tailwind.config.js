/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0D2B4F', // Koyu Lacivert/Mavi
                'primary-light': '#1A4D8C',
                accent: '#D4AF37',  // Altın Sarısı
                'accent-hover': '#B3922D',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Modern font
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}
