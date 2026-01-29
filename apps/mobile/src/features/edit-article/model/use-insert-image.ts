/**
 * 画像挿入フック
 *
 * カーソル位置に応じて画像を挿入
 * - カーソルが先頭（サムネイル位置）にある場合は末尾に挿入
 * - それ以外はカーソル位置に挿入
 */

import { useCallback } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';
import type { ProseMirrorDoc } from '@/shared/types';

interface UseInsertImageParams {
  editor: EditorBridge;
  editorState: BridgeState;
}

/**
 * 画像挿入ロジックを提供するフック
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
      const json = await editor.getJSON();
      const doc = json as ProseMirrorDoc;
      const imageNode = {
        type: 'image',
        attrs: { src: imageUrl },
      };
      const updatedDoc: ProseMirrorDoc = {
        ...doc,
        content: [...(doc.content || []), imageNode],
      };
      editor.setContent(updatedDoc);
    } else {
      // カーソル位置に挿入
      editor.setImage(imageUrl);
    }
  }, [editor, editorState.isFocused, editorState.selection, editorState.isInDescription]);

  return { handleInsertImage };
}
