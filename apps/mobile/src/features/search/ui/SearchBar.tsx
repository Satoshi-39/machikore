/**
 * 検索バーFeature
 *
 * FSDの原則：Feature層 - ユーザーアクション・インタラクション
 * - 検索入力ヘッダーのみを担当
 * - 履歴・サジェストは親コンポーネントで制御
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { colors, iconSizeNum } from '@/shared/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View className="bg-surface border-b border-outline px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons
              name="arrow-back"
              size={iconSizeNum.lg}
              color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
            />
          </TouchableOpacity>
          <Pressable
            onPress={handleEditAndFocus}
            className="flex-1 flex-row items-center bg-secondary rounded-full px-4 py-2"
          >
            <Ionicons name="search-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
            <Text
              className="flex-1 ml-2 text-base text-on-surface"
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
                size={iconSizeNum.lg}
                color={hasActiveFilters ? colors.light.primary : (isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"])}
              />
              {hasActiveFilters && (
                <View
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.light.primary }}
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
    <View className="bg-surface border-b border-outline px-4 py-3">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons
            name="arrow-back"
            size={iconSizeNum.lg}
            color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
          />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center bg-secondary rounded-full px-4 py-2">
          <Ionicons name="search-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-2 text-base text-on-surface"
            placeholder={t('discover.searchPlaceholder')}
            placeholderTextColor={colors.light["on-surface-variant"]}
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
            autoFocus={autoFocus}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearAndFocus} className="p-1">
              <Ionicons name="close-circle" size={iconSizeNum.md} className="text-on-surface-variant" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
