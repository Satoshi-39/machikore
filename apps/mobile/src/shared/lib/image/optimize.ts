/**
 * 画像最適化ユーティリティ
 *
 * CDN経由で画像をリサイズ・最適化するためのヘルパー関数
 * 現在はSupabase Image Transformationを使用
 * 将来的にCloudflare等に移行する場合、このファイルのみ変更すればOK
 *
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */

/**
 * Image Transformationが有効かどうか
 * Supabase Pro Plan以上で有効にする
 * 環境変数 EXPO_PUBLIC_ENABLE_IMAGE_TRANSFORM=true で有効化
 */
const isImageTransformEnabled = process.env.EXPO_PUBLIC_ENABLE_IMAGE_TRANSFORM === 'true';

/**
 * 画像変換オプション
 */
export interface ImageTransformOptions {
  /** 幅 (1-2500px) */
  width?: number;
  /** 高さ (1-2500px) */
  height?: number;
  /** 品質 (20-100、デフォルト80) */
  quality?: number;
  /** リサイズモード */
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * 最適化された画像URLを取得
 *
 * 注意: Supabase Image TransformationはPro Plan以上で利用可能
 * Free Planの場合は環境変数を設定せず、元URLをそのまま返す
 *
 * @example
 * ```typescript
 * // 基本的な使用
 * const url = getOptimizedImageUrl(originalUrl, { width: 400 });
 *
 * // プリセットを使用
 * const url = getOptimizedImageUrl(originalUrl, IMAGE_PRESETS.avatar);
 * ```
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: ImageTransformOptions = {}
): string | null {
  if (!url) return null;

  // Image Transformationが無効の場合は元URLを返す（Free Plan対応）
  if (!isImageTransformEnabled) {
    return url;
  }

  // Supabase Storage URLでない場合はそのまま返す
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !url.includes(supabaseUrl)) {
    return url;
  }

  // 画像変換が不要な場合はそのまま返す
  const { width, height, quality = 80, resize = 'cover' } = options;
  if (!width && !height) {
    return url;
  }

  // /object/public/ を /render/image/public/ に変換
  const transformedUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  // クエリパラメータを構築
  const params = new URLSearchParams();
  if (width) params.append('width', String(width));
  if (height) params.append('height', String(height));
  params.append('quality', String(quality));
  // widthとheightの両方が指定されている場合のみresizeを適用
  if (width && height) {
    params.append('resize', resize);
  }

  return `${transformedUrl}?${params.toString()}`;
}

/**
 * 表示サイズに基づいた最適な画像幅を計算
 * Retina対応のため2倍サイズを返す
 */
export function getOptimalWidth(displayWidth: number): number {
  // Retinaディスプレイ対応で2倍
  const optimalWidth = Math.ceil(displayWidth * 2);
  // Supabaseの制限（最大2500px）に収める
  return Math.min(optimalWidth, 2500);
}

// ===============================
// プリセット（よく使うサイズ）
// ===============================

export const IMAGE_PRESETS = {
  /** アバター（40-48px表示用、正方形） */
  avatar: { width: 96, height: 96, quality: 80 },
  /** アバター大（96px表示用、正方形） */
  avatarLarge: { width: 192, height: 192, quality: 80 },
  /** マップサムネイル（フィード用、1.91:1アスペクト比） */
  mapThumbnail: { width: 656, height: 344, quality: 75 },
  /** マップサムネイル（グリッド用、小さめ、1.91:1） */
  mapThumbnailSmall: { width: 400, height: 210, quality: 75 },
  /** スポット画像（グリッド用、正方形） */
  spotGrid: { width: 324, height: 324, quality: 75 },
  /** スポット画像（1枚表示、正方形） */
  spotSingle: { width: 656, height: 656, quality: 80 },
  /** フルスクリーン表示用（高さは指定なし、アスペクト比維持） */
  fullscreen: { width: 1200, quality: 85 },
} as const;

export type ImagePresetKey = keyof typeof IMAGE_PRESETS;
