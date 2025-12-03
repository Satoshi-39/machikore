/**
 * 発見検索Widget
 *
 * FSDの原則：Widget層 - 複数のFeatureを組み合わせた複合コンポーネント
 * - 検索バー（タップでオーバーレイを表示）
 * - 検索オーバーレイ（入力フィールド + 履歴/検索結果表示）
 * - 検索結果はDiscoverSearchResultsに委譲
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useSearchHistory, SearchHistoryList } from '@/features/search-history';
import { DiscoverSearchResults } from '@/widgets/discover-search-results';

interface DiscoverSearchProps {
  onFocus: () => void;
  onClose: () => void;
  isSearchFocused: boolean;
}

export function DiscoverSearch({ onFocus, onClose, isSearchFocused }: DiscoverSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  // 検索履歴
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory({ type: 'discover' });

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

  // 通常時: タップでオーバーレイを開くダミー検索バー
  if (!isSearchFocused) {
    return (
      <View className="px-4 py-2 bg-surface dark:bg-dark-surface">
        <Pressable
          onPress={onFocus}
          className="flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-3"
        >
          <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
          <Text className="flex-1 ml-2 text-base text-foreground-muted dark:text-dark-foreground-muted">
            スポット、マップ、ユーザーを検索
          </Text>
        </Pressable>
      </View>
    );
  }

  // オーバーレイ時: 入力フィールド + 履歴/検索結果
  return (
    <View className="flex-1">
      {/* 検索結果がある場合は編集不可のヘッダー */}
      {submittedQuery ? (
        <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center bg-muted dark:bg-dark-muted rounded-full px-4 py-2">
              <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
              <Text className="flex-1 ml-2 text-base text-foreground dark:text-dark-foreground" numberOfLines={1}>
                {submittedQuery}
              </Text>
            </View>
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
                className="flex-1 ml-2 text-base"
                placeholder="スポット、マップ、ユーザーを検索"
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
              <Text className="text-base text-blue-500 font-medium">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 検索結果がある場合は結果を表示、なければ履歴を表示 */}
      {submittedQuery ? (
        <DiscoverSearchResults query={submittedQuery} />
      ) : (
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
