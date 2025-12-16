/**
 * 通知設定を取得・更新するhooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
  type UpdateNotificationSettingsParams,
} from '@/shared/api/supabase/notification-settings';
import { updatePushToken, clearPushToken } from '@/shared/api/supabase/users';
import { getExpoPushToken } from '@/features/push-notifications';
import { log } from '@/shared/config/logger';

const QUERY_KEY = ['notification-settings'];

/**
 * 通知設定を取得
 */
export function useNotificationSettings() {
  return useQuery<NotificationSettings, Error>({
    queryKey: QUERY_KEY,
    queryFn: getNotificationSettings,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}

/**
 * 通知設定を更新
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation<NotificationSettings, Error, UpdateNotificationSettingsParams>({
    mutationFn: async (settings) => {
      const result = await updateNotificationSettings(settings);

      // push_enabledが変更された場合、トークンの登録/クリアを行う
      if (settings.push_enabled !== undefined) {
        if (settings.push_enabled) {
          // ONにした場合：トークンを再登録
          const token = await getExpoPushToken();
          if (token) {
            await updatePushToken(token);
            log.info('[User] Push token registered');
          }
        } else {
          // OFFにした場合：トークンをクリア
          await clearPushToken();
          log.info('[User] Push token cleared');
        }
      }

      return result;
    },
    onMutate: async (newSettings) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousSettings = queryClient.getQueryData<NotificationSettings>(QUERY_KEY);

      if (previousSettings) {
        queryClient.setQueryData<NotificationSettings>(QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        });
      }

      return { previousSettings };
    },
    onError: (_err, _newSettings, context) => {
      // エラー時はロールバック
      const ctx = context as { previousSettings?: NotificationSettings } | undefined;
      if (ctx?.previousSettings) {
        queryClient.setQueryData(QUERY_KEY, ctx.previousSettings);
      }
    },
    onSuccess: (data) => {
      // 成功時はサーバーから返ってきたデータでキャッシュを更新
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}
