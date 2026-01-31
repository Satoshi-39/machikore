/**
 * 画像挿入フック
 *
 * カーソル位置に応じて画像を挿入
 * - カーソルが先頭（サムネイル位置）やフォーカス外の場合は末尾に挿入
 * - それ以外はカーソル位置に挿入
 */

import { useCallback } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';

interface UseInsertImageParams {
  editor: EditorBridge;
  editorState: BridgeState;
}

/**
 * 画像挿入ロジックを提供するフック
 *
 * 注意: getJSON() → setContent() によるドキュメント全置換は行わない。
 * Modal表示中にWebViewからgetJSON()すると不完全なデータが返る場合があり、
 * setContent()で既存コンテンツが消失するため。
 * 代わりに focus('end') → setImage() で安全に挿入する。
 */
export function useInsertImage({ editor, editorState }: UseInsertImageParams) {
  const handleInsertImage = useCallback(async (imageUrl: string) => {
    // selectionの位置をチェック（0 or 1 = 先頭付近 = サムネイル位置）
    const selectionFrom = editorState.selection?.from ?? 0;
    const isAtDocumentStart = selectionFrom <= 1;
    // descriptionノード内にカーソルがある場合も末尾に挿入
    const isInDescription = editorState.isInDescription;

    if (!editorState.isFocused || isAtDocumentStart || isInDescription) {
      // 末尾に挿入（サムネイル画像を上書きしないため）
      // focus('end') でカーソルを末尾に移動してから挿入する
      editor.focus('end');
      // フォーカス移動がWebViewに反映されるのを待つ
      await new Promise((resolve) => setTimeout(resolve, 100));
      editor.setImage(imageUrl);
    } else {
      // カーソル位置に挿入
      editor.setImage(imageUrl);
    }
  }, [editor, editorState.isFocused, editorState.selection, editorState.isInDescription]);

  return { handleInsertImage };
}
