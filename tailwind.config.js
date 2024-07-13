/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    "./index.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        "mono": '"JetBrains Mono", monospace'
      }
    },
  },
  plugins: [],
}

