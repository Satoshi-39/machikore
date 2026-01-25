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

/**
 * description用CSS（サムネイル下の一言 - h1風の大きなスタイル）
 * ProseMirrorはparagraphにclass属性を保持しないため、
 * 位置ベースのセレクタ（サムネイル画像の直後のparagraph）で識別
 */
const descriptionCss = `
  /* サムネイル画像の直後のparagraph = description（h1風） */
  img[alt="__THUMBNAIL__"] + p {
    color: #111827;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 0;
    margin-bottom: 20px;
    min-height: 32px;
  }
  /* 空の場合のプレースホルダー */
  img[alt="__THUMBNAIL__"] + p:empty::before {
    content: 'スポットの一言を入力...';
    color: #9CA3AF;
    font-weight: 400;
  }
`;

/** description用ダークモードCSS */
const descriptionDarkCss = `
  img[alt="__THUMBNAIL__"] + p {
    color: #F9FAFB;
  }
  img[alt="__THUMBNAIL__"] + p:empty::before {
    color: #6B7280;
  }
`;

/** サムネイル画像用CSS（実際の画像: 1.91:1アスペクト比、プレースホルダー: そのまま） */
const thumbnailImageCss = `
  /* 実際のサムネイル画像（http/httpsで始まる） */
  img[alt="__THUMBNAIL__"]:not([src^="data:"]) {
    width: calc(100% + 32px);
    max-width: none;
    margin-left: -16px;
    margin-top: -16px;
    margin-bottom: 16px;
    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
    object-fit: cover;
    display: block;
  }
  /* プレースホルダー（data:で始まる） */
  img[alt="__THUMBNAIL__"][src^="data:"] {
    width: auto;
    height: auto;
    cursor: pointer;
  }
  /* 共通: 選択UI無効化 */
  img[alt="__THUMBNAIL__"] {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  /* ProseMirrorのノード選択スタイルをサムネイルでは無効化 */
  .ProseMirror-selectednode img[alt="__THUMBNAIL__"],
  img[alt="__THUMBNAIL__"].ProseMirror-selectednode {
    outline: none !important;
    box-shadow: none !important;
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
      // description用のスタイル（プレースホルダー付き）
      editor.injectCSS(descriptionCss, 'description-styles');
      if (isDarkMode) {
        editor.injectCSS(customDarkEditorCss, 'dark-mode-styles');
        editor.injectCSS(descriptionDarkCss, 'description-dark-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady]);
}
