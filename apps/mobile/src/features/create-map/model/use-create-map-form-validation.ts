/**
 * マップ作成フォームのバリデーションhook
 *
 * FSD: features/create-map/model に配置
 */

import { useMemo } from 'react';

interface CreateMapFormValues {
  name: string;
  description: string;
  selectedCategoryId: string | null;
}

/**
 * フォームのバリデーションhook
 */
export function useCreateMapFormValidation(currentValues: CreateMapFormValues) {
  const isFormValid = useMemo(() => {
    return !!(
      currentValues.name.trim() &&
      currentValues.description.trim() &&
      currentValues.selectedCategoryId
    );
  }, [currentValues.name, currentValues.description, currentValues.selectedCategoryId]);

  return {
    isFormValid,
  };
}
