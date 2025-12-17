/**
 * スポット作成フォームのバリデーションhook
 *
 * FSD: features/create-spot/model に配置
 */

import { useMemo } from 'react';

interface CreateSpotFormValues {
  customName: string;
  description: string;
  selectedMapId: string | null;
}

/**
 * フォームのバリデーションhook
 */
export function useCreateSpotFormValidation(currentValues: CreateSpotFormValues) {
  const isFormValid = useMemo(() => {
    // スポット名とひとことは必須
    return !!(
      currentValues.customName.trim() &&
      currentValues.description.trim() &&
      currentValues.selectedMapId
    );
  }, [currentValues.customName, currentValues.description, currentValues.selectedMapId]);

  return {
    isFormValid,
  };
}
