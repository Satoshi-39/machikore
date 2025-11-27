/**
 * 発見検索Widget
 *
 * FSDの原則：Widget層 - 複数のFeatureを組み合わせた複合コンポーネント
 * - 検索バー
 * - 検索タブ（スポット / マップ / ユーザー）
 * - 検索結果
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useSpotSearch, SpotCard } from '@/entities/user-spot';
import { useMapSearch, MapCard } from '@/entities/user-map';
import { useUserSearch, UserListItem, useUserStore } from '@/entities/user';

interface DiscoverSearchProps {
  onFocus: () => void;
  onClose: () => void;
  isSearchFocused: boolean;
}

type SearchCategory = 'spots' | 'maps' | 'users';

const SEARCH_CATEGORIES: { key: SearchCategory; label: string }[] = [
  { key: 'spots', label: 'スポット' },
  { key: 'maps', label: 'マップ' },
  { key: 'users', label: 'ユーザー' },
];

export function DiscoverSearch({ onFocus, onClose, isSearchFocused }: DiscoverSearchProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('spots');

  // 選択中のカテゴリのみ検索を実行
  const { data: spots, isLoading: spotsLoading } = useSpotSearch(
    searchCategory === 'spots' ? searchQuery : ''
  );
  const { data: maps, isLoading: mapsLoading } = useMapSearch(
    searchCategory === 'maps' ? searchQuery : ''
  );
  const { data: users, isLoading: usersLoading } = useUserSearch(
    searchCategory === 'users' ? searchQuery : ''
  );

  const isLoading =
    (searchCategory === 'spots' && spotsLoading) ||
    (searchCategory === 'maps' && mapsLoading) ||
    (searchCategory === 'users' && usersLoading);

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    onClose();
  }, [onClose]);

  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/spots/${spotId}`);
  }, [router]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/maps/${mapId}`);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/users/${userId}`);
  }, [router]);

  const renderSearchResults = () => {
    if (!searchQuery.trim()) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="search-outline" size={48} color={colors.text.tertiary} />
          <Text className="text-gray-400 mt-4">検索キーワードを入力</Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-12">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      );
    }

    if (searchCategory === 'spots') {
      if (!spots?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="location-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-gray-400 mt-4">スポットが見つかりませんでした</Text>
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
              userId={currentUser?.id ?? ''}
              onPress={() => handleSpotPress(item.id)}
            />
          )}
        />
      );
    }

    if (searchCategory === 'maps') {
      if (!maps?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="map-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-gray-400 mt-4">マップが見つかりませんでした</Text>
          </View>
        );
      }
      return (
        <FlatList
          data={maps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard map={item} onPress={() => handleMapPress(item.id)} />
          )}
        />
      );
    }

    if (searchCategory === 'users') {
      if (!users?.length) {
        return (
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="people-outline" size={48} color={colors.text.tertiary} />
            <Text className="text-gray-400 mt-4">ユーザーが見つかりませんでした</Text>
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
        />
      );
    }

    return null;
  };

  return (
    <View className={isSearchFocused ? 'flex-1' : ''}>
      {/* 検索バー */}
      <View className="px-4 py-2 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="スポット、マップ、ユーザーを検索"
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={onFocus}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
          {isSearchFocused && (
            <TouchableOpacity onPress={handleClose} className="ml-2">
              <Text className="text-blue-500">キャンセル</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 検索フォーカス時のみ表示 */}
      {isSearchFocused && (
        <View className="flex-1 bg-white">
          {/* カテゴリタブ */}
          <View className="flex-row px-4 py-2 border-b border-gray-100">
            {SEARCH_CATEGORIES.map((category) => {
              const isActive = searchCategory === category.key;
              return (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSearchCategory(category.key)}
                  className={`px-4 py-2 mr-2 rounded-full ${
                    isActive ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 検索結果 */}
          {renderSearchResults()}
        </View>
      )}
    </View>
  );
}
