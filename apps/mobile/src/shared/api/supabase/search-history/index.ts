/**
 * 検索履歴API
 */

// 型定義
export type { SearchHistoryItem, SearchHistoryType } from './types';

// API関数
export {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
} from './search-history';
