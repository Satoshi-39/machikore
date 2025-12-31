/**
 * マップカテゴリ定義
 *
 * マップ作成/編集、検索フィルターなどで共通利用
 */

import type { Ionicons } from '@expo/vector-icons';

export type MapCategory = '旅行' | 'グルメ' | '観光' | 'ショッピング' | 'アクティビティ' | 'その他';

export interface CategoryOption {
  value: MapCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const MAP_CATEGORIES: CategoryOption[] = [
  { value: '旅行', label: '旅行', icon: 'airplane' },
  { value: 'グルメ', label: 'グルメ', icon: 'restaurant' },
  { value: '観光', label: '観光', icon: 'camera' },
  { value: 'ショッピング', label: 'ショッピング', icon: 'cart' },
  { value: 'アクティビティ', label: 'アクティビティ', icon: 'bicycle' },
  { value: 'その他', label: 'その他', icon: 'ellipsis-horizontal' },
];

/**
 * カテゴリ値からオプションを取得
 */
export function getCategoryOption(value: string | null | undefined): CategoryOption | undefined {
  return MAP_CATEGORIES.find((c) => c.value === value);
}
