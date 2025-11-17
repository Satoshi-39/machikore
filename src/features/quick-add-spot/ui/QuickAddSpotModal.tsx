/**
 * クイックスポット追加モーダル
 *
 * 現在地登録・ピン刺しの両方で使用
 * スポット名を入力して素早く登録できる
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickAddSpotModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSubmit: (name: string, latitude: number, longitude: number) => void;
}

export function QuickAddSpotModal({
  visible,
  latitude,
  longitude,
  onClose,
  onSubmit,
}: QuickAddSpotModalProps) {
  const [spotName, setSpotName] = useState('');

  const handleSubmit = () => {
    if (spotName.trim()) {
      onSubmit(spotName.trim(), latitude, longitude);
      setSpotName(''); // リセット
      onClose();
    }
  };

  const handleClose = () => {
    setSpotName(''); // リセット
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* 背景オーバーレイ */}
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={handleClose}
        >
          {/* モーダルコンテンツ */}
          <Pressable
            className="bg-white rounded-2xl w-full max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">スポットを登録</Text>
              <Pressable onPress={handleClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* コンテンツ */}
            <View className="px-6 py-6">
              {/* 位置情報表示 */}
              <View className="flex-row items-center mb-4 bg-blue-50 px-4 py-3 rounded-lg">
                <Ionicons name="location" size={20} color="#3B82F6" />
                <Text className="ml-2 text-sm text-blue-700">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </Text>
              </View>

              {/* スポット名入力 */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  スポット名 <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholder="例: お気に入りのカフェ"
                  value={spotName}
                  onChangeText={setSpotName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>

              {/* 登録ボタン */}
              <Pressable
                className={`py-3 rounded-lg ${
                  spotName.trim() ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onPress={handleSubmit}
                disabled={!spotName.trim()}
              >
                <Text className="text-center text-white font-semibold text-base">
                  登録する
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
