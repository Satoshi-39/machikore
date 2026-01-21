/**
 * 検索バーFeature
 *
 * FSDの原則：Feature層 - ユーザーアクション・インタラクション
 * - 検索入力ヘッダーのみを担当
 * - 履歴・サジェストは親コンポーネントで制御
 */

import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';

interface SearchBarProps {
  /** 現在の検索クエリ */
  searchQuery: string;
  /** 検索クエリの変更 */
  onSearchQueryChange: (query: string) => void;
  /** 確定済みの検索クエリ（表示用） */
  submittedQuery: string;
  /** 検索確定 */
  onSubmit: () => void;
  /** 検索クエリのクリア */
  onClear: () => void;
  /** 閉じる */
  onClose: () => void;
  /** 編集モードに戻る（submittedQueryをクリアして入力にフォーカス） */
  onEdit: () => void;
  /** 初期フォーカスするか */
  autoFocus?: boolean;
  /** フィルターボタン押下 */
  onFilterPress?: () => void;
  /** フィルターが有効か */
  hasActiveFilters?: boolean;
}

export function SearchBar({
  searchQuery,
  onSearchQueryChange,
  submittedQuery,
  onSubmit,
  onClear,
  onClose,
  onEdit,
  autoFocus = false,
  onFilterPress,
  hasActiveFilters = false,
}: SearchBarProps) {
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const inputRef = useRef<TextInput>(null);

  // 初期フォーカス
  useEffect(() => {
    if (autoFocus && !submittedQuery) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus, submittedQuery]);

  const handleClearAndFocus = useCallback(() => {
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  const handleEditAndFocus = useCallback(() => {
    onEdit();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onEdit]);

  // 検索結果がある場合は編集不可のヘッダー
  if (submittedQuery) {
    return (
      <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
            />
          </TouchableOpacity>
          <Pressable
            onPress={handleEditAndFocus}
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
          {/* フィルターボタン */}
          {onFilterPress && (
            <TouchableOpacity
              onPress={onFilterPress}
              className="p-2 relative"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="options-outline"
                size={24}
                color={hasActiveFilters ? colors.primary.DEFAULT : (isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary)}
              />
              {hasActiveFilters && (
                <View
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // 検索バー（入力可能）
  return (
    <View className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
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
            onChangeText={onSearchQueryChange}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
            autoFocus={autoFocus}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearAndFocus} className="p-1">
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
