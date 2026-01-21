/**
 * useSpotDelete
 *
 * スポット削除のロジック（確認ダイアログ付き）
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDeleteSpot } from '@/entities/user-spot';
import { useI18n } from '@/shared/lib/i18n';

interface UseSpotDeleteOptions {
  /** 削除成功時のコールバック */
  onSuccess?: () => void;
}

interface DeleteSpotContext {
  /** スポットが公開中かどうか */
  isPublic?: boolean;
  /** マップの公開スポット数 */
  publicSpotsCount?: number;
}

export function useSpotDelete(options?: UseSpotDeleteOptions) {
  const { t } = useI18n();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();

  /**
   * スポット削除ハンドラ
   * @param spotId - スポットID
   * @param context - 削除コンテキスト（公開状態と公開スポット数）
   */
  const handleDelete = useCallback((spotId: string, context?: DeleteSpotContext) => {
    const { isPublic, publicSpotsCount } = context ?? {};

    // 最後の公開スポットを削除する場合、マップも非公開になることを通知
    const showUnpublishNotice = isPublic && publicSpotsCount === 1;

    const deleteAction = () => {
      deleteSpot(spotId, {
        onSuccess: options?.onSuccess,
      });
    };

    if (showUnpublishNotice) {
      // まずマップが非公開になることを通知してから削除確認
      Alert.alert(
        t('spot.unpublishNoticeTitle'),
        undefined,
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // その後削除確認ダイアログ
              Alert.alert(
                t('spotCard.deleteTitle'),
                t('spotCard.deleteMessage'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: deleteAction,
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      // 通常の削除確認
      Alert.alert(
        t('spotCard.deleteTitle'),
        t('spotCard.deleteMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: deleteAction,
          },
        ]
      );
    }
  }, [t, deleteSpot, options?.onSuccess]);

  return {
    handleDelete,
    isDeleting,
  };
}
