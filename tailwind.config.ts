import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1.25rem'
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
export default config
