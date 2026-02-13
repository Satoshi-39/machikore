/**
 * スポット設定
 * 全アプリ共通（mobile / web）
 */

export const SPOT_TYPE_COLORS = {
  food: '#F97316', // オレンジ - 飲食店系
  shopping: '#9333EA', // 紫 - ショッピング系
  tourism: '#10B981', // 緑 - 公園・観光地系
  transit: '#3B82F6', // 青 - 交通系
  other: '#A78BFA', // 薄い紫 - その他
  popular: '#F59E0B', // ゴールド - 人気スポット
} as const;

export const SPOT_COLORS = {
  pink: {
    color: '#ec4899',
    labelKey: 'spotColor.pink',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  red: {
    color: '#EF4444',
    labelKey: 'spotColor.red',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  orange: {
    color: '#F97316',
    labelKey: 'spotColor.orange',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  yellow: {
    color: '#EAB308',
    labelKey: 'spotColor.yellow',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  green: {
    color: '#22C55E',
    labelKey: 'spotColor.green',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  blue: {
    color: '#3B82F6',
    labelKey: 'spotColor.blue',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  purple: {
    color: '#9333EA',
    labelKey: 'spotColor.purple',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
  },
  gray: {
    color: '#6B7280',
    labelKey: 'spotColor.gray',
    haloLight: '#FFFFFF',
    haloDark: '#FFFFFF',
    useOutlinedIconInDark: true,
  },
  white: {
    color: '#FFFFFF',
    labelKey: 'spotColor.white',
    haloLight: '#374151',
    haloDark: '#374151',
    useOutlinedIconInLight: true,
  },
} as const;

export type SpotColor = keyof typeof SPOT_COLORS;

/** スポットのデフォルトカラー */
export const DEFAULT_SPOT_COLOR: SpotColor = 'blue';

export const SPOT_COLOR_LIST = Object.entries(SPOT_COLORS).map(
  ([key, value]) => ({ key: key as SpotColor, ...value }),
);

/**
 * スポットカラーが縁取りを必要とするかどうかを判定
 * @param spotColor スポットカラー
 * @param isDarkMode ダークモードかどうか
 * @returns 縁取りの色（不要な場合はundefined）
 */
export function getSpotColorStroke(
  spotColor: SpotColor,
  isDarkMode: boolean,
): string | undefined {
  const config = SPOT_COLORS[spotColor];
  if (!config) return undefined;

  // ライトモードで縁取りが必要（白）
  if (
    'useOutlinedIconInLight' in config &&
    !isDarkMode &&
    config.useOutlinedIconInLight
  ) {
    return config.haloLight;
  }
  // ダークモードで縁取りが必要（グレー）
  if (
    'useOutlinedIconInDark' in config &&
    isDarkMode &&
    config.useOutlinedIconInDark
  ) {
    return config.haloDark;
  }

  return undefined;
}
