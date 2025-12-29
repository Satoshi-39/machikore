/**
 * 発見検索Widget
 *
 * FSDの原則：Widget層 - 複数のFeatureを組み合わせた複合コンポーネント
 * - 検索バー（タップでオーバーレイを表示）
 * - 検索オーバーレイ（入力フィールド + ユーザーサジェスト/検索結果表示）
 * - 入力中: ユーザーのみリアルタイムサジェスト表示
 * - 確定後: 検索結果はDiscoverSearchResultsに委譲（全タブ検索）
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useDiscoverSearchHistory, SearchHistoryList } from '@/features/search-history';
import { DiscoverSearchResults } from '@/widgets/discover-search-results';
import { useUserSearch, UserListItem } from '@/entities/user';

interface DiscoverSearchProps {
  onFocus: () => void;
  onClose: () => void;
  isSearchFocused: boolean;
  /** 左側のコンポーネント（オプション） */
  leftComponent?: React.ReactNode;
  /** マップアイコン押下時 */
  onMapPress?: () => void;
}

export function DiscoverSearch({ onFocus, onClose, isSearchFocused, leftComponent, onMapPress }: DiscoverSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const isDarkMode = useIsDarkMode();
  const router = useRouter();
  const { t } = useI18n();

  // 検索履歴（Supabase/クラウド同期）
  const { history, addHistory, removeHistory, clearHistory } = useDiscoverSearchHistory();

  // 入力中のユーザーサジェスト（リアルタイム検索）
  const { data: suggestedUsers, isLoading: usersLoading } = useUserSearch(
    searchQuery.trim().length > 0 && !submittedQuery ? searchQuery.trim() : ''
  );

  // オーバーレイが開いたら入力フィールドにフォーカス
  useEffect(() => {
    if (isSearchFocused) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchFocused]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSubmittedQuery('');
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setSubmittedQuery('');
    onClose();
  }, [onClose]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      addHistory(query);
      setSubmittedQuery(query);
    }
  }, [searchQuery, addHistory]);

  const handleHistorySelect = useCallback((query: string) => {
    addHistory(query);
    setSearchQuery(query);
    setSubmittedQuery(query);
  }, [addHistory]);

  // サジェストされたユーザーをタップしたら直接プロフィールへ遷移
  const handleUserSuggestPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
    // 検索状態をクリア
    setSearchQuery('');
    setSubmittedQuery('');
    onClose();
  }, [router, onClose]);

  // 通常時: タップでオーバーレイを開くダミー検索バー
  if (!isSearchFocused) {
    return (
      <View className="flex-row items-center px-4 py-2 bg-surface dark:bg-dark-surface gap-3">
        {/* 左側: オプションコンポーネント（または仮アイコン） */}
        {leftComponent ? (
          <View>{leftComponent}</View>
        ) : onMapPress ? (
          <Pressable className="p-1">
            <Ionicons name="menu" size={24} color={isDarkMode ? colors.dark.foreground : colors.light.foreground} />
          </Pressable>
        ) : null}

        {/* 検索バー */}
        <Pressable
          onPress={onFocus}
          className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-3"
        >
          <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
          <Text className="flex-1 ml-2 text-base text-foreground-muted dark:text-dark-foreground-muted">
            {t('discover.searchPlaceholder')}
          </Text>
        </Pressable>

        {/* 右側: スポットアイコン */}
        {onMapPress && (
          <Pressable onPress={onMapPress} className="p-1">
            <Ionicons name="location-outline" size={24} color={isDarkMode ? colors.dark.foreground : colors.light.foreground} />
          </Pressable>
        )}
      </View>
    );
  }

  // オーバーレイ時: 入力フィールド + 履歴/検索結果
  return (
    <View className="flex-1">
      {/* 検索結果がある場合は編集不可のヘッダー（タップで再検索モードへ） */}
      {submittedQuery ? (
        <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? colors.dark.foreground : colors.light.foreground} />
            </TouchableOpacity>
            <Pressable
              onPress={() => {
                // 検索結果をクリアして入力モードに戻る
                setSubmittedQuery('');
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-2"
            >
              <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
              <Text className="flex-1 ml-2 text-base text-foreground dark:text-dark-foreground" numberOfLines={1}>
                {submittedQuery}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* 検索バー（入力可能） */
        <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
          <View className="flex-row items-center gap-3">
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
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClear} className="p-1">
                  <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-base text-blue-500 font-medium">{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* コンテンツ表示: 確定後→検索結果、入力中→ユーザーサジェスト、それ以外→履歴 */}
      {submittedQuery ? (
        <DiscoverSearchResults query={submittedQuery} />
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
                <UserListItem
                  user={item}
                  onPress={() => handleUserSuggestPress(item.id)}
                />
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
            <TouchableOpacity
              onPress={handleSearch}
              className="px-4 py-3"
            >
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
    </View>
  );
}
