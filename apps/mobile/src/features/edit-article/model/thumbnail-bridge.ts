/**
 * ThumbnailBridge - サムネイル用のユーティリティ
 *
 * サムネイル画像を通常の記事画像と区別するために使用
 * alt属性に特殊な値を設定して識別する
 */

import type { ProseMirrorDoc, ProseMirrorNode } from '@/shared/types';

/** サムネイル画像を識別するためのalt属性値 */
const THUMBNAIL_ALT = '__THUMBNAIL__';

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
