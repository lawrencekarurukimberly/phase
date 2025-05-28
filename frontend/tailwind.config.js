/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These are example hex codes for Tailwind's default colors
        // You can find exact hex codes in Tailwind CSS v4 docs for each color and shade
        'custom-emerald-900': '#042f2e', // Example value for emerald-900
        'custom-teal-800': '#0d9488',    // Example value for teal-800
        'custom-cyan-900': '#083344',    // Example value for cyan-900
        'custom-purple-900': '#2e1065',  // Example value for purple-900
        'custom-blue-800': '#1e40af',    // Example value for blue-800
        'custom-indigo-900': '#312e81',  // Example value for indigo-900
        // Add other colors used in your gradients if needed (e.g., pink-400, purple-500)
      }
    },
  },
  plugins: [],
}