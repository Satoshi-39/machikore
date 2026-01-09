/**
 * スポット編集 Feature 型定義
 */

import type { SelectedImage } from '@/features/pick-images';
import type { SpotColor } from '@/shared/config';

/**
 * 画像アップロードの進捗状態
 */
export interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'updating' | 'uploading' | 'deleting' | 'done';
}

/**
 * スポット編集フォームの現在値
 */
export interface EditSpotFormCurrentValues {
  description: string;
  tags: string[];
  newImages: SelectedImage[];
  deletedImageIds: string[];
  selectedMapId: string | null;
  spotColor: SpotColor;
  labelId: string | null;
  /** 現在地/ピン刺し登録の場合のスポット名 */
  spotName?: string;
}
