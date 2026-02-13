/**
 * 画像・サムネイル設定
 * 全アプリ共通（mobile / web / admin）
 */

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/** 画像リサイズ時の最大幅/高さ（px） */
export const MAX_IMAGE_DIMENSION = 1920;

/**
 * サムネイル画像のアスペクト比
 * OGP/SNSシェア推奨の1.91:1を採用（note/X/Facebook準拠）
 * マップ・スポット共通で使用
 */
export const THUMBNAIL_ASPECT_RATIO = 1.91;

/**
 * 幅からサムネイルの高さを計算するヘルパー関数
 */
export function getThumbnailHeight(width: number): number {
  return Math.round(width / THUMBNAIL_ASPECT_RATIO);
}
