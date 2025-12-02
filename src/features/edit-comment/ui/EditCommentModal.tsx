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
          className="bg-white rounded-2xl p-4"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">コメントを編集</Text>
          <TextInput
            value={editText}
            onChangeText={onChangeText}
            placeholder="コメントを入力..."
            placeholderTextColor={colors.gray[400]}
            multiline
            maxLength={500}
            className="bg-gray-100 rounded-xl px-4 py-3 text-base min-h-[100px]"
            style={{ textAlignVertical: 'top' }}
            autoFocus
          />
          <View className="flex-row justify-end mt-4 gap-3">
            <Pressable
              onPress={onCancel}
              className="px-4 py-2 rounded-lg"
            >
              <Text className="text-gray-600 font-semibold">キャンセル</Text>
            </Pressable>
            <Pressable
              onPress={onSubmit}
              disabled={!editText.trim() || isUpdating}
              className="bg-primary px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">保存</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
