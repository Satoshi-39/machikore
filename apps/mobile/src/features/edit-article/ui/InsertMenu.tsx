/**
 * 挿入メニュー
 *
 * エディタに画像やその他のコンテンツを挿入するためのメニュー
 * プラスボタンをタップすると表示される
 */

import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface InsertMenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

interface InsertMenuProps {
  /** メニューの表示状態 */
  visible: boolean;
  /** メニューを閉じる */
  onClose: () => void;
  /** 画像挿入 */
  onInsertImage: () => void;
}

export function InsertMenu({ visible, onClose, onInsertImage }: InsertMenuProps) {
  const isDarkMode = useIsDarkMode();

  const menuItems: InsertMenuItem[] = [
    {
      id: 'image',
      icon: 'image-outline',
      label: '画像を挿入',
      onPress: () => {
        onClose();
        onInsertImage();
      },
    },
    // 将来的に追加可能:
    // { id: 'youtube', icon: 'logo-youtube', label: 'YouTube動画', onPress: ... },
    // { id: 'divider', icon: 'remove-outline', label: '区切り線', onPress: ... },
  ];

  const handleItemPress = (item: InsertMenuItem) => {
    item.onPress();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-2xl px-4 pb-8 pt-4"
          style={{
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
          }}
        >
          {/* ハンドル */}
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-300 dark:bg-gray-600" />

          {/* タイトル */}
          <Text className="mb-4 text-center text-lg font-semibold text-foreground dark:text-dark-foreground">
            挿入
          </Text>

          {/* メニューアイテム */}
          <View className="gap-2">
            {menuItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleItemPress(item)}
                className="flex-row items-center gap-4 rounded-xl px-4 py-3 active:bg-muted dark:active:bg-dark-muted"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isDarkMode
                      ? colors.dark.muted
                      : colors.light.muted,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
                  />
                </View>
                <Text className="text-base text-foreground dark:text-dark-foreground">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* キャンセルボタン */}
          <Pressable
            onPress={onClose}
            className="mt-4 items-center rounded-xl py-3 active:bg-muted dark:active:bg-dark-muted"
          >
            <Text className="text-base font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
              キャンセル
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
