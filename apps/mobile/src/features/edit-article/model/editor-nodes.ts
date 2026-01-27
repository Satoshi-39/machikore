/**
 * EditorNodes - エディタ内の特殊ノード用ユーティリティ
 *
 * サムネイル画像とdescription（一言）を通常のコンテンツと区別するために使用
 * - サムネイル: alt属性に特殊な値を設定して識別
 * - description: paragraphにclassを設定して識別
 */

import type { ProseMirrorDoc, ProseMirrorNode } from '@/shared/types';

/** サムネイル画像を識別するためのalt属性値 */
export const THUMBNAIL_ALT = '__THUMBNAIL__';

/** プレースホルダー画像のdata URI（SVG: 枠付き画像アイコン + テキスト）
 * ライトモード用: surface-variant (#F9FAFB) + on-surface-variant (#9CA3AF)
 * ダークモードはCSSでフィルタ適用
 * アイコン: Ionicons image-outline風（枠付き山+太陽）
 */
export const THUMBNAIL_PLACEHOLDER_URI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='190' height='32' viewBox='0 0 190 32'%3E%3Crect fill='%23F9FAFB' width='190' height='32' rx='6'/%3E%3Cg fill='none' stroke='%239CA3AF' stroke-width='1.5'%3E%3Crect x='8' y='6' width='20' height='20' rx='3'/%3E%3Ccircle cx='14' cy='12' r='2' fill='%239CA3AF' stroke='none'/%3E%3Cpath d='M8 22l5-5 3 3 5-6 7 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='34' y='21' fill='%239CA3AF' font-family='sans-serif' font-size='13'%3Eサムネイルを追加%3C/text%3E%3C/svg%3E`;

/**
 * サムネイル画像ノードを作成
 * alt属性で識別するため、通常のImageBridgeで表示可能
 */
function createThumbnailNode(imageUrl: string): ProseMirrorNode {
  return {
    type: 'image',
    attrs: {
      src: imageUrl,
      alt: THUMBNAIL_ALT,
    },
  };
}

/**
 * ノードがサムネイルかどうかを判定
 */
function isThumbnailNode(node: ProseMirrorNode): boolean {
  return node.type === 'image' && node.attrs?.alt === THUMBNAIL_ALT;
}

/**
 * ドキュメントからサムネイルノードを除外
 * 保存時にarticle_contentにサムネイルを含めないために使用
 */
export function removeThumbnailFromDoc(doc: ProseMirrorDoc): ProseMirrorDoc {
  if (!doc.content) return doc;

  const filteredContent = doc.content.filter((node) => !isThumbnailNode(node));

  return {
    ...doc,
    content: filteredContent,
  };
}

/**
 * ドキュメントの先頭にサムネイルノードを挿入（既存のサムネイルは置換）
 */
export function insertThumbnailToDoc(doc: ProseMirrorDoc, imageUrl: string): ProseMirrorDoc {
  const thumbnailNode = createThumbnailNode(imageUrl);

  // 既存のコンテンツからサムネイルを除外
  const existingContent = (doc.content || []).filter((node) => !isThumbnailNode(node));

  return {
    ...doc,
    content: [thumbnailNode, ...existingContent],
  };
}

/**
 * ドキュメントからサムネイルのURLを取得
 */
export function getThumbnailFromDoc(doc: ProseMirrorDoc): string | null {
  if (!doc.content) return null;

  for (const node of doc.content) {
    if (isThumbnailNode(node)) {
      const src = node.attrs?.src;
      if (typeof src === 'string') {
        return src;
      }
    }
  }
  return null;
}

/**
 * ドキュメントの先頭にプレースホルダーを挿入（既存のサムネイル/プレースホルダーは置換）
 */
export function insertPlaceholderToDoc(doc: ProseMirrorDoc): ProseMirrorDoc {
  const placeholderNode = createThumbnailNode(THUMBNAIL_PLACEHOLDER_URI);

  // 既存のコンテンツからサムネイル/プレースホルダーを除外
  const existingContent = (doc.content || []).filter((node) => !isThumbnailNode(node));

  return {
    ...doc,
    content: [placeholderNode, ...existingContent],
  };
}

/**
 * サムネイルがプレースホルダーかどうかを判定
 */
export function isPlaceholder(imageUrl: string | null): boolean {
  return imageUrl === THUMBNAIL_PLACEHOLDER_URI;
}

// ============================================
// Description関連
// ============================================

/**
 * descriptionノードを作成
 * サムネイルの直後に配置されるparagraph
 * ProseMirrorはparagraphにclass属性を保持しないため、位置ベースで識別
 */
function createDescriptionNode(text: string): ProseMirrorNode {
  if (!text) {
    return {
      type: 'paragraph',
    };
  }

  return {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

/**
 * サムネイルの直後のノードインデックスを取得
 * descriptionは位置ベースで識別（サムネイルの直後のparagraph）
 */
function getDescriptionIndex(content: ProseMirrorNode[]): number {
  const thumbnailIndex = content.findIndex((node) => isThumbnailNode(node));
  if (thumbnailIndex >= 0 && thumbnailIndex + 1 < content.length) {
    const nextNode = content[thumbnailIndex + 1];
    if (nextNode && nextNode.type === 'paragraph') {
      return thumbnailIndex + 1;
    }
  }
  return -1;
}

/**
 * ドキュメントからdescriptionノードを除外
 * 保存時にarticle_contentにdescriptionを含めないために使用
 */
export function removeDescriptionFromDoc(doc: ProseMirrorDoc): ProseMirrorDoc {
  if (!doc.content) return doc;

  const descriptionIndex = getDescriptionIndex(doc.content);
  if (descriptionIndex < 0) return doc;

  const filteredContent = doc.content.filter((_, index) => index !== descriptionIndex);

  return {
    ...doc,
    content: filteredContent,
  };
}

/**
 * ドキュメントからdescriptionテキストを取得
 */
export function getDescriptionFromDoc(doc: ProseMirrorDoc): string {
  if (!doc.content) return '';

  const descriptionIndex = getDescriptionIndex(doc.content);
  if (descriptionIndex < 0) return '';

  const descriptionNode = doc.content[descriptionIndex];
  if (!descriptionNode) return '';

  // paragraphのcontentからテキストを抽出
  if (descriptionNode.content && descriptionNode.content.length > 0) {
    return descriptionNode.content
      .filter((child) => child.type === 'text')
      .map((child) => child.text || '')
      .join('');
  }
  return '';
}

/**
 * サムネイルの直後にdescriptionノードを挿入
 * （既存のdescriptionは置換）
 */
export function insertDescriptionToDoc(doc: ProseMirrorDoc, description: string): ProseMirrorDoc {
  const descriptionNode = createDescriptionNode(description);

  // まず既存のdescriptionを除外
  const docWithoutDescription = removeDescriptionFromDoc(doc);
  const content = docWithoutDescription.content || [];

  // サムネイルの位置を探す
  const thumbnailIndex = content.findIndex((node) => isThumbnailNode(node));

  if (thumbnailIndex >= 0) {
    // サムネイルの直後に挿入
    const newContent = [
      ...content.slice(0, thumbnailIndex + 1),
      descriptionNode,
      ...content.slice(thumbnailIndex + 1),
    ];
    return { ...doc, content: newContent };
  }

  // サムネイルがない場合は先頭に挿入
  return {
    ...doc,
    content: [descriptionNode, ...content],
  };
}
