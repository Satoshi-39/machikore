/**
 * useMapActions
 *
 * マップ操作（編集・削除・通報）をまとめて取得する便利フック
 * 個別に使いたい場合は useMapEdit, useMapDelete, useMapReport を直接使用
 */

import { useMapEdit } from './use-map-edit';
import { useMapDelete } from './use-map-delete';
import { useMapReport } from './use-map-report';

interface UseMapActionsOptions {
  /** 現在のユーザーID（通報時に必要） */
  currentUserId?: string | null;
  /** 削除成功時のコールバック */
  onDeleteSuccess?: () => void;
}

export function useMapActions(options?: UseMapActionsOptions) {
  const { handleEdit } = useMapEdit();
  const { handleDelete, isDeleting } = useMapDelete({
    onSuccess: options?.onDeleteSuccess,
  });
  const { handleReport } = useMapReport({
    currentUserId: options?.currentUserId,
  });

  return {
    handleEdit,
    handleDelete,
    handleReport,
    isDeleting,
  };
}
