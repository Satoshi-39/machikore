/**
 * 通知ページ
 *
 * FSD: pages/notifications/ui
 */

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NotificationTabs,
  type NotificationTabMode,
} from '@/widgets/notification-tabs';
import { NotificationList, AnnouncementList } from '@/widgets/notification-list';

export function NotificationsPage() {
  const [tabMode, setTabMode] = useState<NotificationTabMode>('notifications');

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* タブ */}
      <NotificationTabs tabMode={tabMode} onTabModeChange={setTabMode} />

      {/* 通知/お知らせリスト */}
      {tabMode === 'notifications' ? (
        <NotificationList />
      ) : (
        <AnnouncementList />
      )}
    </SafeAreaView>
  );
}
