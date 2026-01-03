/**
 * スポット編集フォームの変更検出hook
 *
 * FSD: features/edit-spot/model に配置
 */

import { useMemo } from 'react';
import type { UserSpotWithMasterSpot } from '@/shared/api/supabase/user-spots';
import type { SelectedImage } from '@/features/pick-images';
import { DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';

interface EditSpotFormCurrentValues {
  description: string;
  tags: string[];
  newImages: SelectedImage[];
  deletedImageIds: string[];
  selectedMapId: string | null;
  spotColor: SpotColor;
  labelId: string | null;
}

/**
 * フォームの変更検出hook
 */
export function useEditSpotFormChanges(
  spot: UserSpotWithMasterSpot,
  initialTags: string[],
  currentValues: EditSpotFormCurrentValues
) {
  const hasChanges = useMemo(() => {
    const originalDescription = spot.description || '';

    // descriptionの変更
    if (currentValues.description.trim() !== originalDescription) return true;

    // タグの変更
    if (currentValues.tags.length !== initialTags.length) return true;
    if (currentValues.tags.some((tag, index) => tag !== initialTags[index])) return true;

    // 新しい画像が追加された
    if (currentValues.newImages.length > 0) return true;

    // 既存画像が削除された
    if (currentValues.deletedImageIds.length > 0) return true;

    // マップの変更
    if (currentValues.selectedMapId !== spot.map_id) return true;

    // スポットカラーの変更
    const originalSpotColor = (spot.spot_color as SpotColor) || DEFAULT_SPOT_COLOR;
    if (currentValues.spotColor !== originalSpotColor) return true;

    // ラベルの変更
    if (currentValues.labelId !== spot.label_id) return true;

    return false;
  }, [
    spot,
    initialTags,
    currentValues.description,
    currentValues.tags,
    currentValues.newImages,
    currentValues.deletedImageIds,
    currentValues.selectedMapId,
    currentValues.spotColor,
    currentValues.labelId,
  ]);

  // フォームのバリデーション（descriptionは必須）
  const isFormValid = useMemo(() => {
    // descriptionが空でないことを確認（NOT NULL制約があるため必須）
    return !!currentValues.description.trim();
  }, [currentValues.description]);

  return {
    hasChanges,
    isFormValid,
  };
}
