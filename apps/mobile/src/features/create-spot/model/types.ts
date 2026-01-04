/**
 * スポット作成 Feature 型定義
 */

import type { SpotLocationInput } from '@/features/search-places';
import type { SelectedImage } from '@/features/pick-images';
import type { SpotColor } from '@/shared/config';
import type { ProseMirrorDoc, MapWithUser } from '@/shared/types';

/**
 * 画像アップロードの進捗状態
 */
export interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'creating' | 'uploading' | 'done';
}

/**
 * スポット作成フォームの値
 */
export interface CreateSpotFormValues {
  description: string;
  selectedMapId: string | null;
}

/**
 * スポット作成フォームのProps
 */
export interface CreateSpotFormProps {
  placeData: SpotLocationInput;
  onSubmit: (data: {
    description: string;
    articleContent?: ProseMirrorDoc | null;
    tags: string[];
    images: SelectedImage[];
    mapId: string;
    spotColor: SpotColor;
    labelId?: string | null;
  }) => void;
  isLoading?: boolean;
  uploadProgress?: UploadProgress;
  userMaps?: MapWithUser[];
  isMapsLoading?: boolean;
  selectedMapId?: string | null;
}
