/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ブランドカラー
        primary: {
          DEFAULT: '#007AFF', // iOS Blue
          light: '#3B82F6',   // Blue-500
          dark: '#2563EB',    // Blue-600
        },
        secondary: {
          DEFAULT: '#10B981', // Green-500
          light: '#34D399',   // Green-400
          dark: '#059669',    // Green-600
        },

        // セマンティックカラー（NativeWindではdark:プレフィックス方式で使用）
        // Light theme values
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB', // gray-50
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB', // gray-50
        },
        border: {
          DEFAULT: '#E5E7EB', // gray-200
          light: '#F3F4F6',   // gray-100
        },
        foreground: {
          DEFAULT: '#111827', // gray-900
          secondary: '#6B7280', // gray-500
          muted: '#9CA3AF',   // gray-400
        },
        muted: {
          DEFAULT: '#F3F4F6', // gray-100
        },

        // Dark theme values (dark-* prefix)
        'dark-background': {
          DEFAULT: '#111827', // gray-900
          secondary: '#1F2937', // gray-800
        },
        'dark-surface': {
          DEFAULT: '#1F2937', // gray-800
          secondary: '#374151', // gray-700
        },
        'dark-border': {
          DEFAULT: '#4B5563', // gray-600 (より明るく見やすい仕切り)
          light: '#374151',   // gray-700
        },
        'dark-foreground': {
          DEFAULT: '#F9FAFB', // gray-50
          secondary: '#9CA3AF', // gray-400
          muted: '#6B7280',   // gray-500
        },
        'dark-muted': {
          DEFAULT: '#374151', // gray-700
        },
      },
    },
  },
  plugins: [],
};
