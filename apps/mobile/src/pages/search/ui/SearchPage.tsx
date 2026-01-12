/**
 * 検索ページ
 *
 * 各タブで使える汎用検索画面
 * タグや検索クエリをパラメータで受け取り、検索結果を表示
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentTab } from '@/shared/lib/navigation';
import { useDiscoverSearchHistory, SearchHistoryList } from '@/features/search-history';
import { useSpotSearch, useSpotTagSearch, SpotCard } from '@/entities/user-spot';
import { useMapSearch, useMapTagSearch, MapCard } from '@/entities/map';
import { useUserSearch, UserListItem, useUserStore } from '@/entities/user';

type SearchResultTab = 'latest' | 'trending' | 'spots' | 'maps' | 'users';

export function SearchPage() {
  const router = useRouter();
  const { tag, q } = useLocalSearchParams<{ tag?: string; q?: string }>();
  const currentTab = useCurrentTab();
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const inputRef = useRef<TextInput>(null);
  const currentUser = useUserStore((state) => state.user);

  // 初期値: タグパラメータがあれば#付きで、qパラメータがあればそのまま
  const initialQuery = tag ? `#${tag}` : q || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [resultTab, setResultTab] = useState<SearchResultTab>('latest');

  // 検索履歴
  const { history, addHistory, removeHistory, clearHistory } = useDiscoverSearchHistory();

  // 入力中のユーザーサジェスト
  const { data: suggestedUsers, isLoading: usersLoading } = useUserSearch(
    searchQuery.trim().length > 0 && !submittedQuery ? searchQuery.trim() : ''
  );

  // タグ検索かどうかを判定（#で始まる場合）
  const isTagSearch = submittedQuery.startsWith('#');
  const tagName = isTagSearch ? submittedQuery.slice(1) : '';
  const keywordQuery = isTagSearch ? '' : submittedQuery;

  // キーワードでスポット検索
  const { data: keywordSpots, isLoading: keywordSpotsLoading } = useSpotSearch(
    keywordQuery && (resultTab === 'spots' || resultTab === 'latest' || resultTab === 'trending')
      ? keywordQuery
      : ''
  );

  // タグでスポット検索
  const { data: tagSpots, isLoading: tagSpotsLoading } = useSpotTagSearch(
    isTagSearch && (resultTab === 'spots' || resultTab === 'latest' || resultTab === 'trending')
      ? tagName
      : ''
  );

  // タグ検索かキーワード検索かでスポット結果を切り替え
  const spots = isTagSearch ? tagSpots : keywordSpots;
  const spotsLoading = isTagSearch ? tagSpotsLoading : keywordSpotsLoading;

  // キーワード検索
  const { data: keywordMaps, isLoading: keywordMapsLoading } = useMapSearch(
    keywordQuery && (resultTab === 'maps' || resultTab === 'latest' || resultTab === 'trending')
      ? keywordQuery
      : ''
  );

  // タグ検索
  const { data: tagMaps, isLoading: tagMapsLoading } = useMapTagSearch(
    isTagSearch && (resultTab === 'maps' || resultTab === 'latest' || resultTab === 'trending')
      ? tagName
      : ''
  );

  // タグ検索かキーワード検索かで結果を切り替え
  const maps = isTagSearch ? tagMaps : keywordMaps;
  const mapsLoading = isTagSearch ? tagMapsLoading : keywordMapsLoading;

  const { data: users, isLoading: usersSearchLoading } = useUserSearch(
    keywordQuery && resultTab === 'users' ? keywordQuery : ''
  );

  const isLoading =
    (resultTab === 'spots' && spotsLoading) ||
    (resultTab === 'maps' && mapsLoading) ||
    (resultTab === 'users' && usersSearchLoading) ||
    ((resultTab === 'latest' || resultTab === 'trending') && (spotsLoading || mapsLoading));

  const searchResultTabs = useMemo(
    () => [
      { key: 'latest' as SearchResultTab, label: t('discover.latest') },
      { key: 'trending' as SearchResultTab, label: t('discover.trending') },
      { key: 'spots' as SearchResultTab, label: t('discover.spots') },
      { key: 'maps' as SearchResultTab, label: t('discover.maps') },
      { key: 'users' as SearchResultTab, label: t('discover.users') },
    ],
    [t]
  );

  // 初期クエリがある場合は履歴に追加
  useEffect(() => {
    if (initialQuery) {
      addHistory(initialQuery);
    }
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSubmittedQuery('');
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      addHistory(query);
      setSubmittedQuery(query);
    }
  }, [searchQuery, addHistory]);

  const handleHistorySelect = useCallback(
    (query: string) => {
      addHistory(query);
      setSearchQuery(query);
      setSubmittedQuery(query);
    },
    [addHistory]
  );

  // ナビゲーションヘルパー
  const handleSpotPress = useCallback(
    (spotId: string) => {
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
      // 現在の検索を更新
      const query = `#${tagName}`;
      setSearchQuery(query);
      setSubmittedQuery(query);
      addHistory(query);
    },
    [addHistory]
  );

  const handleUserSuggestPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  // 最新タブ: スポットとマップを混合して新着順
  const renderLatestResults = () => {
    const allItems: Array<{ type: 'spot' | 'map'; item: any; createdAt: string }> = [
      ...(spots?.map((s) => ({ type: 'spot' as const, item: s, createdAt: s.created_at })) || []),
      ...(maps?.map((m) => ({ type: 'map' as const, item: m, createdAt: m.created_at })) || []),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (allItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="search-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {t('discover.noSearchResults')}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={allItems}
        keyExtractor={(item) => `${item.type}-${item.item.id}`}
        renderItem={({ item }) => {
          if (item.type === 'spot') {
            return (
              <SpotCard
                spot={item.item}
                currentUserId={currentUser?.id}
                onPress={() => handleSpotPress(item.item.id)}
                onUserPress={handleUserPress}
                onCommentPress={handleSpotCommentPress}
              />
            );
          }
          return (
            <MapCard
              map={item.item}
              currentUserId={currentUser?.id}
              onPress={() => handleMapPress(item.item.id)}
              onUserPress={handleUserPress}
              onCommentPress={handleMapCommentPress}
              onTagPress={handleTagPress}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // 話題タブ: いいね数でソート
  const renderTrendingResults = () => {
    const allItems: Array<{ type: 'spot' | 'map'; item: any; likesCount: number }> = [
      ...(spots?.map((s) => ({ type: 'spot' as const, item: s, likesCount: s.likes_count || 0 })) ||
        []),
      ...(maps?.map((m) => ({ type: 'map' as const, item: m, likesCount: m.likes_count || 0 })) ||
        []),
    ].sort((a, b) => b.likesCount - a.likesCount);

    if (allItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="trending-up-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {t('discover.noTrendingPosts')}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={allItems}
        keyExtractor={(item) => `${item.type}-${item.item.id}`}
        renderItem={({ item }) => {
          if (item.type === 'spot') {
            return (
              <SpotCard
                spot={item.item}
                currentUserId={currentUser?.id}
                onPress={() => handleSpotPress(item.item.id)}
                onUserPress={handleUserPress}
                onCommentPress={handleSpotCommentPress}
              />
            );
          }
          return (
            <MapCard
              map={item.item}
              currentUserId={currentUser?.id}
              onPress={() => handleMapPress(item.item.id)}
              onUserPress={handleUserPress}
              onCommentPress={handleMapCommentPress}
              onTagPress={handleTagPress}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      );
    }

    if (resultTab === 'latest') {
      return renderLatestResults();
    }

    if (resultTab === 'trending') {
      return renderTrendingResults();
    }

    if (resultTab === 'spots') {
      if (!spots?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="location-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noSpotsFound')}
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          data={spots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              currentUserId={currentUser?.id}
              onPress={() => handleSpotPress(item.id)}
              onUserPress={handleUserPress}
              onCommentPress={handleSpotCommentPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (resultTab === 'maps') {
      if (!maps?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="map-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noMapsFound')}
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          data={maps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard
              map={item}
              currentUserId={currentUser?.id}
              onPress={() => handleMapPress(item.id)}
              onUserPress={handleUserPress}
              onCommentPress={handleMapCommentPress}
              onTagPress={handleTagPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (resultTab === 'users') {
      if (!users?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="people-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
              {t('discover.noUsersFound')}
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UserListItem user={item} onPress={() => handleUserPress(item.id)} />}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* 検索結果がある場合は編集不可のヘッダー */}
      {submittedQuery ? (
        <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
              />
            </TouchableOpacity>
            <Pressable
              onPress={() => {
                setSubmittedQuery('');
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-2"
            >
              <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
              <Text
                className="flex-1 ml-2 text-base text-foreground dark:text-dark-foreground"
                numberOfLines={1}
              >
                {submittedQuery}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* 検索バー（入力可能） */
        <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
              />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-2">
              <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
              <TextInput
                ref={inputRef}
                className="flex-1 ml-2 text-base text-foreground dark:text-dark-foreground"
                placeholder={t('discover.searchPlaceholder')}
                placeholderTextColor={colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus={!initialQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClear} className="p-1">
                  <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* コンテンツ */}
      {submittedQuery ? (
        <View className="flex-1">
          {/* タブ */}
          <View className="bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {searchResultTabs.map((tab) => {
                const isActive = resultTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setResultTab(tab.key)}
                    className="mr-2"
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      backgroundColor: isActive ? '#3B82F6' : '#F3F4F6',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: isActive ? '#FFFFFF' : '#4B5563',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 検索結果 */}
          <View className="flex-1 bg-surface dark:bg-dark-surface">{renderSearchResults()}</View>
        </View>
      ) : searchQuery.trim().length > 0 ? (
        // 入力中: ユーザーサジェスト表示
        <View className="flex-1 bg-surface dark:bg-dark-surface">
          {usersLoading || suggestedUsers === undefined ? (
            <View className="flex-1 justify-center items-center py-12">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : suggestedUsers.length > 0 ? (
            <FlatList
              data={suggestedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <UserListItem user={item} onPress={() => handleUserSuggestPress(item.id)} />
              )}
              ListHeaderComponent={
                <View className="px-4 py-2 border-b border-border-light dark:border-dark-border-light">
                  <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
                    {t('discover.users')}
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <TouchableOpacity onPress={handleSearch} className="px-4 py-3">
              <Text className="text-base text-foreground dark:text-dark-foreground">
                {t('discover.searchFor', { query: searchQuery.trim() })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
