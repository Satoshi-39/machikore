/**
 * EditCommentModal コンポーネント
 *
 * コメント編集用モーダル
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

interface EditCommentModalProps {
  visible: boolean;
  editText: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}

export function EditCommentModal({
  visible,
  editText,
  onChangeText,
  onSubmit,
  onCancel,
  isUpdating,
}: EditCommentModalProps) {
  const { t } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center px-4"
        onPress={onCancel}
      >
        <Pressable
          className="bg-surface dark:bg-dark-surface rounded-2xl p-4"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mb-4">{t('comment.editComment')}</Text>
          <TextInput
            value={editText}
            onChangeText={onChangeText}
            placeholder={t('comment.enterComment')}
            placeholderTextColor={colors.gray[400]}
            multiline
            maxLength={500}
            className="bg-muted dark:bg-dark-muted rounded-xl px-4 py-3 text-base min-h-[100px]"
            style={{ textAlignVertical: 'top' }}
            autoFocus
          />
          <View className="flex-row justify-end mt-4 gap-3">
            <Button
              onPress={onCancel}
              variant="ghost"
              size="sm"
            >
              <ButtonText className={buttonTextVariants({ variant: 'ghost', size: 'sm' })}>{t('common.cancel')}</ButtonText>
            </Button>
            <Button
              onPress={onSubmit}
              disabled={!editText.trim() || isUpdating}
              size="sm"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ButtonText className={buttonTextVariants({ size: 'sm' })}>{t('common.save')}</ButtonText>
              )}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
