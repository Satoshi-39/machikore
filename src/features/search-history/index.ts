/**
 * Search History Feature エクスポート
 */

// AsyncStorage版（defaultMap, userMap用）
export { useSearchHistory } from './model/use-search-history';
export type { SearchHistoryItem, SearchHistoryType } from './api/search-history-storage';

// Supabase版（discover用、クラウド同期対応）
export { useDiscoverSearchHistory } from './model/use-discover-search-history';
export type { SearchHistoryItem as DiscoverSearchHistoryItem } from './api/search-history-supabase';

// 共通UI
export { SearchHistoryList } from './ui/SearchHistoryList';
