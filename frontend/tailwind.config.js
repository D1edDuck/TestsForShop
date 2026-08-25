/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: "#0e0e10",
          1: "#18181b",
          2: "#1f1f23",
          3: "#26262c",
          4: "#2e2e36",
          5: "#3b3b44",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          light: "#a78bfa",
          muted: "rgba(124,58,237,0.15)",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#71717a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
