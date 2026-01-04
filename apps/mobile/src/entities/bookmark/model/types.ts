/**
 * Bookmark 型定義
 */

/** ブックマーク情報の型（複数フォルダ対応） */
export type BookmarkInfo = { id: string; folder_id: string | null }[];
