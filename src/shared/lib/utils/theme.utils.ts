/**
 * テーマ関連ユーティリティ
 */

import { SPOT_COLORS, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';

/**
 * スポットカラーのカラーコードを取得
 * @param color スポットカラーのキー
 * @returns カラーコード（無効な場合はデフォルトの青）
 */
export function getSpotColor(color: string | null | undefined): string {
  if (color && color in SPOT_COLORS) {
    return SPOT_COLORS[color as SpotColor].color;
  }
  return SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
}
