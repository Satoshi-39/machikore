/**
 * エディタスタイル注入用カスタムフック
 *
 * TenTapエディタにパディングとダークモードスタイルを適用する
 */

import { useEffect } from 'react';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';

/** エディタのダークモード背景色（ツールバーと統一） */
export const EDITOR_DARK_BG_COLOR = '#474747';

/** カスタムダークモードCSS（背景色をツールバーと統一） */
const customDarkEditorCss = `
  * {
    background-color: ${EDITOR_DARK_BG_COLOR};
    color: white;
  }
  blockquote {
    border-left: 3px solid #babaca;
    padding-left: 1rem;
  }
  .highlight-background {
    background-color: #5a5a5a;
  }
`;

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
      // エディタ内部のパディングを設定（上部にも余白を追加してスクロール時にヘッダーに被らないようにする）
      editor.injectCSS('.ProseMirror { padding: 16px 16px 0 16px; }', 'editor-padding');
      if (isDarkMode) {
        editor.injectCSS(customDarkEditorCss, 'dark-mode-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady]);
}
