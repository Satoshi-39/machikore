/**
 * Tailwind CSS Configuration
 *
 * デザイントークンからカラーをインポート
 * CTI構造: primitive（基本色）、light/dark（セマンティック色）
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
        // Semantic Colors - Light Theme
        // text-*, bg-*, border-*, etc.
        // ============================================
        // テキストカラー
        text: tokenColors.light.text,

        // 背景カラー
        background: tokenColors.light.background,

        // サーフェスカラー（カード、モーダルなど）
        surface: tokenColors.light.surface,

        // ボーダーカラー
        border: tokenColors.light.border,

        // アイコンカラー
        icon: tokenColors.light.icon,

        // アクションカラー（ボタンなど）
        action: tokenColors.light.action,

        // スポットカラー（マップピンなど）
        spot: tokenColors.light.spot,

        // 交通機関カラー
        transport: tokenColors.light.transport,

        // ============================================
        // Semantic Colors - Dark Theme
        // dark:接頭辞で使用: dark:bg-dark-background-primary
        // ============================================
        'dark-text': tokenColors.dark.text,
        'dark-background': tokenColors.dark.background,
        'dark-surface': tokenColors.dark.surface,
        'dark-border': tokenColors.dark.border,
        'dark-icon': tokenColors.dark.icon,
        'dark-action': tokenColors.dark.action,
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
