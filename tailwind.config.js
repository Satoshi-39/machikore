/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF', // iOS Blue
          light: '#3B82F6', // Blue-500
          dark: '#2563EB', // Blue-600
        },
        secondary: {
          DEFAULT: '#10B981', // Green-500
          light: '#34D399', // Green-400
          dark: '#059669', // Green-600
        },
      },
    },
  },
  plugins: [],
};
