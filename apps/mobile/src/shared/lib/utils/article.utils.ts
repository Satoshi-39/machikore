/**
 * 記事関連ユーティリティ
 */

import type { ProseMirrorDoc } from '@/shared/types';

/**
 * 記事コンテンツが空かどうかを判定
 */
export function isEmptyArticle(doc: ProseMirrorDoc | null): boolean {
  if (!doc) return true;
  if (!doc.content || doc.content.length === 0) return true;
  if (doc.content.length === 1) {
    const firstNode = doc.content[0];
    if (!firstNode) return true;
    if (
      firstNode.type === 'paragraph' &&
      (!firstNode.content || firstNode.content.length === 0)
    ) {
      return true;
    }
  }
  return false;
}
