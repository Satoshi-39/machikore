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

import React, { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { MyPageProfile } from '@/widgets/mypage-profile';
import { MyPageTabFilter, type MyPageTabMode } from '@/features/filter-mypage-tab';
import { UserProfileTabFilter, type UserProfileTabMode } from '@/features/filter-user-profile-tab';
import { MapsTab, CollectionsTab } from '@/widgets/mypage-tab-content';
import { useCurrentUserId, useUser } from '@/entities/user';
import { useIsBlocked, useUnblockUser } from '@/entities/block';
import { useBlockAction } from '@/features/block-user';
import { PageHeader, ProfileSkeleton, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { t } = useI18n();

  // idがUUIDまたはusernameの場合があるため、useUserで解決してUUIDを取得
  const { data: user, isLoading: isUserLoading } = useUser(id);
  const resolvedUserId = user?.id ?? null;

  const isOwner = currentUserId && resolvedUserId && currentUserId === resolvedUserId;

  // ブロック状態
  const { data: isBlocked } = useIsBlocked(currentUserId, resolvedUserId);
  const { handleBlock } = useBlockAction({
    currentUserId,
    onSuccess: () => router.back(),
  });
  const unblockMutation = useUnblockUser();

  // ブロック解除
  const handleUnblock = useCallback(() => {
    if (!currentUserId || !resolvedUserId) return;
    unblockMutation.mutate({ blockerId: currentUserId, blockedId: resolvedUserId });
  }, [currentUserId, resolvedUserId, unblockMutation]);

  // 通報遷移
  const handleReportUser = useCallback(() => {
    if (!resolvedUserId) return;
    router.push(`/report?targetType=user&targetId=${resolvedUserId}` as Href);
  }, [resolvedUserId, router]);

  // PopupMenu items
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (!resolvedUserId || isOwner) return [];
    return [
      isBlocked
        ? {
            id: 'unblock',
            label: t('menu.unblockUser'),
            icon: 'person-add-outline' as const,
            onPress: handleUnblock,
          }
        : {
            id: 'block',
            label: t('menu.blockUser'),
            icon: 'ban-outline' as const,
            destructive: true,
            onPress: () => handleBlock(resolvedUserId),
          },
      {
        id: 'report',
        label: t('menu.report'),
        icon: 'flag-outline' as const,
        onPress: handleReportUser,
      },
    ];
  }, [resolvedUserId, isOwner, isBlocked, t, handleBlock, handleUnblock, handleReportUser]);

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
      <PageHeader
        title="プロフィール"
        rightComponent={
          !isOwner && currentUserId && resolvedUserId ? (
            <PopupMenu items={menuItems} />
          ) : undefined
        }
      />

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
