/**
 * セマンティックカラー定義
 * theme.tsと同期を保つ必要があります
 */
const semanticColors = {
  // Light Theme
  light: {
    background: '#F0F9FF', // blue-50 (とても薄い青)
    backgroundSecondary: '#E0F2FE', // blue-100
    surface: '#F0F9FF', // blue-50 (とても薄い青)
    surfaceSecondary: '#E0F2FE', // blue-100
    border: '#E5E7EB', // gray-200
    borderLight: '#F3F4F6', // gray-100
    foreground: '#111827', // gray-900
    foregroundSecondary: '#6B7280', // gray-500
    foregroundMuted: '#9CA3AF', // gray-400
    muted: '#F3F4F6', // gray-100
  },
  // Dark Theme
  dark: {
    background: '#111827', // gray-900
    backgroundSecondary: '#1F2937', // gray-800
    surface: '#1F2937', // gray-800
    surfaceSecondary: '#374151', // gray-700
    border: '#4B5563', // gray-600
    borderLight: '#374151', // gray-700
    foreground: '#F9FAFB', // gray-50
    foregroundSecondary: '#9CA3AF', // gray-400
    foregroundMuted: '#6B7280', // gray-500
    muted: '#374151', // gray-700
  },
};

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
          DEFAULT: semanticColors.light.background,
          secondary: semanticColors.light.backgroundSecondary,
        },
        surface: {
          DEFAULT: semanticColors.light.surface,
          secondary: semanticColors.light.surfaceSecondary,
        },
        border: {
          DEFAULT: semanticColors.light.border,
          light: semanticColors.light.borderLight,
        },
        foreground: {
          DEFAULT: semanticColors.light.foreground,
          secondary: semanticColors.light.foregroundSecondary,
          muted: semanticColors.light.foregroundMuted,
        },
        muted: {
          DEFAULT: semanticColors.light.muted,
        },

        // Dark theme values (dark-* prefix)
        'dark-background': {
          DEFAULT: semanticColors.dark.background,
          secondary: semanticColors.dark.backgroundSecondary,
        },
        'dark-surface': {
          DEFAULT: semanticColors.dark.surface,
          secondary: semanticColors.dark.surfaceSecondary,
        },
        'dark-border': {
          DEFAULT: semanticColors.dark.border,
          light: semanticColors.dark.borderLight,
        },
        'dark-foreground': {
          DEFAULT: semanticColors.dark.foreground,
          secondary: semanticColors.dark.foregroundSecondary,
          muted: semanticColors.dark.foregroundMuted,
        },
        'dark-muted': {
          DEFAULT: semanticColors.dark.muted,
        },
      },
    },
  },
  plugins: [],
};
