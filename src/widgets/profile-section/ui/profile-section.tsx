/**
 * プロフィールセクションウィジェット
 *
 * ユーザーのプロフィール情報、統計、最近の訪問を統合表示
 */

import React from 'react';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';
import { RecentVisits } from '@/widgets/recent-visits';
import { useUser, useUserStats } from '@/entities/user/api';
import { useRecentVisits } from '@/entities/visit/api';

interface ProfileSectionProps {
  userId: string | null;
}

export function ProfileSection({ userId }: ProfileSectionProps) {
  // userIdがnullの場合は空の状態を表示
  const { data: user } = useUser(userId ?? '');
  const { data: stats } = useUserStats(userId ?? '');
  const { data: recentVisits = [] } = useRecentVisits(userId ?? '', 10);

  // 型安全な値の抽出
  const username: string = (user?.username as string | undefined) ?? 'machilog_user';
  const displayName: string = (user?.display_name as string | null | undefined) ?? 'まちログユーザー';
  const bio: string = (user?.bio as string | null | undefined) ?? '街を巡るのが好きです。色々な場所を訪れて、思い出を記録しています。';
  const avatarUrl: string | undefined = (user?.avatar_url as string | null | undefined) ?? undefined;

  return (
    <>
      {/* プロフィールヘッダー */}
      <ProfileHeader
        username={username}
        displayName={displayName}
        bio={bio}
        avatarUrl={avatarUrl}
      />

      {/* 統計情報 */}
      {stats && (
        <ProfileStats
          visitedMachiCount={stats.visitedMachiCount}
          postsCount={stats.postsCount}
          friendsCount={stats.friendsCount}
        />
      )}

      {/* 最近訪問した街 */}
      <RecentVisits visits={recentVisits} />
    </>
  );
}
