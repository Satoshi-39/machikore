/**
 * エディタスタイル注入用カスタムフック
 *
 * TenTapエディタにパディングとダークモードスタイルを適用する
 */

import { useEffect } from 'react';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';
import { THUMBNAIL_ASPECT_RATIO } from '@/shared/config';

/** エディタのダークモード背景色（ツールバーと統一） */
export const EDITOR_DARK_BG_COLOR = '#474747';

/** ツールバー分の下部余白 */
const BOTTOM_PADDING = 16;

/** カスタムダークモードCSS（背景色をツールバーと統一） */
const customDarkEditorCss = `
  *:not(img) {
    background-color: ${EDITOR_DARK_BG_COLOR};
    color: white;
  }
  img {
    background-color: transparent;
  }
  blockquote {
    border-left: 3px solid #babaca;
    padding-left: 1rem;
  }
  .highlight-background {
    background-color: #5a5a5a;
  }
`;

/** サムネイル画像用CSS（1.91:1アスペクト比でトリミング） */
const thumbnailImageCss = `
  img[alt="__THUMBNAIL__"] {
    width: 100%;
    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
    object-fit: cover;
    border-radius: 8px;
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
      // エディタ内部のパディングを設定
      // 下部にツールバーの高さ分の余白を追加して重ならないようにする
      editor.injectCSS(`.ProseMirror { padding: 16px 16px ${BOTTOM_PADDING}px 16px; }`, 'editor-padding');
      // サムネイル画像用のスタイル（1.91:1アスペクト比）
      editor.injectCSS(thumbnailImageCss, 'thumbnail-image-styles');
      if (isDarkMode) {
        editor.injectCSS(customDarkEditorCss, 'dark-mode-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady]);
}
