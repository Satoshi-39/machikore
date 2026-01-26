/**
 * Tailwind CSS Configuration
 *
 * デザイントークンによる完全置換方式
 * Material Design 3 パターン: bg-surface, text-on-surface, bg-primary, text-on-primary
 *
 * テーマの切り替えは ThemeProvider で vars() を使用して行う
 */
const {
  colors: tokenColors,
  fontFamily: tokenFontFamily,
  fontSize: tokenFontSize,
  fontWeight: tokenFontWeight,
  lineHeight: tokenLineHeight,
  letterSpacing: tokenLetterSpacing,
  spacing: tokenSpacing,
  borderRadius: tokenBorderRadius,
  borderWidth: tokenBorderWidth,
} = require('@machikore/design-tokens/mobile/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    // ============================================
    // 完全置換：デザイントークンで定義された値のみ使用可能
    // ============================================

    // ============================================
    // Colors
    // ============================================
    colors: {
      // Primitive Colors（基本色 - 直接使用も可能）
      brand: tokenColors.primitive.brand,
      gray: tokenColors.primitive.gray,
      red: tokenColors.primitive.red,
      green: tokenColors.primitive.green,
      yellow: tokenColors.primitive.yellow,
      orange: tokenColors.primitive.orange,
      amber: tokenColors.primitive.amber,
      blue: tokenColors.primitive.blue,
      teal: tokenColors.primitive.teal,
      purple: tokenColors.primitive.purple,
      pink: tokenColors.primitive.pink,
      white: tokenColors.primitive.base.white,
      black: tokenColors.primitive.base.black,
      transparent: tokenColors.primitive.base.transparent,

      // Semantic Colors (CSS変数方式 - Material Design 3 pattern)
      // テーマはThemeProviderのvars()で切り替わる
      // 使用例: bg-surface, text-on-surface, bg-primary, text-on-primary

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

      // Action Colors (CSS変数方式 - テーマで切り替わる)
      'action-like': 'rgb(var(--color-action-like) / <alpha-value>)',
      'action-comment': 'rgb(var(--color-action-comment) / <alpha-value>)',
      'action-follow': 'rgb(var(--color-action-follow) / <alpha-value>)',
      'action-bookmark': 'rgb(var(--color-action-bookmark) / <alpha-value>)',
      'action-share': 'rgb(var(--color-action-share) / <alpha-value>)',
      tag: 'rgb(var(--color-tag) / <alpha-value>)',

      // Component Colors (静的、テーマ不変)
      // Spot colors - マップピン
      spot: tokenColors.light['spot-pin'],

      // Transport colors - 交通機関
      transport: tokenColors.light.transport,
    },

    // ============================================
    // Typography（デザイントークンから完全置換）
    // ============================================
    fontFamily: {
      sans: tokenFontFamily.sans,
      serif: tokenFontFamily.serif,
      mono: tokenFontFamily.mono,
    },
    fontSize: tokenFontSize,
    fontWeight: tokenFontWeight,
    lineHeight: tokenLineHeight,
    letterSpacing: tokenLetterSpacing,

    // ============================================
    // Layout（デザイントークンから完全置換）
    // ============================================
    spacing: tokenSpacing,
    borderRadius: tokenBorderRadius,
    borderWidth: tokenBorderWidth,

    // ============================================
    // extend: Tailwindデフォルトを保持する項目
    // ============================================
    extend: {
      // NativeWindで必要なデフォルト値を保持
    },
  },
  plugins: [require('tailwindcss-animate')],
};
