/**
 * useBlockAction
 *
 * ユーザーブロック確認ダイアログとブロック実行のロジック
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useBlockUser } from '@/entities/block';

interface UseBlockActionOptions {
  /** 現在のユーザーID（未ログイン時はnull） */
  currentUserId?: string | null;
  /** ブロック成功時のコールバック */
  onSuccess?: () => void;
}

export function useBlockAction(options?: UseBlockActionOptions) {
  const router = useRouter();
  const { t } = useI18n();
  const blockMutation = useBlockUser();

  const handleBlock = useCallback((targetUserId: string) => {
    if (!options?.currentUserId) {
      showLoginRequiredAlert(t('block.action'));
      return;
    }

    if (options.currentUserId === targetUserId) {
      return;
    }

    Alert.alert(
      t('block.confirmTitle'),
      t('block.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('block.blockButton'),
          style: 'destructive',
          onPress: () => {
            blockMutation.mutate(
              { blockerId: options.currentUserId!, blockedId: targetUserId },
              { onSuccess: options?.onSuccess }
            );
          },
        },
      ]
    );
  }, [options?.currentUserId, options?.onSuccess, blockMutation, router, t]);

  return {
    handleBlock,
    isBlocking: blockMutation.isPending,
  };
}
