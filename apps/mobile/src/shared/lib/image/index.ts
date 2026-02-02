/**
 * 画像関連ユーティリティ
 */

export {
  getOptimizedImageUrl,
  getOptimalWidth,
  IMAGE_PRESETS,
  type ImageTransformOptions,
  type ImagePresetKey,
} from './optimize';

export {
  prefetchImage,
  prefetchImages,
  prefetchMapCard,
  prefetchMapCards,
  prefetchSpotImages,
  prefetchFullscreenImages,
} from './prefetch';

export { convertToJpeg, convertToBase64DataUri, type ConvertedImage } from './convert';

export { cropImage, type CropResult } from './crop';

/**
 * サムネイルのクロップ座標（DB保存用）
 * CropZoomの出力座標 + 元画像サイズ
 */
export interface ThumbnailCrop {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
}

export {
  requestImagePermission,
  showImagePickerMenu,
  showImageLimitAlert,
  showImageUploadErrorAlert,
  showImageProcessErrorAlert,
  showSpotNotFoundAlert,
} from './pick-image';

export {
  saveDraftImage,
  deleteDraftImage,
  deleteDraftImages,
  clearAllDraftImages,
  getDraftImagesDirSize,
  cleanupExpiredDraftImages,
} from './local-storage';
