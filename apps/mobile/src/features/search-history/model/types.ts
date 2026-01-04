/**
 * 検索履歴 Feature 型定義
 */

/**
 * 検索履歴の種類
 */
export type SearchHistoryType = 'defaultMap' | 'userMap' | 'discover';

/**
 * 検索結果のタイプ
 */
export type SearchResultType = 'machi' | 'spot' | 'place' | 'city' | 'prefecture' | 'region' | 'country';

/**
 * 検索履歴アイテム（AsyncStorage用）
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultType?: SearchResultType;
}

/**
 * 検索履歴レコード（Supabase用）
 */
export interface SearchHistoryRecord {
  id: string;
  user_id: string;
  query: string;
  search_type: string;
  searched_at: string;
  created_at: string;
}

/**
 * useSearchHistoryのオプション
 */
export interface UseSearchHistoryOptions {
  type: SearchHistoryType;
}

/**
 * useSearchHistoryの戻り値
 */
export interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  isLoading: boolean;
  addHistory: (query: string, resultType?: SearchResultType) => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useDiscoverSearchHistoryの戻り値
 */
export interface UseDiscoverSearchHistoryReturn {
  history: SearchHistoryItem[];
  isLoading: boolean;
  addHistory: (query: string) => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}
