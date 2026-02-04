/**
 * useBlockAction
 *
 * ユーザーブロック確認ダイアログとブロック実行のロジック
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useBlockUser } from '@/entities/block';

interface UseBlockActionOptions {
  /** 現在のユーザーID（未ログイン時はnull） */
  currentUserId?: string | null;
  /** ブロック成功時のコールバック */
  onSuccess?: () => void;
}

export function useBlockAction(options?: UseBlockActionOptions) {
  const router = useRouter();
  const blockMutation = useBlockUser();

  const handleBlock = useCallback((targetUserId: string) => {
    if (!options?.currentUserId) {
      showLoginRequiredAlert('ブロック');
      return;
    }

    if (options.currentUserId === targetUserId) {
      return;
    }

    Alert.alert(
      'ブロックの確認',
      'このユーザーをブロックしますか？\n\nブロックすると、このユーザーのコンテンツがフィードやコメントから非表示になります。相互フォローも解除されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ブロックする',
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
  }, [options?.currentUserId, options?.onSuccess, blockMutation, router]);

  return {
    handleBlock,
    isBlocking: blockMutation.isPending,
  };
}
