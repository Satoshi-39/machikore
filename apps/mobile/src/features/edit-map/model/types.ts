/**
 * マップ編集 Feature 型定義
 */

import type { ThumbnailImage } from '@/features/pick-images';
import type { LocalMapLabel } from '@/features/manage-map-labels';

/**
 * マップ編集フォームの現在値
 */
export interface EditMapFormCurrentValues {
  name: string;
  description: string;
  selectedCategoryId: string | null;
  isPublic: boolean;
  showLabelChips: boolean;
  thumbnailUri: string | null;
  tags: string[];
  labels: LocalMapLabel[];
}

/**
 * マップ編集フォームの送信データ
 */
export interface EditMapFormData {
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
  showLabelChips: boolean;
  thumbnailImage?: ThumbnailImage;
  removeThumbnail?: boolean;
  labels?: LocalMapLabel[];
}

/**
 * useEditMapFormのオプション
 */
export interface UseEditMapFormOptions {
  mapId: string;
}
