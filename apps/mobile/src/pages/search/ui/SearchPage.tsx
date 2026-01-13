/**
 * 検索ページ
 *
 * FSDの原則：Pages層 - Feature/Widgetの組み合わせ
 * - SearchBar（Feature）: 検索入力ヘッダー
 * - UserSuggest（Feature）: ユーザーサジェスト表示
 * - SearchHistoryList（Feature）: 検索履歴表示
 * - SearchResults（Widget）: 検索結果表示
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useCurrentTab } from '@/shared/lib/navigation';
import { SearchBar, UserSuggest, SearchHistoryList, useDiscoverSearchHistory } from '@/features/search';
import { SearchResults } from '@/widgets/search-results';

export function SearchPage() {
  const router = useRouter();
  const { tag, q } = useLocalSearchParams<{ tag?: string; q?: string }>();
  const currentTab = useCurrentTab();

  // 初期値: タグパラメータがあれば#付きで、qパラメータがあればそのまま
  const initialQuery = tag ? `#${tag}` : q || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  // 検索履歴
  const { history, addHistory, removeHistory, clearHistory } = useDiscoverSearchHistory();

  // 初期クエリがある場合は履歴に追加
  useEffect(() => {
    if (initialQuery) {
      addHistory(initialQuery);
    }
  }, []);

  // ナビゲーションヘルパー
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSpotPress = useCallback(
    (spotId: string) => {
      router.push(`/(tabs)/${currentTab}/spots/${spotId}` as Href);
    },
    [router, currentTab]
  );

  const handleArticlePress = useCallback(
    (spotId: string) => {
      // 記事タップ時もスポット詳細へ遷移（記事全文が表示される）
      router.push(`/(tabs)/${currentTab}/spots/${spotId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  const handleSpotCommentPress = useCallback(
    (spotId: string) => {
      router.push(`/(tabs)/${currentTab}/comment-modal/spots/${spotId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapCommentPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/comment-modal/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleTagPress = useCallback(
    (tagName: string) => {
      const query = `#${tagName}`;
      setSearchQuery(query);
      setSubmittedQuery(query);
      addHistory(query);
    },
    [addHistory]
  );

  const handleSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      addHistory(query);
      setSubmittedQuery(query);
    }
  }, [searchQuery, addHistory]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSubmittedQuery('');
  }, []);

  const handleEdit = useCallback(() => {
    setSubmittedQuery('');
  }, []);

  const handleHistorySelect = useCallback(
    (query: string) => {
      addHistory(query);
      setSearchQuery(query);
      setSubmittedQuery(query);
    },
    [addHistory]
  );

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* 検索バーヘッダー */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        submittedQuery={submittedQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onClose={handleClose}
        onEdit={handleEdit}
        autoFocus={!initialQuery}
      />

      {/* コンテンツ */}
      {submittedQuery ? (
        // 検索結果
        <SearchResults
          query={submittedQuery}
          onSpotPress={handleSpotPress}
          onMapPress={handleMapPress}
          onUserPress={handleUserPress}
          onSpotCommentPress={handleSpotCommentPress}
          onMapCommentPress={handleMapCommentPress}
          onTagPress={handleTagPress}
          onArticlePress={handleArticlePress}
        />
      ) : searchQuery.trim().length > 0 ? (
        // 入力中: ユーザーサジェスト表示
        <UserSuggest
          query={searchQuery}
          onUserPress={handleUserPress}
          onSearch={handleSubmit}
        />
      ) : (
        // 入力前: 履歴表示
        <View className="flex-1 bg-surface dark:bg-dark-surface px-4 pt-4">
          <SearchHistoryList
            history={history}
            onSelect={handleHistorySelect}
            onRemove={removeHistory}
            onClearAll={clearHistory}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
