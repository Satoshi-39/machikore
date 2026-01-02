/**
 * スポット色計算ユーティリティ
 */

import { useMemo } from 'react';
import { SPOT_COLORS, SPOT_COLOR_LIST, getSpotColorStroke, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config/constants';

interface SpotColorSource {
  map_label?: { color?: string | null } | null;
  spot_color?: string | null;
}

/**
 * スポットのカラーキーを取得する
 * ラベル色を優先、なければspot_color、それもなければデフォルト
 */
export function getSpotColorKey(spot: SpotColorSource): SpotColor {
  // ラベルが設定されている場合はラベル色を優先
  if (spot.map_label?.color) {
    const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
    if (labelColorKey) return labelColorKey;
  }
  // スポット色が設定されている場合
  if (spot.spot_color) {
    return spot.spot_color as SpotColor;
  }
  return DEFAULT_SPOT_COLOR;
}

interface UseSpotColorReturn {
  /** スポットカラーキー */
  colorKey: SpotColor;
  /** スポットカラー値（HEX） */
  colorValue: string;
  /** スポットカラーストローク値 */
  strokeColor: string;
}

/**
 * スポットのカラー情報を取得するフック
 */
export function useSpotColor(spot: SpotColorSource, isDarkMode: boolean): UseSpotColorReturn {
  return useMemo(() => {
    const colorKey = getSpotColorKey(spot);
    const colorValue = SPOT_COLORS[colorKey]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
    const strokeColor = getSpotColorStroke(colorKey, isDarkMode) ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;

    return {
      colorKey,
      colorValue,
      strokeColor,
    };
  }, [spot.map_label?.color, spot.spot_color, isDarkMode]);
}
