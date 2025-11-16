/**
 * 投稿作成モーダル Widget
 *
 * FSDの原則：Widgetは複数のFeatureを組み合わせた複合コンポーネント
 */

import React from 'react';
import { Modal } from 'react-native';
import { CreatePostForm } from '@/features/create-post';
import { useCreatePost } from '@/entities/post';
import { useCurrentUserId } from '@/entities/user';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const currentUserId = useCurrentUserId();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (content: string, machiId?: string) => {
    if (!currentUserId) return; // 未ログインの場合は何もしない

    createPost(
      {
        userId: currentUserId,
        content,
        stationId: machiId,
        isDraft: false,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error('投稿作成エラー:', error);
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
      <CreatePostForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isPending}
      />
    </Modal>
  );
}
