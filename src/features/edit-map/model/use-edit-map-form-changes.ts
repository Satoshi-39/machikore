/**
 * マップ編集フォームの変更検知hook
 *
 * FSD: features/edit-map/model に配置
 */

import { useMemo } from 'react';
import type { UserMapThemeColor } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

interface EditMapFormCurrentValues {
  name: string;
  description: string;
  selectedCategoryId: string | null;
  isPublic: boolean;
  themeColor: UserMapThemeColor;
  thumbnailUri: string | null;
  tags: string[];
}

/**
 * フォームの変更検知hook
 */
export function useEditMapFormChanges(
  map: MapWithUser,
  initialTags: string[],
  currentValues: EditMapFormCurrentValues
) {
  const hasChanges = useMemo(() => {
    // 名前の変更
    if (currentValues.name.trim() !== map.name) return true;
    // 説明の変更
    if (currentValues.description.trim() !== (map.description || '')) return true;
    // カテゴリの変更
    if (currentValues.selectedCategoryId !== map.category_id) return true;
    // 公開設定の変更
    if (currentValues.isPublic !== map.is_public) return true;
    // テーマカラーの変更
    if (currentValues.themeColor !== (map.theme_color || 'pink')) return true;
    // サムネイルの変更
    if (currentValues.thumbnailUri !== map.thumbnail_url) return true;
    // タグの変更（配列の比較）
    if (currentValues.tags.length !== initialTags.length) return true;
    if (currentValues.tags.some((tag, index) => tag !== initialTags[index])) return true;

    return false;
  }, [currentValues, map, initialTags]);

  const isFormValid = useMemo(() => {
    return !!(
      currentValues.name.trim() &&
      currentValues.description.trim() &&
      currentValues.selectedCategoryId
    );
  }, [currentValues.name, currentValues.description, currentValues.selectedCategoryId]);

  return {
    hasChanges,
    isFormValid,
  };
}
