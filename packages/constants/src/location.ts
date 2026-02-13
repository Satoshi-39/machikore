/**
 * 地名表示設定
 * 全アプリ共通（mobile / web）
 */

export const LOCATION_ICONS = {
  /** 街 */
  MACHI: {
    name: 'storefront' as const,
    color: '#16a34a', // green-600 (secondary.DEFAULT)
    bgColor: 'bg-green-100',
  },
  /** 市区 */
  CITY: {
    name: 'business' as const,
    color: '#ea580c', // orange-600
    bgColor: 'bg-orange-100',
  },
  /** 都道府県 */
  PREFECTURE: {
    name: 'shield' as const,
    color: '#9333ea', // purple-600
    bgColor: 'bg-purple-100',
  },
  /** 地方 */
  REGION: {
    name: 'layers' as const,
    color: '#0891b2', // cyan-600
    bgColor: 'bg-cyan-100',
  },
  /** マスタースポット */
  MASTER_SPOT: {
    name: 'location-outline' as const,
    color: '#3B82F6', // blue-500 (primary.DEFAULT)
    bgColor: 'bg-blue-100',
  },
  /** ユーザースポット */
  USER_SPOT: {
    name: 'location-outline' as const,
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-100',
  },
  /** 住所アイコン */
  ADDRESS: {
    color: '#6B7280', // gray-500
    holeColorLight: '#FFFFFF',
    holeColorDark: '#1f2937', // gray-800
  },
  /** 国 */
  COUNTRY: {
    emoji: '🇯🇵',
    bgColor: 'bg-white',
  },
  /** 地球 */
  EARTH: {
    name: 'globe' as const,
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-100',
  },
} as const;

/** locationTypeからLOCATION_ICONSのキーへのマッピング */
export const LOCATION_TYPE_MAP = {
  machi: 'MACHI',
  city: 'CITY',
  prefecture: 'PREFECTURE',
  region: 'REGION',
  country: 'COUNTRY',
  earth: 'EARTH',
  unknown: 'MASTER_SPOT',
} as const;

/** 地名ラベルの色（ライトモード）- ユーザマップ用 */
export const LOCATION_LABEL_COLORS_LIGHT = {
  text: '#4B5563', // gray-600
  halo: '#FFFFFF',
} as const;

/** 地名ラベルの色（ダークモード）- ユーザマップ用 */
export const LOCATION_LABEL_COLORS_DARK = {
  text: '#D1D5DB', // gray-300
  halo: '#1F2937', // gray-800
} as const;
