/**
 * マップ作成 Feature 型定義
 */

import type { ThumbnailImage } from '@/features/pick-images';

/**
 * マップ作成フォームの送信データ
 */
export interface CreateMapFormData {
  name: string;
  description?: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
  thumbnailImage?: ThumbnailImage;
}

/**
 * マップ作成フォームのバリデーション用値
 */
export interface CreateMapFormValues {
  name: string;
  description: string;
  selectedCategoryId: string | null;
}
