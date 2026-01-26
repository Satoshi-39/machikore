/**
 * ブックマークフォルダ作成モーダル
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useCreateBookmarkFolder } from '@/entities/bookmark';
import type { BookmarkFolderType } from '@/shared/api/supabase/bookmarks';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface CreateFolderModalProps {
  visible: boolean;
  userId: string;
  folderType: BookmarkFolderType;
  onClose: () => void;
}

export function CreateFolderModal({ visible, userId, folderType, onClose }: CreateFolderModalProps) {
  const { t } = useI18n();
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
          className="bg-surface rounded-2xl p-6 mx-6 w-full max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-on-surface mb-4">
            {t('bookmark.newFolder')}
          </Text>
          <TextInput
            value={folderName}
            onChangeText={setFolderName}
            placeholder={t('bookmark.folderNamePlaceholder')}
            placeholderTextColor={colors.light['on-surface-variant']}
            className="border-thin border-outline rounded-lg px-4 py-3 text-base text-on-surface mb-4"
            autoFocus
          />
          <View className="flex-row justify-end gap-3">
            <Button onPress={handleClose} variant="ghost" size="sm">
              <ButtonText className={buttonTextVariants({ variant: 'ghost', size: 'sm' })}>{t('common.cancel')}</ButtonText>
            </Button>
            <Button
              onPress={handleCreate}
              disabled={!folderName.trim() || isPending}
              size="sm"
            >
              {isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ButtonText className={buttonTextVariants({ size: 'sm' })}>{t('bookmark.create')}</ButtonText>
              )}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
