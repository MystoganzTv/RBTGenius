/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#bcdeff",
          300: "#8ec9ff",
          400: "#59abff",
          500: "#348cff",
          600: "#1f6fff",
          700: "#1959eb",
          800: "#1c49be",
          900: "#1d4195",
        },
      },
    },
  },
  plugins: [],
};
