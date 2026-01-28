/**
 * スポット編集フォームの変更検出hook
 *
 * FSD: features/edit-spot/model に配置
 */

import { useMemo } from 'react';
import { DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';
import type { EditSpotFormCurrentValues } from './types';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { getCurrentLocale } from '@/shared/lib/i18n';
import { useEditSpotStore } from './use-edit-spot-store';

/**
 * フォームの変更検出hook
 */
export function useEditSpotFormChanges(
  spot: SpotWithDetails,
  initialTags: string[],
  currentValues: Omit<EditSpotFormCurrentValues, 'description'> & { description?: string }
) {
  // Zustandストアからの変更検知（一言のみ）
  const isDescriptionChanged = useEditSpotStore((state) => state.isDescriptionChanged);
  const draftDescription = useEditSpotStore((state) => state.draftDescription);

  const hasFormChanges = useMemo(() => {
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

    // スポット名の変更（現在地/ピン刺し登録の場合のみ）
    if (currentValues.spotName !== undefined) {
      const isManualRegistration = !spot.master_spot_id;
      if (isManualRegistration) {
        const uiLanguage = getCurrentLocale();
        const originalSpotName = spot.name ? extractName(spot.name, uiLanguage) || '' : '';
        if (currentValues.spotName.trim() !== originalSpotName) return true;
      }
    }

    // 公開/非公開の変更
    const originalIsPublic = 'is_public' in spot ? (spot.is_public ?? true) : true;
    if (currentValues.isPublic !== originalIsPublic) return true;

    return false;
  }, [
    spot,
    initialTags,
    currentValues.tags,
    currentValues.newImages,
    currentValues.deletedImageIds,
    currentValues.selectedMapId,
    currentValues.spotColor,
    currentValues.labelId,
    currentValues.spotName,
    currentValues.isPublic,
  ]);

  // フォームの変更 または ストアの変更（一言）がある場合は変更あり
  const hasChanges = hasFormChanges || isDescriptionChanged;

  // フォームのバリデーション（descriptionは必須）
  // ストアからdraftDescriptionを取得、なければspotから
  const isFormValid = useMemo(() => {
    const description = draftDescription ?? spot.description ?? '';
    return !!description.trim();
  }, [draftDescription, spot.description]);

  return {
    hasChanges,
    isFormValid,
  };
}
