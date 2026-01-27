/**
 * エディタスタイル注入用カスタムフック
 *
 * TenTapエディタにパディングとダークモードスタイルを適用する
 */

import { useEffect } from 'react';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';
import { THUMBNAIL_ASPECT_RATIO, colors } from '@/shared/config';

/** エディタのダークモード背景色（surface と統一） */
export const EDITOR_DARK_BG_COLOR = colors.dark.surface;

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
    border-left: 3px solid ${colors.component.editor['blockquote-border']};
    padding-left: 1rem;
  }
  .highlight-background {
    background-color: ${colors.component.editor['highlight-bg-dark']};
  }
`;

/**
 * description用CSS（サムネイル下の一言 - h1風の大きなスタイル）
 * ProseMirrorはparagraphにclass属性を保持しないため、
 * 位置ベースのセレクタ（サムネイル画像の直後のparagraph）で識別
 *
 * 空判定:
 * - .is-empty / .is-node-empty: TipTap Placeholder extensionが付与（フォーカス時）
 * - :has(> br:only-child): ProseMirrorの空パラグラフ構造を検出（常時）
 */
const createDescriptionCss = (placeholderText: string) => `
  /* サムネイル画像の直後のparagraph = description（h1風） */
  img[alt="__THUMBNAIL__"] + p {
    color: ${colors.component.editor['description-text-light']};
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 0;
    margin-bottom: 20px;
    min-height: 32px;
  }
  /* 空の場合のプレースホルダー
   * - .is-empty/.is-node-empty: TipTapが付与するクラス
   * - :has(> br:only-child): 空パラグラフの構造検出（<p><br></p>のみ）
   */
  img[alt="__THUMBNAIL__"] + p.is-empty::before,
  img[alt="__THUMBNAIL__"] + p.is-node-empty::before,
  img[alt="__THUMBNAIL__"] + p:has(> br:only-child)::before {
    content: '${placeholderText}';
    color: ${colors.component.editor['placeholder-light']};
    font-weight: 400;
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

/** description用ダークモードCSS */
const descriptionDarkCss = `
  img[alt="__THUMBNAIL__"] + p {
    color: ${colors.component.editor['description-text-dark']};
  }
  img[alt="__THUMBNAIL__"] + p.is-empty::before,
  img[alt="__THUMBNAIL__"] + p.is-node-empty::before,
  img[alt="__THUMBNAIL__"] + p:has(> br:only-child)::before {
    color: ${colors.component.editor['placeholder-dark']};
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
    margin-bottom: 16px;
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

/** サムネイルプレースホルダー用ダークモードCSS
 * SVGの色をダークモード用に反転（surface-variant dark: gray.800, on-surface-variant dark: gray.400）
 */
const thumbnailPlaceholderDarkCss = `
  img[alt="__THUMBNAIL__"][src^="data:"] {
    filter: invert(0.85) hue-rotate(180deg);
  }
`;

interface UseEditorStylesParams {
  editor: EditorBridge;
  editorState: BridgeState;
  isDarkMode: boolean;
  /** descriptionのプレースホルダーテキスト（i18n対応） */
  descriptionPlaceholder?: string;
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
  descriptionPlaceholder = '',
}: UseEditorStylesParams) {
  useEffect(() => {
    if (editorState.isReady) {
      // エディタ内部のパディングを設定
      // 下部にツールバーの高さ分の余白を追加して重ならないようにする
      editor.injectCSS(`.ProseMirror { padding: 16px 16px ${BOTTOM_PADDING}px 16px; }`, 'editor-padding');
      // サムネイル画像用のスタイル（1.91:1アスペクト比）
      editor.injectCSS(thumbnailImageCss, 'thumbnail-image-styles');
      // description用のスタイル（プレースホルダー付き）
      if (descriptionPlaceholder) {
        editor.injectCSS(createDescriptionCss(descriptionPlaceholder), 'description-styles');
      }
      if (isDarkMode) {
        editor.injectCSS(customDarkEditorCss, 'dark-mode-styles');
        editor.injectCSS(descriptionDarkCss, 'description-dark-styles');
        editor.injectCSS(thumbnailPlaceholderDarkCss, 'thumbnail-placeholder-dark-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady, descriptionPlaceholder]);
}
