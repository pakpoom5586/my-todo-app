/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // บอกให้ Tailwind สแกนหา class ในไฟล์เหล่านี้
  ],
  darkMode: "class", // เปิดใช้งาน Dark Mode โดยใช้ class 'dark' บน <html> tag
  theme: {
    extend: {},
  },
  plugins: [],
}