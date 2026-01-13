/**
 * useMapDelete
 *
 * マップ削除のロジック（確認ダイアログ付き）
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDeleteMap } from '@/entities/map';
import { useI18n } from '@/shared/lib/i18n';

interface UseMapDeleteOptions {
  /** 削除成功時のコールバック */
  onSuccess?: () => void;
}

export function useMapDelete(options?: UseMapDeleteOptions) {
  const { t } = useI18n();
  const { mutate: deleteMap, isPending: isDeleting } = useDeleteMap();

  const handleDelete = useCallback((mapId: string) => {
    Alert.alert(
      t('mapCard.deleteTitle'),
      t('mapCard.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteMap(mapId, {
              onSuccess: options?.onSuccess,
            });
          },
        },
      ]
    );
  }, [t, deleteMap, options?.onSuccess]);

  return {
    handleDelete,
    isDeleting,
  };
}
