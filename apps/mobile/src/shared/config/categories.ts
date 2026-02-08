/**
 * マップカテゴリ定義
 *
 * マップ作成/編集、検索フィルターなどで共通利用
 */

import type { Ionicons } from '@expo/vector-icons';

export type MapCategory = '旅行' | 'グルメ' | '観光' | 'ショッピング' | 'アクティビティ' | 'その他';

export interface CategoryOption {
  value: MapCategory;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const MAP_CATEGORIES: CategoryOption[] = [
  { value: '旅行', labelKey: 'mapCategory.travel', icon: 'airplane' },
  { value: 'グルメ', labelKey: 'mapCategory.gourmet', icon: 'restaurant' },
  { value: '観光', labelKey: 'mapCategory.tourism', icon: 'camera' },
  { value: 'ショッピング', labelKey: 'mapCategory.shopping', icon: 'cart' },
  { value: 'アクティビティ', labelKey: 'mapCategory.activity', icon: 'bicycle' },
  { value: 'その他', labelKey: 'mapCategory.other', icon: 'ellipsis-horizontal' },
];

/**
 * カテゴリ値からオプションを取得
 */
export function getCategoryOption(value: string | null | undefined): CategoryOption | undefined {
  return MAP_CATEGORIES.find((c) => c.value === value);
}
