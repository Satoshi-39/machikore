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
