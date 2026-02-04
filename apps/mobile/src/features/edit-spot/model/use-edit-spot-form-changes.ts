/**
 * スポット編集フォームの変更検出hook
 *
 * FSD: features/edit-spot/model に配置
 */

import { useMemo } from 'react';
import { DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';
import type { EditSpotFormCurrentValues } from './types';

/**
 * フォームの変更検出hook
 */
export function useEditSpotFormChanges(
  spot: SpotWithDetails,
  initialTags: string[],
  currentValues: EditSpotFormCurrentValues
) {
  const hasChanges = useMemo(() => {
    // 一言の変更
    const originalDescription = spot.description ?? '';
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

    // スポット名の変更（現在地/ピン刺し登録の場合のみ、TEXT型をそのまま比較）
    if (currentValues.spotName !== undefined) {
      const isManualRegistration = !spot.master_spot_id;
      if (isManualRegistration) {
        const originalSpotName = spot.name || '';
        if (currentValues.spotName.trim() !== originalSpotName) return true;
      }
    }

    // 公開/非公開の変更
    const originalIsPublic = 'is_public' in spot ? (spot.is_public ?? true) : true;
    if (currentValues.isPublic !== originalIsPublic) return true;

    // サムネイルの変更
    const originalThumbnailId = spot.thumbnail_image_id ?? null;
    if (currentValues.thumbnailImageId !== originalThumbnailId) return true;
    // クロップ座標の変更（新しいクロップが作成された場合のみ判定）
    // thumbnailCrop が null = ユーザーが新しいクロップを行っていない（変更なし）
    // サムネイル削除は thumbnailImageId の変更で検知済み
    if (currentValues.thumbnailCrop !== null) {
      const originalCrop = spot.thumbnail_crop;
      if (!originalCrop) return true; // 新しくクロップが追加された
      if (
        currentValues.thumbnailCrop.originX !== originalCrop.originX ||
        currentValues.thumbnailCrop.originY !== originalCrop.originY ||
        currentValues.thumbnailCrop.width !== originalCrop.width ||
        currentValues.thumbnailCrop.height !== originalCrop.height
      ) return true;
    }

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
    currentValues.spotName,
    currentValues.isPublic,
    currentValues.thumbnailImageId,
    currentValues.thumbnailCrop,
  ]);

  // フォームのバリデーション（descriptionは必須）
  const isFormValid = useMemo(() => {
    return !!currentValues.description.trim();
  }, [currentValues.description]);

  return {
    hasChanges,
    isFormValid,
  };
}
