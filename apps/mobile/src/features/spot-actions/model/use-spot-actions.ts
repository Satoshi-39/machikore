/**
 * useSpotActions
 *
 * スポット操作（編集・削除・通報・ブロック）をまとめて取得する便利フック
 * 個別に使いたい場合は useSpotEdit, useSpotDelete, useSpotReport を直接使用
 */

import { useSpotEdit } from './use-spot-edit';
import { useSpotDelete } from './use-spot-delete';
import { useSpotReport } from './use-spot-report';
import { useBlockAction } from '@/features/block-user';

interface UseSpotActionsOptions {
  /** 現在のユーザーID（通報・ブロック時に必要） */
  currentUserId?: string | null;
  /** 削除成功時のコールバック */
  onDeleteSuccess?: () => void;
}

export function useSpotActions(options?: UseSpotActionsOptions) {
  const { handleEdit } = useSpotEdit();
  const { handleDelete, isDeleting } = useSpotDelete({
    onSuccess: options?.onDeleteSuccess,
  });
  const { handleReport } = useSpotReport({
    currentUserId: options?.currentUserId,
  });
  const { handleBlock } = useBlockAction({
    currentUserId: options?.currentUserId,
  });

  return {
    handleEdit,
    handleDelete,
    handleReport,
    handleBlock,
    isDeleting,
  };
}
