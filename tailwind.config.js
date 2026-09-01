/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F1ECE0",
        surfaceCard: "#FAF7F1",
        primaryTeal: "#1E5452",
        headerTeal: {
          start: "#173F3E",
          end: "#2C6660",
        },
        accentTerracotta: "#C15A3C",
        accentGold: "#C9A227",
        textPrimary: "#2A2420",
        textMuted: "#8C8579",
        textOnDark: "#FBF8F2",
        dimmedOption: "#D8D2C4",
      },
      fontFamily: {
        serif: ["Lora", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(42, 36, 32, 0.08)',
        'soft-lg': '0 10px 25px -3px rgba(42, 36, 32, 0.12)',
      }
    },
  },
  plugins: [],
}
