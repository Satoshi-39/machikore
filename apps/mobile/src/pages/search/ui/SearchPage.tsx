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
import { Keyboard, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useCurrentTab } from '@/shared/lib/navigation';
import { SearchBar, UserSuggest, SearchHistoryList, useDiscoverSearchHistory } from '@/features/search';
import { useSearchFilters } from '@/features/search-filter';
import { SearchResults } from '@/widgets/search-results';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';

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

  // フィルター（Zustandストア経由）
  const { hasActiveFilters, spotFilters, mapFilters } = useSearchFilters();

  // コメントモーダル
  const {
    isVisible: isCommentModalVisible,
    target: commentTarget,
    openSpotCommentModal,
    openMapCommentModal,
    closeCommentModal,
  } = useCommentModal();

  // 初期クエリがある場合は履歴に追加
  useEffect(() => {
    if (initialQuery) {
      addHistory(initialQuery);
    }
  }, []);

  // フィルターモーダルを開く
  const handleFilterPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/filter-modal` as Href);
  }, [router, currentTab]);

  // ナビゲーションヘルパー
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // スポットカード全体タップ → スポット記事ページへ遷移
  const handleSpotPress = useCallback(
    (spotId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/spots/${spotId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  // スポットカード内のマップアイコンタップ → マップ上のスポット詳細へ遷移
  const handleSpotMapPress = useCallback(
    (spotId: string, mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}/spots/${spotId}` as Href);
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
      openSpotCommentModal(spotId);
    },
    [openSpotCommentModal]
  );

  const handleMapCommentPress = useCallback(
    (mapId: string) => {
      openMapCommentModal(mapId);
    },
    [openMapCommentModal]
  );

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  const handleTagPress = useCallback(
    (tagName: string) => {
      // タグ検索を新しい画面としてスタックにpush
      router.push(`/(tabs)/${currentTab}/search?tag=${encodeURIComponent(tagName)}` as Href);
    },
    [router, currentTab]
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
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
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
        onFilterPress={handleFilterPress}
        hasActiveFilters={hasActiveFilters}
      />

      {/* コンテンツ */}
      {submittedQuery ? (
        // 検索結果（検索実行後のみ表示）
        <SearchResults
          query={submittedQuery}
          spotFilters={spotFilters}
          mapFilters={mapFilters}
          onSpotPress={handleSpotPress}
          onMapPress={handleMapPress}
          onSpotMapPress={handleSpotMapPress}
          onUserPress={handleUserPress}
          onSpotCommentPress={handleSpotCommentPress}
          onMapCommentPress={handleMapCommentPress}
          onTagPress={handleTagPress}
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
        <View className="flex-1 bg-surface">
          <ScrollView
            className="flex-1 px-4 pt-4"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            <SearchHistoryList
              history={history}
              onSelect={handleHistorySelect}
              onRemove={removeHistory}
              onClearAll={clearHistory}
            />
          </ScrollView>
        </View>
      )}

      {/* コメントモーダル */}
      {commentTarget && (
        <CommentModalSheet
          visible={isCommentModalVisible}
          type={commentTarget.type}
          targetId={commentTarget.id}
          onClose={closeCommentModal}
          onUserPress={handleCommentUserPress}
          autoFocus={commentTarget.options?.autoFocus}
          focusCommentId={commentTarget.options?.focusCommentId}
        />
      )}
    </SafeAreaView>
  );
}
