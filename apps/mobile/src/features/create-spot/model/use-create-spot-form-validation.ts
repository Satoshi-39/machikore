/**
 * スポット作成フォームのバリデーションhook
 *
 * FSD: features/create-spot/model に配置
 */

import { useMemo } from 'react';
import type { CreateSpotFormValues } from './types';

/**
 * フォームのバリデーションhook
 */
export function useCreateSpotFormValidation(currentValues: CreateSpotFormValues) {
  const isFormValid = useMemo(() => {
    // 一言説明とマップ選択は必須
    return !!(
      currentValues.description.trim() &&
      currentValues.selectedMapId
    );
  }, [currentValues.description, currentValues.selectedMapId]);

  return {
    isFormValid,
  };
}
