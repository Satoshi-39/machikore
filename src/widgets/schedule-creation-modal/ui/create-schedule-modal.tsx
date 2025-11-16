/**
 * 予定作成モーダル Widget
 *
 * FSDの原則：Widgetは複数のFeatureを組み合わせた複合コンポーネント
 */

import React from 'react';
import { Modal } from 'react-native';
import { CreateScheduleForm } from '@/features/create-schedule';
import { useCreateSchedule } from '@/entities/schedule';
import { useCurrentUserId } from '@/entities/user';

interface CreateScheduleModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateScheduleModal({ visible, onClose }: CreateScheduleModalProps) {
  const currentUserId = useCurrentUserId();
  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const handleSubmit = (
    title: string,
    scheduledAt: string,
    memo?: string,
    machiId?: string
  ) => {
    if (!currentUserId) return; // 未ログインの場合は何もしない

    createSchedule(
      {
        userId: currentUserId,
        stationId: machiId || '',
        scheduledAt,
        title,
        memo,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error('予定作成エラー:', error);
          // TODO: エラートーストを表示
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <CreateScheduleForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isPending}
      />
    </Modal>
  );
}
