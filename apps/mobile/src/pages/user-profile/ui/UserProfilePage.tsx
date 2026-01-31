/**
 * ユーザープロフィールページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * URL: /user/:id
 * ユーザーのプロフィール、投稿、マップなどを表示
 * 自分自身の場合はブックマークタブも表示
 *
 * 注意: 設定・スケジュールボタンはMyPage専用のため、
 * このページでは表示しない（データ競合回避のため）
 *
 * Instagram/note風にプロフィールとタブフィルターもスクロールに追従
 */

import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { UserProfileTabFilter, type UserProfileTabMode } from '@/features/filter-user-profile-tab';
import { MapsTab, CollectionsTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId, useUser } from '@/entities/user';
import { PageHeader, ProfileSkeleton } from '@/shared/ui';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();

  // idがUUIDまたはusernameの場合があるため、useUserで解決してUUIDを取得
  const { data: user, isLoading: isUserLoading } = useUser(id);
  const resolvedUserId = user?.id ?? null;

  const isOwner = currentUserId && resolvedUserId && currentUserId === resolvedUserId;

  // 自分の場合はMyPageTabMode、他人の場合はUserProfileTabMode
  const [tabMode, setTabMode] = useState<MyPageTabMode | UserProfileTabMode>('maps');

  // FlatListのヘッダーとしてプロフィール+タブフィルターを渡す
  const listHeader = useMemo(() => (
    <View>
      {/* プロフィールセクション（identifierをそのまま渡す） */}
      <MyPageProfile userId={id} />
      {/* タブフィルター（自分の場合はブックマーク付き） */}
      {resolvedUserId && (isOwner ? (
        <MyPageTabFilter
          tabMode={tabMode as MyPageTabMode}
          onTabModeChange={setTabMode}
          userId={resolvedUserId}
        />
      ) : (
        <UserProfileTabFilter
          tabMode={tabMode as UserProfileTabMode}
          onTabModeChange={setTabMode}
          userId={resolvedUserId}
        />
      ))}
    </View>
  ), [id, isOwner, resolvedUserId, tabMode]);

  // ユーザー解決中
  if (isUserLoading) {
    return (
      <View className="flex-1 bg-surface-variant">
        <PageHeader title="プロフィール" />
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-variant">
      <PageHeader title="プロフィール" />

      {/* タブコンテンツ（プロフィール+タブフィルター+コンテンツが一緒にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && (
          <MapsTab
            userId={resolvedUserId}
            currentUserId={currentUserId}
            ListHeaderComponent={listHeader}
          />
        )}
        {tabMode === 'collections' && (
          <CollectionsTab
            userId={resolvedUserId}
            ListHeaderComponent={listHeader}
          />
        )}
      </View>
    </View>
  );
}
