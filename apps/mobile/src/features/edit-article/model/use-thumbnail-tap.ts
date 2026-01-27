/**
 * サムネイルタップ検知用カスタムフック
 *
 * ThumbnailExtensionからのタップイベントを処理する
 * 削除防止はThumbnailExtensionのisolating: trueで実現
 */

import { useCallback } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';

interface UseThumbnailTapParams {
  editor: EditorBridge;
  editorState: BridgeState;
  onThumbnailTap: () => void;
}

/**
 * サムネイル画像のタップ検知フック
 *
 * - ThumbnailExtensionからのpostMessageを受信してコールバックを実行
 * - 削除防止はExtensionのisolating: trueで自動的に実現
 */
export function useThumbnailTap({
  onThumbnailTap,
}: UseThumbnailTapParams) {
  // WebViewからのメッセージを処理するハンドラー
  const handleWebViewMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        // ThumbnailExtensionからのタップイベント
        if (message.type === 'thumbnail-tap') {
          onThumbnailTap();
        }
      } catch {
        // TenTapの内部メッセージは無視
      }
    },
    [onThumbnailTap]
  );

  return { handleWebViewMessage };
}
