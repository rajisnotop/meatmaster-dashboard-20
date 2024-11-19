import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0D0D0D",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#A239CA",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4717F6",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0D0D0D",
          foreground: "#E0E0E0",
        },
        destructive: {
          DEFAULT: "#F64C72",
          foreground: "#FFFFFF",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 10px #A239CA, 0 0 20px #A239CA" },
          "50%": { boxShadow: "0 0 20px #A239CA, 0 0 30px #A239CA" },
          "100%": { boxShadow: "0 0 10px #A239CA, 0 0 20px #A239CA" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s infinite"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;