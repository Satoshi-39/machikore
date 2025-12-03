/**
 * アクションシート（ボトムシート型メニュー）
 *
 * 三点リーダなどからアクションメニューを表示する
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 表示時：下からスライドアップ
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 非表示時：下にスライドダウン
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* 背景オーバーレイ（フェード） */}
        <Animated.View
          className="absolute inset-0 bg-black/50"
          style={{ opacity: fadeAnim }}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* メニューコンテンツ（スライドアップ） */}
        <Animated.View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl"
          style={{
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* タイトル（オプション） */}
          {title && (
            <View className="px-6 py-4 border-b border-border-light dark:border-dark-border-light">
              <Text className="text-center text-base text-foreground-secondary dark:text-dark-foreground-secondary">{title}</Text>
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
                className={`flex-row items-center px-4 py-4 active:bg-background-secondary dark:bg-dark-background-secondary ${
                  index < items.length - 1 ? 'border-b border-border-light dark:border-dark-border-light' : ''
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
                    item.destructive ? 'text-red-500' : 'text-foreground dark:text-dark-foreground'
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
              className="bg-muted dark:bg-dark-muted rounded-xl py-4 active:bg-gray-200"
            >
              <Text className="text-center text-base font-medium text-foreground dark:text-dark-foreground">
                キャンセル
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
