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
 * DescriptionExtensionが出力する p[data-description] を対象
 *
 * 空判定:
 * - .is-empty / .is-node-empty: TipTap Placeholder extensionが付与（フォーカス時）
 * - :has(> br:only-child): ProseMirrorの空パラグラフ構造を検出（常時）
 */
const createDescriptionCss = (placeholderText: string) => `
  /* descriptionノード（h1風） */
  p[data-description] {
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
  p[data-description].is-empty::before,
  p[data-description].is-node-empty::before,
  p[data-description]:has(> br:only-child)::before {
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
  p[data-description] {
    color: ${colors.component.editor['description-text-dark']};
  }
  p[data-description].is-empty::before,
  p[data-description].is-node-empty::before,
  p[data-description]:has(> br:only-child)::before {
    color: ${colors.component.editor['placeholder-dark']};
  }
`;

/** サムネイル画像用CSS（実際の画像: 1.91:1アスペクト比、プレースホルダー: そのまま） */
const thumbnailImageCss = `
  /* サムネイルコンテナ */
  .thumbnail-container {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    cursor: pointer;
  }
  /* 実際のサムネイル画像（http/https、またはbase64のdata URI）
   * プレースホルダー（data:image/svg+xml）は除外
   */
  .thumbnail-container img.thumbnail-image {
    width: calc(100% + 32px);
    max-width: none;
    margin-left: -16px;
    margin-top: -16px;
    margin-bottom: 16px;
    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
    object-fit: cover;
    display: block;
  }
  /* プレースホルダー（thumbnail-placeholderクラスを持つ要素） */
  .thumbnail-container img.thumbnail-placeholder {
    width: auto;
    height: auto;
    cursor: pointer;
    margin-bottom: 16px;
    /* thumbnail-imageスタイルをリセット */
    max-width: 100%;
    margin-left: 0;
    margin-top: 0;
    aspect-ratio: auto;
    object-fit: initial;
  }
  /* ProseMirrorのノード選択スタイルをサムネイルでは無効化 */
  .thumbnail-container.ProseMirror-selectednode,
  .ProseMirror-selectednode .thumbnail-container {
    outline: none !important;
    box-shadow: none !important;
  }
`;

/** サムネイルプレースホルダー用ダークモードCSS
 * SVGの色をダークモード用に反転（surface-variant dark: gray.800, on-surface-variant dark: gray.400）
 */
const thumbnailPlaceholderDarkCss = `
  .thumbnail-container img.thumbnail-placeholder {
    filter: invert(0.85) hue-rotate(180deg);
  }
`;

/** 埋め込みコンテンツ用CSS（選択状態のスタイル） */
const embedCss = `
  /* 埋め込みコンテナ */
  .embed-container {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    transition: outline 0.15s ease;
  }
  /* 選択状態のスタイル */
  .ProseMirror-selectednode .embed-container,
  .embed-container.ProseMirror-selectednode {
    outline: 3px solid ${colors.light.primary};
    outline-offset: 2px;
    border-radius: 8px;
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
      // 埋め込みコンテンツ用のスタイル（選択状態）
      editor.injectCSS(embedCss, 'embed-styles');
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
