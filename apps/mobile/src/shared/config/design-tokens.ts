/**
 * デザイントークン（Design Tokens）
 *
 * カラー、スペーシング、フォントサイズなどのデザイン定数を一元管理
 * Tailwindのカラーパレットをベースにしています
 */

/**
 * カラーパレット
 */
export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#007AFF', // iOS Blue
    light: '#3B82F6', // Blue-500
    dark: '#2563EB', // Blue-600
  },

  // Secondary Colors
  secondary: {
    DEFAULT: '#10B981', // Green-500
    light: '#34D399', // Green-400
    dark: '#059669', // Green-600
  },

  // Semantic Colors
  danger: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  success: '#10B981', // Green-500
  info: '#3B82F6', // Blue-500

  // Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF', // Placeholder text
    500: '#6B7280', // Icons
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Text Colors
  text: {
    primary: '#111827', // Gray-900
    secondary: '#6B7280', // Gray-500
    tertiary: '#9CA3AF', // Gray-400
    placeholder: '#9CA3AF', // Gray-400
    inverse: '#FFFFFF',
  },

  // Background Colors (deprecated - use semantic colors below)
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB', // Gray-50
    tertiary: '#F3F4F6', // Gray-100
  },

  // Border Colors
  border: {
    light: '#E5E7EB', // Gray-200
    DEFAULT: '#D1D5DB', // Gray-300
    dark: '#9CA3AF', // Gray-400
  },

  /**
   * セマンティックカラー - Light Theme
   * 注意: tailwind.config.js にも同じ値が定義されています
   * 変更時は両方を更新してください
   */
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

  /**
   * セマンティックカラー - Dark Theme（光沢のある黒 - Threads/AbemaTV風）
   * 注意: tailwind.config.js にも同じ値が定義されています
   * 変更時は両方を更新してください
   * 3段階: surface(カード) < surfaceSecondary(PopupMenu) < surfaceElevated(検索バー)
   */
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

  // Special Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Ranking Colors
  ranking: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    default: '#9CA3AF',
  },

  // Action/Notification Type Colors
  action: {
    like: '#EF4444', // Red - いいね
    comment: '#3B82F6', // Blue - コメント
    follow: '#8B5CF6', // Purple - フォロー
    bookmark: '#F59E0B', // Amber - ブックマーク
    system: '#F59E0B', // Amber - システム通知
    share: '#10B981', // Green - シェア
  },
} as const;

/**
 * スペーシング
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/**
 * フォントサイズ
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

/**
 * フォントウェイト
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * ボーダー半径
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

/**
 * シャドウ
 */
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  DEFAULT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
} as const;

/**
 * アイコンサイズ
 */
export const iconSize = {
  xs: 16,
  sm: 18,
  base: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

/**
 * Z-Index
 */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const;

/**
 * アニメーション時間（ミリ秒）
 */
export const duration = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

/**
 * デザイントークン全体のエクスポート
 */
export const theme = {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
  iconSize,
  zIndex,
  duration,
} as const;

/**
 * 型定義
 */
export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
