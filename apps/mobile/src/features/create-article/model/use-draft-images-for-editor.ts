/**
 * ドラフト画像をエディタ用に変換するフック
 *
 * スポット作成時にローカル画像をBase64 data URIに変換
 * WebView内でfile:// URIは読み込めないため、data:image/jpeg;base64,...形式に変換
 */

import { useState, useEffect } from 'react';
import type { SpotImage } from '@/features/edit-article/ui/InsertMenu';
import { convertToBase64DataUri } from '@/shared/lib/image';
import { log } from '@/shared/config/logger';

interface DraftImage {
  uri: string;
  width: number;
  height: number;
}

interface UseDraftImagesForEditorResult {
  /** Base64変換済みの画像リスト（エディタに渡す用） */
  spotImages: SpotImage[];
  /** 変換中かどうか */
  isConverting: boolean;
}

/**
 * ドラフト画像をエディタ用のSpotImage形式に変換
 *
 * ローカルファイルURI（file://...）をBase64 data URIに変換し、
 * WebView内のエディタで表示できるようにする
 *
 * @param draftImages - ドラフト画像のリスト（ローカルURI）
 * @returns Base64変換済みのSpotImageリストと変換状態
 */
export function useDraftImagesForEditor(
  draftImages: DraftImage[]
): UseDraftImagesForEditorResult {
  const [spotImages, setSpotImages] = useState<SpotImage[]>([]);
  const [isConverting, setIsConverting] = useState(true);

  useEffect(() => {
    const convertImages = async () => {
      if (draftImages.length === 0) {
        setSpotImages([]);
        setIsConverting(false);
        return;
      }

      setIsConverting(true);
      try {
        const converted = await Promise.all(
          draftImages.map(async (img, index) => {
            const base64Uri = await convertToBase64DataUri(img.uri);
            return {
              id: String(index),
              cloud_path: base64Uri,
              order_index: index,
            };
          })
        );
        setSpotImages(converted);
      } catch (error) {
        log.error('[useDraftImagesForEditor] Base64変換エラー:', error);
        // エラー時は元のURIをそのまま使用（表示されない可能性あり）
        setSpotImages(
          draftImages.map((img, index) => ({
            id: String(index),
            cloud_path: img.uri,
            order_index: index,
          }))
        );
      } finally {
        setIsConverting(false);
      }
    };

    convertImages();
  }, [draftImages]);

  return {
    spotImages,
    isConverting,
  };
}
