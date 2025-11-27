/**
 * 検索履歴のAsyncStorage操作
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存キー（デフォルトマップとユーザーマップで分ける）
const STORAGE_KEYS = {
  defaultMap: 'search_history_default_map',
  userMap: 'search_history_user_map',
  discover: 'search_history_discover',
} as const;

export type SearchHistoryType = 'defaultMap' | 'userMap' | 'discover';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultType?: 'machi' | 'spot' | 'place'; // 検索結果のタイプ
}

const MAX_HISTORY_COUNT = 20; // 最大履歴数

/**
 * 検索履歴を取得
 */
export async function getSearchHistory(type: SearchHistoryType): Promise<SearchHistoryItem[]> {
  try {
    const key = STORAGE_KEYS[type];
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get search history:', error);
    return [];
  }
}

/**
 * 検索履歴を追加
 */
export async function addSearchHistory(
  type: SearchHistoryType,
  query: string,
  resultType?: 'machi' | 'spot' | 'place'
): Promise<void> {
  try {
    const key = STORAGE_KEYS[type];
    const history = await getSearchHistory(type);

    // 同じクエリが既にあれば削除（重複防止）
    const filteredHistory = history.filter((item) => item.query !== query);

    // 新しい履歴を先頭に追加
    const newItem: SearchHistoryItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      query,
      timestamp: Date.now(),
      resultType,
    };

    const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_COUNT);
    await AsyncStorage.setItem(key, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to add search history:', error);
  }
}

/**
 * 検索履歴を1件削除
 */
export async function removeSearchHistory(
  type: SearchHistoryType,
  id: string
): Promise<void> {
  try {
    const key = STORAGE_KEYS[type];
    const history = await getSearchHistory(type);
    const newHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to remove search history:', error);
  }
}

/**
 * 検索履歴を全削除
 */
export async function clearSearchHistory(type: SearchHistoryType): Promise<void> {
  try {
    const key = STORAGE_KEYS[type];
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}
