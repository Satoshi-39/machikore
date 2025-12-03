/**
 * ブックマークフォルダ作成モーダル
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import { useCreateBookmarkFolder } from '@/entities/bookmark';
import type { BookmarkFolderType } from '@/shared/api/supabase/bookmarks';

interface CreateFolderModalProps {
  visible: boolean;
  userId: string;
  folderType: BookmarkFolderType;
  onClose: () => void;
}

export function CreateFolderModal({ visible, userId, folderType, onClose }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const { mutate: createFolder, isPending } = useCreateBookmarkFolder();

  const handleCreate = useCallback(() => {
    if (!folderName.trim()) return;
    createFolder(
      { userId, name: folderName.trim(), folderType },
      {
        onSuccess: () => {
          setFolderName('');
          onClose();
        },
      }
    );
  }, [userId, folderName, folderType, createFolder, onClose]);

  const handleClose = useCallback(() => {
    setFolderName('');
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center"
        onPress={handleClose}
      >
        <Pressable
          className="bg-surface dark:bg-dark-surface rounded-2xl p-6 mx-6 w-full max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-4">
            新しいフォルダ
          </Text>
          <TextInput
            value={folderName}
            onChangeText={setFolderName}
            placeholder="フォルダ名"
            className="border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base mb-4"
            autoFocus
          />
          <View className="flex-row justify-end gap-3">
            <Pressable onPress={handleClose} className="px-4 py-2">
              <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">キャンセル</Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={!folderName.trim() || isPending}
              className={`px-4 py-2 rounded-lg ${
                folderName.trim() && !isPending ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white font-medium">作成</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
