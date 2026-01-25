/**
 * Tailwind CSS Configuration
 *
 * CSS変数を使用した動的テーマシステム
 * Material Design 3 パターン: bg-surface, text-on-surface, bg-primary, text-on-primary
 *
 * テーマの切り替えは ThemeProvider で vars() を使用して行う
 */
const { colors: tokenColors } = require('@machikore/design-tokens/mobile/tailwind');

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
        // ============================================
        // Primitive Colors（基本色 - 直接使用も可能）
        // ============================================
        brand: tokenColors.primitive.brand,
        gray: tokenColors.primitive.gray,
        red: tokenColors.primitive.red,
        green: tokenColors.primitive.green,
        yellow: tokenColors.primitive.yellow,
        white: tokenColors.primitive.base.white,
        black: tokenColors.primitive.base.black,

        // ============================================
        // Semantic Colors (CSS変数方式 - Material Design 3 pattern)
        // テーマはThemeProviderのvars()で切り替わる
        // 使用例: bg-surface, text-on-surface, bg-primary, text-on-primary
        // ============================================

        // Surface - 背景・レイヤー
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          variant: 'rgb(var(--color-surface-variant) / <alpha-value>)',
        },
        'on-surface': {
          DEFAULT: 'rgb(var(--color-on-surface) / <alpha-value>)',
          variant: 'rgb(var(--color-on-surface-variant) / <alpha-value>)',
        },

        // Primary - メインアクション
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          container: 'rgb(var(--color-primary-container) / <alpha-value>)',
        },
        'on-primary': {
          DEFAULT: 'rgb(var(--color-on-primary) / <alpha-value>)',
          container: 'rgb(var(--color-on-primary-container) / <alpha-value>)',
        },

        // Secondary - セカンダリアクション
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          hover: 'rgb(var(--color-secondary-hover) / <alpha-value>)',
        },
        'on-secondary': 'rgb(var(--color-on-secondary) / <alpha-value>)',

        // Error - エラー/削除
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          hover: 'rgb(var(--color-error-hover) / <alpha-value>)',
          container: 'rgb(var(--color-error-container) / <alpha-value>)',
        },
        'on-error': {
          DEFAULT: 'rgb(var(--color-on-error) / <alpha-value>)',
          container: 'rgb(var(--color-on-error-container) / <alpha-value>)',
        },

        // Success - 成功
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          container: 'rgb(var(--color-success-container) / <alpha-value>)',
        },
        'on-success': {
          DEFAULT: 'rgb(var(--color-on-success) / <alpha-value>)',
          container: 'rgb(var(--color-on-success-container) / <alpha-value>)',
        },

        // Warning - 警告
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          container: 'rgb(var(--color-warning-container) / <alpha-value>)',
        },
        'on-warning': {
          DEFAULT: 'rgb(var(--color-on-warning) / <alpha-value>)',
          container: 'rgb(var(--color-on-warning-container) / <alpha-value>)',
        },

        // Info - 情報
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          container: 'rgb(var(--color-info-container) / <alpha-value>)',
        },
        'on-info': {
          DEFAULT: 'rgb(var(--color-on-info) / <alpha-value>)',
          container: 'rgb(var(--color-on-info-container) / <alpha-value>)',
        },

        // Outline - ボーダー
        outline: {
          DEFAULT: 'rgb(var(--color-outline) / <alpha-value>)',
          variant: 'rgb(var(--color-outline-variant) / <alpha-value>)',
          focus: 'rgb(var(--color-outline-focus) / <alpha-value>)',
        },

        // Scrim - オーバーレイ背景
        scrim: 'rgb(var(--color-scrim) / <alpha-value>)',

        // Spot colors - マップピン、タグ（静的、テーマ不変）
        spot: tokenColors.light.spot,

        // Transport colors - 交通機関（静的、テーマ不変）
        transport: tokenColors.light.transport,
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
