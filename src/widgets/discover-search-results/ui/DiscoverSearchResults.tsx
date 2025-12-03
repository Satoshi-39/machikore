/**
 * 発見検索結果Widget
 *
 * FSDの原則：Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * - タブ切り替え（最新/話題/スポット/マップ/ユーザー）
 * - 検索結果リスト表示
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useSpotSearch, SpotCard } from '@/entities/user-spot';
import { useMapSearch, MapCard } from '@/entities/map';
import { useUserSearch, UserListItem, useUserStore } from '@/entities/user';

type SearchResultTab = 'latest' | 'trending' | 'spots' | 'maps' | 'users';

const SEARCH_RESULT_TABS: { key: SearchResultTab; label: string }[] = [
  { key: 'latest', label: '最新' },
  { key: 'trending', label: '話題' },
  { key: 'spots', label: 'スポット' },
  { key: 'maps', label: 'マップ' },
  { key: 'users', label: 'ユーザー' },
];

interface DiscoverSearchResultsProps {
  query: string;
}

export function DiscoverSearchResults({ query }: DiscoverSearchResultsProps) {
  const router = useRouter();
  const [resultTab, setResultTab] = useState<SearchResultTab>('latest');
  const currentUser = useUserStore((state) => state.user);

  // 検索実行
  const { data: spots, isLoading: spotsLoading } = useSpotSearch(
    query && (resultTab === 'spots' || resultTab === 'latest' || resultTab === 'trending')
      ? query
      : ''
  );
  const { data: maps, isLoading: mapsLoading } = useMapSearch(
    query && (resultTab === 'maps' || resultTab === 'latest' || resultTab === 'trending')
      ? query
      : ''
  );
  const { data: users, isLoading: usersLoading } = useUserSearch(
    query && resultTab === 'users' ? query : ''
  );

  const isLoading =
    (resultTab === 'spots' && spotsLoading) ||
    (resultTab === 'maps' && mapsLoading) ||
    (resultTab === 'users' && usersLoading) ||
    ((resultTab === 'latest' || resultTab === 'trending') && (spotsLoading || mapsLoading));

  const handleSpotPress = (spotId: string) => {
    // 発見タブ内スタックに遷移（タブバーを維持）
    router.push(`/(tabs)/discover/spots/${spotId}`);
  };

  const handleMapPress = (mapId: string) => {
    // 発見タブ内スタックに遷移（タブバーを維持）
    router.push(`/(tabs)/discover/maps/${mapId}`);
  };

  const handleUserPress = (userId: string) => {
    // 発見タブ内スタックに遷移（タブバーを維持）
    router.push(`/(tabs)/discover/users/${userId}`);
  };

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
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">検索結果がありません</Text>
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
              />
            );
          }
          return <MapCard map={item.item} currentUserId={currentUser?.id} onPress={() => handleMapPress(item.item.id)} />;
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // 話題タブ: いいね数でソート
  const renderTrendingResults = () => {
    const allItems: Array<{ type: 'spot' | 'map'; item: any; likesCount: number }> = [
      ...(spots?.map((s) => ({ type: 'spot' as const, item: s, likesCount: s.likes_count || 0 })) || []),
      ...(maps?.map((m) => ({ type: 'map' as const, item: m, likesCount: m.likes_count || 0 })) || []),
    ].sort((a, b) => b.likesCount - a.likesCount);

    if (allItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="trending-up-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">話題の投稿がありません</Text>
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
              />
            );
          }
          return <MapCard map={item.item} currentUserId={currentUser?.id} onPress={() => handleMapPress(item.item.id)} />;
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
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">スポットが見つかりませんでした</Text>
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
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">マップが見つかりませんでした</Text>
          </View>
        );
      }
      return (
        <FlatList
          data={maps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard map={item} currentUserId={currentUser?.id} onPress={() => handleMapPress(item.id)} />
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
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">ユーザーが見つかりませんでした</Text>
          </View>
        );
      }
      return (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem user={item} onPress={() => handleUserPress(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return null;
  };

  return (
    <View className="flex-1">
      {/* タブ */}
      <View className="bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}
        >
          {SEARCH_RESULT_TABS.map((tab) => {
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
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        {renderSearchResults()}
      </View>
    </View>
  );
}
