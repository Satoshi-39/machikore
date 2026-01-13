/**
 * 検索履歴の型定義
 */

/**
 * 検索履歴アイテム
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

/**
 * 検索タイプ
 * - discover: 発見タブの検索
 * - defaultMap: デフォルトマップの検索
 * - userMap: ユーザーマップの検索
 */
export type SearchHistoryType = 'discover' | 'defaultMap' | 'userMap';
