/**
 * 通知取得用hooks
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getSystemAnnouncements,
  getUnreadAnnouncementCount,
  markAnnouncementAsRead,
  markAllAnnouncementsAsRead,
  getReadAnnouncementIds,
  type NotificationWithDetails,
  type SystemAnnouncement,
} from '@/shared/api/supabase/notifications';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { NOTIFICATIONS_PAGE_SIZE } from '@/shared/config';
import { dismissAllNotifications, dismissNotificationById } from '@/shared/lib/notifications';
import { log } from '@/shared/config/logger';

/**
 * ユーザーの通知一覧を取得（無限スクロール対応）
 */
export function useNotifications(userId: string | null | undefined) {
  return useInfiniteQuery<NotificationWithDetails[], Error>({
    queryKey: QUERY_KEYS.notificationsList(userId || ''),
    queryFn: ({ pageParam }) => {
      if (!userId) return [];
      return getUserNotifications(userId, {
        limit: NOTIFICATIONS_PAGE_SIZE,
        cursor: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < NOTIFICATIONS_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.created_at;
    },
    enabled: !!userId,
    // 通知画面を開くたびに最新を取得
    staleTime: 0,
  });
}

/**
 * 未読通知数を取得
 */
export function useUnreadNotificationCount(userId: string | null | undefined) {
  return useQuery<number, Error>({
    queryKey: QUERY_KEYS.notificationsUnreadCount(userId || ''),
    queryFn: () => {
      if (!userId) return 0;
      return getUnreadNotificationCount(userId);
    },
    enabled: !!userId,
    // 画面遷移時に最新の未読数を取得
    staleTime: 0,
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
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notificationsList(userId) });

      const previousData = queryClient.getQueryData<InfiniteData<NotificationWithDetails[]>>(
        QUERY_KEYS.notificationsList(userId)
      );

      if (previousData) {
        queryClient.setQueryData<InfiniteData<NotificationWithDetails[]>>(
          QUERY_KEYS.notificationsList(userId),
          {
            ...previousData,
            pages: previousData.pages.map((page) =>
              page.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n
              )
            ),
          }
        );
      }

      // 未読カウントを更新
      const previousCount = queryClient.getQueryData<number>(
        QUERY_KEYS.notificationsUnreadCount(userId)
      );
      if (previousCount !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.notificationsUnreadCount(userId),
          Math.max(0, previousCount - 1)
        );
      }

      return { previousData, previousCount };
    },
    onError: (error, { userId }, context) => {
      log.error('[Notification] Error:', error);
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.notificationsList(userId),
          context.previousData
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.notificationsUnreadCount(userId),
          context.previousCount
        );
      }
    },
    onSuccess: async (_, { notificationId }) => {
      // ロック画面（通知センター）から該当通知を削除
      await dismissNotificationById(notificationId);
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
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notificationsList(userId) });

      const previousData = queryClient.getQueryData<InfiniteData<NotificationWithDetails[]>>(
        QUERY_KEYS.notificationsList(userId)
      );

      if (previousData) {
        queryClient.setQueryData<InfiniteData<NotificationWithDetails[]>>(
          QUERY_KEYS.notificationsList(userId),
          {
            ...previousData,
            pages: previousData.pages.map((page) =>
              page.map((n) => ({ ...n, is_read: true }))
            ),
          }
        );
      }

      queryClient.setQueryData(QUERY_KEYS.notificationsUnreadCount(userId), 0);

      return { previousData };
    },
    onError: (error, { userId }, context) => {
      log.error('[Notification] Error:', error);
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.notificationsList(userId),
          context.previousData
        );
      }
    },
    onSuccess: async () => {
      // ロック画面の通知も全削除
      await dismissAllNotifications();
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
    onSuccess: async (_, { notificationId, userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount(userId) });
      // ロック画面（通知センター）から該当通知を削除
      await dismissNotificationById(notificationId);
    },
    onError: (error) => {
      log.error('[Notification] Error:', error);
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
    onSuccess: async (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsList(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount(userId) });
      // ロック画面の通知も全削除
      await dismissAllNotifications();
    },
    onError: (error) => {
      log.error('[Notification] Error:', error);
    },
  });
}

/**
 * システムお知らせを取得
 * @param userCreatedAt ユーザーの作成日（指定した場合、それ以降のお知らせのみ取得）
 */
export function useSystemAnnouncements(userCreatedAt?: string) {
  return useQuery<SystemAnnouncement[], Error>({
    queryKey: [...QUERY_KEYS.announcementsSystem(), userCreatedAt],
    queryFn: () => getSystemAnnouncements(userCreatedAt),
    // 5分ごとに更新
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * 未読お知らせ数を取得
 * @param userCreatedAt ユーザーの作成日（指定した場合、それ以降のお知らせのみカウント）
 */
export function useUnreadAnnouncementCount(
  userId: string | null | undefined,
  userCreatedAt?: string
) {
  return useQuery<number, Error>({
    queryKey: [...QUERY_KEYS.announcementsUnreadCount(userId || ''), userCreatedAt],
    queryFn: () => {
      if (!userId) return 0;
      return getUnreadAnnouncementCount(userId, userCreatedAt);
    },
    enabled: !!userId,
  });
}

/**
 * 通知とお知らせの合計未読数を取得
 * @param userCreatedAt ユーザーの作成日（お知らせのフィルタリングに使用）
 */
export function useTotalUnreadCount(
  userId: string | null | undefined,
  userCreatedAt?: string
) {
  const { data: notificationCount = 0 } = useUnreadNotificationCount(userId);
  const { data: announcementCount = 0 } = useUnreadAnnouncementCount(userId, userCreatedAt);

  return notificationCount + announcementCount;
}

/**
 * お知らせを既読にする
 */
export function useMarkAnnouncementAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, announcementId }: { userId: string; announcementId: string }) =>
      markAnnouncementAsRead(userId, announcementId),
    onMutate: async ({ userId, announcementId }) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.announcementsReadIds(userId) });

      const previousReadIds = queryClient.getQueryData<Set<string>>(
        QUERY_KEYS.announcementsReadIds(userId)
      );

      if (previousReadIds) {
        const newReadIds = new Set(previousReadIds);
        newReadIds.add(announcementId);
        queryClient.setQueryData(QUERY_KEYS.announcementsReadIds(userId), newReadIds);
      }

      // 未読カウントを更新
      // queryKeyにuserCreatedAtが含まれるため、プレフィックスマッチで全一致キーを更新
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.announcementsUnreadCount(userId) });
      const previousCountEntries = queryClient.getQueriesData<number>({
        queryKey: QUERY_KEYS.announcementsUnreadCount(userId),
      });
      queryClient.setQueriesData<number>(
        { queryKey: QUERY_KEYS.announcementsUnreadCount(userId) },
        (old) => old !== undefined ? Math.max(0, old - 1) : old,
      );

      return { previousReadIds, previousCountEntries };
    },
    onError: (error, { userId }, context) => {
      log.error('[Notification] Error:', error);
      if (context?.previousReadIds) {
        queryClient.setQueryData(QUERY_KEYS.announcementsReadIds(userId), context.previousReadIds);
      }
      if (context?.previousCountEntries) {
        for (const [key, value] of context.previousCountEntries) {
          if (value !== undefined) {
            queryClient.setQueryData(key, value);
          }
        }
      }
    },
  });
}

/**
 * 全てのお知らせを既読にする
 */
export function useMarkAllAnnouncementsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      markAllAnnouncementsAsRead(userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.announcementsUnreadCount(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.announcementsReadIds(userId) });
    },
    onError: (error) => {
      log.error('[Notification] Error:', error);
    },
  });
}

/**
 * ユーザーが既読にしたお知らせIDを取得
 */
export function useReadAnnouncementIds(userId: string | null | undefined) {
  return useQuery<Set<string>, Error>({
    queryKey: QUERY_KEYS.announcementsReadIds(userId || ''),
    queryFn: () => {
      if (!userId) return new Set<string>();
      return getReadAnnouncementIds(userId);
    },
    enabled: !!userId,
  });
}
