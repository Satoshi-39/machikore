/**
 * ユーザーサジェストFeature
 *
 * 検索入力中にユーザーをリアルタイムでサジェスト表示
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';
import { useUserSearch, useUserStore, UserListItem } from '@/entities/user';

interface UserSuggestProps {
  /** 検索クエリ */
  query: string;
  /** ユーザータップ時 */
  onUserPress: (userId: string) => void;
  /** 検索実行（ユーザーが見つからない場合） */
  onSearch: () => void;
}

export function UserSuggest({ query, onUserPress, onSearch }: UserSuggestProps) {
  const { t } = useI18n();
  const currentUser = useUserStore((state) => state.user);

  // ユーザーサジェスト検索（ブロック済みユーザーを除外）
  const { data: suggestedUsersData, isLoading } = useUserSearch(query.trim(), currentUser?.id);
  const suggestedUsers = suggestedUsersData?.pages.flat() ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-12 bg-surface">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }

  if (suggestedUsers.length > 0) {
    return (
      <View className="flex-1 bg-surface">
        <FlatList
          data={suggestedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem user={item} onPress={() => onUserPress(item.id)} />
          )}
          ListHeaderComponent={
            <View className="px-4 py-2 border-b-hairline border-outline-variant">
              <Text className="text-sm text-on-surface-variant">
                {t('discover.users')}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </View>
    );
  }

  // ユーザーが見つからない場合は検索を促す
  return (
    <View className="flex-1 bg-surface">
      <TouchableOpacity onPress={onSearch} className="px-4 py-3">
        <Text className="text-base text-on-surface">
          {t('discover.searchFor', { query: query.trim() })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
