// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Add paths to all of your template files
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // If you have other directories with components/pages, add them too
    // e.g., "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Important: Matches ThemeProvider in _app.js
  theme: {
    extend: {
      // You can add custom theme extensions here later if needed
      // Example:
      // colors: {
      //   'custom-blue': '#1fb6ff',
      // }
    },
  },
  plugins: [
    // Add any Tailwind plugins here later if needed
    // Example: require('@tailwindcss/forms'),
  ],
}
