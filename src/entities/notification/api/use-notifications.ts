/**
 * 通知取得用hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getSystemAnnouncements,
  type NotificationWithDetails,
  type SystemAnnouncement,
} from '@/shared/api/supabase/notifications';

/**
 * ユーザーの通知一覧を取得
 */
export function useNotifications(
  userId: string | null | undefined,
  options: {
    limit?: number;
    unreadOnly?: boolean;
  } = {}
) {
  return useQuery<NotificationWithDetails[], Error>({
    queryKey: ['notifications', userId, options],
    queryFn: () => {
      if (!userId) return [];
      return getUserNotifications(userId, options);
    },
    enabled: !!userId,
  });
}

/**
 * 未読通知数を取得
 */
export function useUnreadNotificationCount(userId: string | null | undefined) {
  return useQuery<number, Error>({
    queryKey: ['notifications', 'unread-count', userId],
    queryFn: () => {
      if (!userId) return 0;
      return getUnreadNotificationCount(userId);
    },
    enabled: !!userId,
    // 30秒ごとに更新
    refetchInterval: 30000,
  });
}

/**
 * 通知を既読にする
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId }: { notificationId: string; userId: string }) =>
      markNotificationAsRead(notificationId),
    onMutate: async ({ notificationId, userId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });

      const previousNotifications = queryClient.getQueryData<NotificationWithDetails[]>([
        'notifications',
        userId,
        {},
      ]);

      if (previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId, {}],
          previousNotifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      }

      // 未読カウントを更新
      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
        userId,
      ]);
      if (previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count', userId],
          Math.max(0, previousCount - 1)
        );
      }

      return { previousNotifications, previousCount };
    },
    onError: (error, { userId }, context) => {
      console.error('[useMarkNotificationAsRead] Error:', error);
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId, {}],
          context.previousNotifications
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count', userId],
          context.previousCount
        );
      }
    },
    onSettled: (_, __, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
}

/**
 * 全ての通知を既読にする
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      markAllNotificationsAsRead(userId),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] });

      const previousNotifications = queryClient.getQueryData<NotificationWithDetails[]>([
        'notifications',
        userId,
        {},
      ]);

      if (previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId, {}],
          previousNotifications.map((n) => ({ ...n, is_read: true }))
        );
      }

      queryClient.setQueryData(['notifications', 'unread-count', userId], 0);

      return { previousNotifications };
    },
    onError: (error, { userId }, context) => {
      console.error('[useMarkAllNotificationsAsRead] Error:', error);
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications', userId, {}],
          context.previousNotifications
        );
      }
    },
    onSettled: (_, __, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
}

/**
 * 通知を削除
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId }: { notificationId: string; userId: string }) =>
      deleteNotification(notificationId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: (error) => {
      console.error('[useDeleteNotification] Error:', error);
    },
  });
}

/**
 * 全ての通知を削除
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      deleteAllNotifications(userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
    onError: (error) => {
      console.error('[useDeleteAllNotifications] Error:', error);
    },
  });
}

/**
 * システムお知らせを取得
 */
export function useSystemAnnouncements() {
  return useQuery<SystemAnnouncement[], Error>({
    queryKey: ['system-announcements'],
    queryFn: getSystemAnnouncements,
    // 5分ごとに更新
    refetchInterval: 5 * 60 * 1000,
  });
}
