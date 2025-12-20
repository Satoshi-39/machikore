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
    // スポット名とマップ選択は必須（概要は任意）
    return !!(
      currentValues.customName.trim() &&
      currentValues.selectedMapId
    );
  }, [currentValues.customName, currentValues.selectedMapId]);

  return {
    isFormValid,
  };
}
