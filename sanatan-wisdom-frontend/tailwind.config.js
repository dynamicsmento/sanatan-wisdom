/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E67E22",     // Saffron Orange
        secondary: "#FF9933",   // Deep Saffron
        background: "#FFF8E7",  // Warm Cream
        card: "#FAF3E0",        // Soft Sand
        text: "#3E2723",        // Dark Brown / Spiritual Wood
        accent: "#7B241C",      // Deep Maroon / Sindoor
        gold: {
          light: "#F9E79F",
          DEFAULT: "#D4AF37",   // Soft Gold
          dark: "#B7950B",
        }
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "serif"],
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(62, 39, 35, 0.06)",
        gold: "0 4px 15px rgba(212, 175, 55, 0.15)",
        insetGold: "inset 0 0 8px rgba(212, 175, 55, 0.1)",
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}
