/**
 * Search Feature エクスポート
 *
 * 検索に関連する機能を統合
 * - 検索バー（SearchBar）
 * - ユーザーサジェスト（UserSuggest）
 * - 検索履歴（SearchHistoryList）
 */

// UI Components
export { SearchBar } from './ui/SearchBar';
export { UserSuggest } from './ui/UserSuggest';
export { SearchHistoryList } from './ui/SearchHistoryList';

// Hooks
export { useSearchHistory, useDiscoverSearchHistory } from './model';

// Types
export type {
  SearchHistoryType,
  SearchHistoryItem,
  UseSearchHistoryReturn,
} from './model';
