/**
 * EditorNodes - エディタ内の特殊ノード用ユーティリティ
 *
 * サムネイル画像とdescription（一言）を通常のコンテンツと区別するために使用
 * - サムネイル: 専用の'thumbnail'ノードタイプを使用
 * - description: 専用の'description'ノードタイプを使用
 */

import type { ProseMirrorDoc, ProseMirrorNode } from '@/shared/types';

/** サムネイル画像を識別するためのalt属性値 */
export const THUMBNAIL_ALT = '__THUMBNAIL__';

/** サムネイルクロップ情報 */
export type ThumbnailCropData = {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
} | null;

/**
 * サムネイルノードを作成
 * srcがnullの場合はエディタ上で非表示になる
 */
function createThumbnailNode(imageUrl: string | null, thumbnailCrop?: ThumbnailCropData): ProseMirrorNode {
  return {
    type: 'thumbnail',
    attrs: {
      src: imageUrl,
      thumbnailCrop: thumbnailCrop ?? null,
    },
  };
}

/**
 * ノードがサムネイルかどうかを判定
 */
function isThumbnailNode(node: ProseMirrorNode): boolean {
  return node.type === 'thumbnail';
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
export function insertThumbnailToDoc(doc: ProseMirrorDoc, imageUrl: string, thumbnailCrop?: ThumbnailCropData): ProseMirrorDoc {
  const thumbnailNode = createThumbnailNode(imageUrl, thumbnailCrop);

  // 既存のコンテンツからサムネイルを除外
  const existingContent = (doc.content || []).filter((node) => !isThumbnailNode(node));

  return {
    ...doc,
    content: [thumbnailNode, ...existingContent],
  };
}

/**
 * ドキュメントの先頭に非表示のサムネイルノードを挿入（src=null）
 * スキーマ維持のためにノードは常に必要だが、表示はしない
 */
export function insertEmptyThumbnailToDoc(doc: ProseMirrorDoc): ProseMirrorDoc {
  const thumbnailNode = createThumbnailNode(null);

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


// ============================================
// Description関連
// ============================================

/**
 * descriptionノードを作成（新しいdescriptionタイプ）
 */
function createDescriptionNode(text: string): ProseMirrorNode {
  if (!text) {
    return {
      type: 'description',
    };
  }

  return {
    type: 'description',
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

/**
 * ノードがdescriptionかどうかを判定
 */
function isDescriptionNode(node: ProseMirrorNode): boolean {
  return node.type === 'description';
}

/**
 * descriptionノードのインデックスを取得
 */
function getDescriptionIndex(content: ProseMirrorNode[]): number {
  return content.findIndex((node) => isDescriptionNode(node));
}

/**
 * ドキュメントからdescriptionノードを除外
 * 保存時にarticle_contentにdescriptionを含めないために使用
 */
export function removeDescriptionFromDoc(doc: ProseMirrorDoc): ProseMirrorDoc {
  if (!doc.content) return doc;

  const filteredContent = doc.content.filter((node) => !isDescriptionNode(node));

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

  // descriptionのcontentからテキストを抽出
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


// ============================================
// テキスト抽出
// ============================================

/**
 * ProseMirrorノードからテキストを再帰的に抽出
 */
function extractTextFromNode(node: ProseMirrorNode): string {
  if (node.type === 'text') {
    return node.text || '';
  }
  if (!node.content) return '';
  return node.content.map(extractTextFromNode).join('');
}

/**
 * ドキュメント全体からテキストを抽出
 * ブロック要素間は改行で区切る
 */
export function extractTextFromDoc(doc: ProseMirrorDoc): string {
  if (!doc.content) return '';
  return doc.content.map(extractTextFromNode).join('\n');
}
