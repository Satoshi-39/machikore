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
import { useCurrentUserId } from '@/entities/user';
import { PageHeader } from '@/shared/ui';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const isOwner = currentUserId === id;

  // 自分の場合はMyPageTabMode、他人の場合はUserProfileTabMode
  const [tabMode, setTabMode] = useState<MyPageTabMode | UserProfileTabMode>('maps');

  // FlatListのヘッダーとしてプロフィール+タブフィルターを渡す
  const listHeader = useMemo(() => (
    <View>
      {/* プロフィールセクション */}
      <MyPageProfile userId={id} />
      {/* タブフィルター（自分の場合はブックマーク付き） */}
      {isOwner ? (
        <MyPageTabFilter
          tabMode={tabMode as MyPageTabMode}
          onTabModeChange={setTabMode}
          userId={id}
        />
      ) : (
        <UserProfileTabFilter
          tabMode={tabMode as UserProfileTabMode}
          onTabModeChange={setTabMode}
          userId={id}
        />
      )}
    </View>
  ), [id, isOwner, tabMode]);

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title="プロフィール" />

      {/* タブコンテンツ（プロフィール+タブフィルター+コンテンツが一緒にスクロール） */}
      <View className="flex-1">
        {tabMode === 'maps' && (
          <MapsTab
            userId={id}
            currentUserId={currentUserId}
            ListHeaderComponent={listHeader}
          />
        )}
        {tabMode === 'collections' && (
          <CollectionsTab
            userId={id}
            ListHeaderComponent={listHeader}
          />
        )}
      </View>
    </View>
  );
}
