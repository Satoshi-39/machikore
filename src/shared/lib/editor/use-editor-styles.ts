/**
 * エディタスタイル注入用カスタムフック
 *
 * TenTapエディタにパディングとダークモードスタイルを適用する
 */

import { useEffect } from 'react';
import { darkEditorCss } from '@10play/tentap-editor';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';

interface UseEditorStylesParams {
  editor: EditorBridge;
  editorState: BridgeState;
  isDarkMode: boolean;
}

/**
 * エディタにスタイルを注入する
 * - 内部パディング（左右16px）
 * - ダークモード時のスタイル
 */
export function useEditorStyles({
  editor,
  editorState,
  isDarkMode,
}: UseEditorStylesParams) {
  useEffect(() => {
    if (editorState.isReady) {
      // エディタ内部のパディングを設定
      editor.injectCSS('.ProseMirror { padding: 0 16px; }', 'editor-padding');
      if (isDarkMode) {
        editor.injectCSS(darkEditorCss, 'dark-mode-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady]);
}
