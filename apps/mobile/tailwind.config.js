/**
 * デザイントークンからカラーをインポート
 * 一元管理された定義を使用
 */
const { colors: tokenColors } = require('@machikore/design-tokens/mobile/tailwind');

/**
 * セマンティックカラー定義
 * デザイントークンから取得
 */
const semanticColors = {
  light: tokenColors.light,
  dark: tokenColors.dark,
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
        // ブランドカラー（トークンから取得）
        primary: {
          DEFAULT: tokenColors.brand.primary,
          light: tokenColors.brand['primary-light'],
          dark: tokenColors.brand['primary-dark'],
        },
        secondary: {
          DEFAULT: tokenColors.brand.secondary,
          light: tokenColors.brand['secondary-light'],
          dark: tokenColors.brand['secondary-dark'],
        },

        // グレースケール（トークンから取得）
        gray: tokenColors.gray,

        // アクションカラー（トークンから取得）
        action: tokenColors.action,

        // スポットカラー（トークンから取得）
        spot: tokenColors.spot,
        'spot-type': tokenColors['spot-type'],

        // セマンティックカラー（NativeWindではdark:プレフィックス方式で使用）
        // Light theme values
        background: {
          DEFAULT: semanticColors.light.background,
          secondary: semanticColors.light['background-secondary'],
        },
        surface: {
          DEFAULT: semanticColors.light.surface,
          secondary: semanticColors.light['surface-secondary'],
        },
        border: {
          DEFAULT: semanticColors.light.border,
          light: semanticColors.light['border-light'],
        },
        foreground: {
          DEFAULT: semanticColors.light.foreground,
          secondary: semanticColors.light['foreground-secondary'],
          muted: semanticColors.light['foreground-muted'],
        },
        muted: {
          DEFAULT: semanticColors.light.muted,
        },

        // Dark theme values (dark-* prefix)
        'dark-background': {
          DEFAULT: semanticColors.dark.background,
          secondary: semanticColors.dark['background-secondary'],
        },
        'dark-surface': {
          DEFAULT: semanticColors.dark.surface,
          secondary: semanticColors.dark['surface-secondary'],
          elevated: semanticColors.dark['surface-elevated'],
        },
        'dark-border': {
          DEFAULT: semanticColors.dark.border,
          light: semanticColors.dark['border-light'],
        },
        'dark-foreground': {
          DEFAULT: semanticColors.dark.foreground,
          secondary: semanticColors.dark['foreground-secondary'],
          muted: semanticColors.dark['foreground-muted'],
        },
        'dark-muted': {
          DEFAULT: semanticColors.dark.muted,
        },

        // 交通機関カラー（トークンから取得）
        transport: tokenColors.transport,
        'location-label': tokenColors['location-label'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
