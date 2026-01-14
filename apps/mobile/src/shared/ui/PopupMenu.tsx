/**
 * PopupMenu - 三点リーダメニュー用ポップアップコンポーネント
 *
 * 三点リーダボタンのすぐ下にメニューを表示する
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const { Popover } = renderers;

export interface PopupMenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  destructive?: boolean;
  /** falseにするとメニューを閉じない（いいね・ブックマーク等に有効） */
  closeOnSelect?: boolean;
  onPress: () => void;
}

interface PopupMenuProps {
  items: PopupMenuItem[];
  triggerIcon?: keyof typeof Ionicons.glyphMap;
  triggerSize?: number;
  triggerColor?: string;
  /** 画面上部に配置される場合にSafeAreaを考慮する */
  respectSafeArea?: boolean;
}

export function PopupMenu({
  items,
  triggerIcon = 'ellipsis-horizontal',
  triggerSize = 20,
  triggerColor = colors.gray[600],
  respectSafeArea = false,
}: PopupMenuProps) {
  const isDarkMode = useIsDarkMode();
  const insets = useSafeAreaInsets();

  // ダークモード対応のスタイル（光沢のある黒テーマに合わせた色）
  const dynamicStyles = {
    optionsContainer: {
      ...styles.optionsContainer,
      backgroundColor: isDarkMode ? '#1A1A1A' : 'white', // 暗めの背景
      ...(respectSafeArea && { marginTop: insets.top }), // SafeAreaを考慮（オプション）
    },
    menuItemBorder: {
      ...styles.menuItemBorder,
      borderBottomColor: isDarkMode ? '#2A2A2A' : colors.gray[200], // 暗めのボーダー
    },
    menuLabel: {
      ...styles.menuLabel,
      color: isDarkMode ? '#FFFFFF' : colors.gray[800], // 純白テキスト
    },
    iconColor: isDarkMode ? '#A0A0A0' : colors.text.secondary, // グレーアイコン（#6B7280）
  };

  const renderMenuItem = (item: PopupMenuItem, index: number) => {
    const content = (
      <View
        style={[
          styles.menuItem,
          index < items.length - 1 && dynamicStyles.menuItemBorder,
        ]}
      >
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={20}
            color={
              item.destructive
                ? colors.danger
                : item.iconColor || dynamicStyles.iconColor
            }
            style={styles.menuIcon}
          />
        )}
        <Text
          style={[
            dynamicStyles.menuLabel,
            item.destructive && styles.destructiveLabel,
          ]}
        >
          {item.label}
        </Text>
      </View>
    );

    // closeOnSelect === falseの場合、Pressableでラップしてメニューを閉じない
    if (item.closeOnSelect === false) {
      return (
        <MenuOption key={item.id} disableTouchable>
          <Pressable
            onPress={item.onPress}
            style={({ pressed }) => [
              pressed && styles.menuItemPressed,
            ]}
          >
            {content}
          </Pressable>
        </MenuOption>
      );
    }

    // 通常: メニュー選択時に閉じる
    return (
      <MenuOption key={item.id} onSelect={item.onPress}>
        {content}
      </MenuOption>
    );
  };

  return (
    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
      <MenuTrigger
        customStyles={{
          triggerWrapper: styles.triggerWrapper,
          triggerTouchable: {
            activeOpacity: 0.7,
          },
        }}
      >
        <View style={styles.triggerButton}>
          <Ionicons name={triggerIcon} size={triggerSize} color={triggerColor} />
        </View>
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsContainer: dynamicStyles.optionsContainer }}>
        {items.map((item, index) => renderMenuItem(item, index))}
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  triggerWrapper: {
    padding: 4,
  },
  triggerButton: {
    padding: 4,
  },
  optionsContainer: {
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    opacity: 0.5,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200],
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.gray[800],
  },
  destructiveLabel: {
    color: colors.danger,
  },
});
