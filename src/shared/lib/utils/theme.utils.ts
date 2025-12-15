/**
 * テーマ関連ユーティリティ
 */

import { USER_MAP_THEME_COLORS, type UserMapThemeColor } from '@/shared/config';
import { colors } from '@/shared/config';

/**
 * マップのテーマカラーを取得
 * @param themeColor テーマカラーのキー
 * @returns カラーコード（無効な場合はデフォルトのプライマリカラー）
 */
export function getMapThemeColor(themeColor: string | null | undefined): string {
  if (themeColor && themeColor in USER_MAP_THEME_COLORS) {
    return USER_MAP_THEME_COLORS[themeColor as UserMapThemeColor].color;
  }
  return colors.primary.DEFAULT;
}
