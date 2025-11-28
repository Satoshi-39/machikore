/**
 * アクションシート（ボトムシート型メニュー）
 *
 * 三点リーダなどからアクションメニューを表示する
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ActionSheetItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
  title?: string;
}

export function ActionSheet({ visible, onClose, items, title }: ActionSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        {/* 背景タップで閉じる */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* メニューコンテンツ */}
        <View
          className="bg-white rounded-t-3xl"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* タイトル（オプション） */}
          {title && (
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-center text-base text-gray-500">{title}</Text>
            </View>
          )}

          {/* メニュー項目 */}
          <View className="px-4 pt-2">
            {items.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                className={`flex-row items-center px-4 py-4 active:bg-gray-50 ${
                  index < items.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 items-center">
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={item.destructive ? '#EF4444' : item.iconColor || '#374151'}
                  />
                </View>
                <Text
                  className={`flex-1 text-base ml-3 ${
                    item.destructive ? 'text-red-500' : 'text-gray-800'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* キャンセルボタン */}
          <View className="px-4 pt-2">
            <Pressable
              onPress={onClose}
              className="bg-gray-100 rounded-xl py-4 active:bg-gray-200"
            >
              <Text className="text-center text-base font-medium text-gray-800">
                キャンセル
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
