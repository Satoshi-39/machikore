/**
 * エディタスタイル注入用カスタムフック
 *
 * TenTapエディタにパディングとダークモードスタイルを適用する
 */

import { useEffect } from 'react';
import type { BridgeState, EditorBridge } from '@10play/tentap-editor';
import { THUMBNAIL_ASPECT_RATIO, colors, fontSize, fontWeight, lineHeight, spacing, borderRadius, fontFamily } from '@/shared/config';

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
    border-left: 4px solid ${colors.component.editor['blockquote-border']};
    padding-left: 12px;
  }
  .highlight-background {
    background-color: ${colors.component.editor['highlight-bg-dark']};
  }
`;

/**
 * description用CSS（サムネイル下のひとこと - h1風の大きなスタイル）
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
    font-size: ${fontSize['2xl']};
    font-weight: ${fontWeight.bold};
    line-height: ${lineHeight.snug};
    margin-top: 0;
    margin-bottom: ${spacing[5]};
    min-height: ${spacing[8]};
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
    font-weight: ${fontWeight.normal};
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

/** サムネイル画像用CSS（フルブリード表示） */
const thumbnailImageCss = `
  /* サムネイルコンテナ */
  .thumbnail-container {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  /* サムネイル共通フルブリードスタイル（エディタパディング16pxを相殺） */
  .thumbnail-container img.thumbnail-image,
  .thumbnail-container[data-crop] {
    width: calc(100% + 32px);
    max-width: none;
    margin-left: -16px;
    margin-top: -16px;
    margin-bottom: 16px;
  }
  /* サムネイル画像（非crop） */
  .thumbnail-container img.thumbnail-image {
    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
    object-fit: cover;
    display: block;
  }
  /* サムネイル画像（crop） */
  .thumbnail-container[data-crop] {
    position: relative;
    overflow: hidden;
  }
  /* ProseMirrorのノード選択スタイルをサムネイルでは無効化 */
  .thumbnail-container.ProseMirror-selectednode,
  .ProseMirror-selectednode .thumbnail-container {
    outline: none !important;
    box-shadow: none !important;
  }
`;

/** 段落のvertical rhythm CSS（line-height: loose = 32px、margin: 0） */
const paragraphRhythmCss = `
  .ProseMirror p {
    line-height: ${lineHeight.loose};
    margin-top: 0;
    margin-bottom: 0;
  }
`;

/** 見出し・リスト・コードブロック等のCSS（RichTextRendererと統一） */
const blockElementsCss = `
  /* 見出し */
  .ProseMirror h1 {
    font-size: ${fontSize.xl};
    font-weight: ${fontWeight.bold};
    margin-top: 0;
    margin-bottom: ${spacing[3]};
  }
  .ProseMirror h2 {
    font-size: ${fontSize.lg};
    font-weight: ${fontWeight.bold};
    margin-top: 0;
    margin-bottom: ${spacing[2]};
  }
  .ProseMirror h3 {
    font-size: ${fontSize.base};
    font-weight: ${fontWeight.semibold};
    margin-top: 0;
    margin-bottom: ${spacing[2]};
  }
  /* 引用 */
  .ProseMirror blockquote {
    border-left: 4px solid;
    padding-left: ${spacing[3]};
    margin-top: 0;
    margin-bottom: ${spacing[2]};
    margin-left: 0;
    font-style: italic;
  }
  /* 箇条書き・番号付きリスト */
  .ProseMirror ul,
  .ProseMirror ol {
    margin-top: 0;
    margin-bottom: ${spacing[2]};
    padding-left: ${spacing[4]};
  }
  /* コードブロック */
  .ProseMirror pre {
    border-radius: ${borderRadius.md};
    padding: ${spacing[3]};
    margin-top: 0;
    margin-bottom: ${spacing[2]};
    font-family: ${fontFamily.mono};
    font-size: ${fontSize.sm};
  }
  /* 水平線 */
  .ProseMirror hr {
    border: none;
    height: 1px;
    margin: ${spacing[4]} 0;
  }
`;

/** 記事内画像用CSS（サムネイル以外のimg要素にmax-widthを適用） */
const articleImageCss = `
  .ProseMirror img:not(.thumbnail-image) {
    max-width: 100%;
    height: auto;
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
      // 段落のvertical rhythm（行間・マージン統一）
      editor.injectCSS(paragraphRhythmCss, 'paragraph-rhythm');
      // 見出し・リスト・コードブロック等のスタイル（RichTextRendererと統一）
      editor.injectCSS(blockElementsCss, 'block-elements');
      // サムネイル画像用のスタイル（1.91:1アスペクト比）
      editor.injectCSS(thumbnailImageCss, 'thumbnail-image-styles');
      // 記事内画像用のスタイル（max-width制約）
      editor.injectCSS(articleImageCss, 'article-image-styles');
      // 埋め込みコンテンツ用のスタイル（選択状態）
      editor.injectCSS(embedCss, 'embed-styles');
      // description用のスタイル（プレースホルダー付き）
      if (descriptionPlaceholder) {
        editor.injectCSS(createDescriptionCss(descriptionPlaceholder), 'description-styles');
      }
      if (isDarkMode) {
        editor.injectCSS(customDarkEditorCss, 'dark-mode-styles');
        editor.injectCSS(descriptionDarkCss, 'description-dark-styles');
      }
    }
  }, [editor, isDarkMode, editorState.isReady, descriptionPlaceholder]);
}
