/**
 * マップ編集フォームの変更検知hook
 *
 * FSD: features/edit-map/model に配置
 */

import { useMemo } from 'react';
import type { MapWithUser } from '@/shared/types';
import type { LocalMapLabel } from '@/features/manage-map-labels';
import type { EditMapFormCurrentValues } from './types';

/**
 * ラベルの変更をチェック
 */
function hasLabelChanges(current: LocalMapLabel[], initial: LocalMapLabel[]): boolean {
  // 新規追加されたラベルがあるか
  if (current.some((l) => l.isNew)) return true;
  // 削除予定のラベルがあるか
  if (current.some((l) => l.isDeleted)) return true;
  // 変更されたラベルがあるか
  if (current.some((l) => l.isModified)) return true;
  // 数が違う（削除されたラベルがある場合など）
  if (current.filter((l) => !l.isDeleted).length !== initial.length) return true;

  return false;
}

/**
 * フォームの変更検知hook
 */
export function useEditMapFormChanges(
  map: MapWithUser,
  initialTags: string[],
  initialLabels: LocalMapLabel[],
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
    // ラベルチップ表示設定の変更
    if (currentValues.showLabelChips !== (map.show_label_chips ?? false)) return true;
    // サムネイルの変更
    if (currentValues.thumbnailUri !== map.thumbnail_url) return true;
    // タグの変更（配列の比較）
    if (currentValues.tags.length !== initialTags.length) return true;
    if (currentValues.tags.some((tag, index) => tag !== initialTags[index])) return true;
    // ラベルの変更
    if (hasLabelChanges(currentValues.labels, initialLabels)) return true;

    return false;
  }, [currentValues, map, initialTags, initialLabels]);

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
