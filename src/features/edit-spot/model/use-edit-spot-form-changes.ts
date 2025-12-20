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
  customName: string;
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
    const spotName = spot.custom_name || spot.master_spot?.name || '';

    // 名前の変更
    if (currentValues.customName.trim() !== spotName) return true;

    // 説明の変更
    const originalDescription = spot.description || '';
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
    currentValues.customName,
    currentValues.description,
    currentValues.tags,
    currentValues.newImages,
    currentValues.deletedImageIds,
    currentValues.selectedMapId,
    currentValues.spotColor,
    currentValues.labelId,
  ]);

  // フォームのバリデーション（スポット名は必須、概要は任意）
  const isFormValid = useMemo(() => {
    // スポット名が空でないことを確認（custom_nameはNOT NULL制約があるため必須）
    return !!currentValues.customName.trim();
  }, [currentValues.customName]);

  return {
    hasChanges,
    isFormValid,
  };
}
