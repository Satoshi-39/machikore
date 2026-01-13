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

export function useSpotDelete(options?: UseSpotDeleteOptions) {
  const { t } = useI18n();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();

  const handleDelete = useCallback((spotId: string) => {
    Alert.alert(
      t('spotCard.deleteTitle'),
      t('spotCard.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteSpot(spotId, {
              onSuccess: options?.onSuccess,
            });
          },
        },
      ]
    );
  }, [t, deleteSpot, options?.onSuccess]);

  return {
    handleDelete,
    isDeleting,
  };
}
