/**
 * セマンティックカラー定義
 * theme.tsと同期を保つ必要があります
 */
const semanticColors = {
  // Light Theme
  light: {
    background: '#FFFFFF', // white
    backgroundSecondary: '#F9FAFB', // gray-50
    surface: '#FFFFFF', // white
    surfaceSecondary: '#F9FAFB', // gray-50
    border: '#E5E7EB', // gray-200
    borderLight: '#F3F4F6', // gray-100
    foreground: '#111827', // gray-900
    foregroundSecondary: '#6B7280', // gray-500
    foregroundMuted: '#9CA3AF', // gray-400
    muted: '#F3F4F6', // gray-100
  },
  // Dark Theme - 光沢のある黒（Threads/AbemaTV風）
  // 3段階: surface(カード) < surfaceSecondary(PopupMenu) < surfaceElevated(検索バー)
  dark: {
    background: '#000000', // 純粋な黒
    backgroundSecondary: '#0A0A0A', // ほぼ黒
    surface: '#101010', // 少し明るい黒（カード等）
    surfaceSecondary: '#1A1A1A', // さらに明るい（PopupMenu等）
    surfaceElevated: '#262626', // 浮いている要素用（検索バー/ヘッダー）
    border: '#2A2A2A', // 暗めのボーダー
    borderLight: '#1A1A1A', // より暗いボーダー
    foreground: '#FFFFFF', // 純白
    foregroundSecondary: '#A0A0A0', // グレー
    foregroundMuted: '#666666', // 暗めのグレー
    muted: '#1A1A1A', // ミュート背景
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
          elevated: semanticColors.dark.surfaceElevated,
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
  plugins: [require('tailwindcss-animate')],
};
