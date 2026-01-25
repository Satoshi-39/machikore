/**
 * PopupMenu - 三点リーダメニュー用ポップアップコンポーネント
 *
 * 三点リーダボタンのすぐ下にメニューを表示する
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
  /** タップ領域の拡張（デフォルト: 8） */
  hitSlop?: number;
}

export function PopupMenu({
  items,
  triggerIcon = 'ellipsis-horizontal',
  triggerSize = 20,
  triggerColor = colors.primitive.gray[600],
  respectSafeArea = false,
  hitSlop = 8,
}: PopupMenuProps) {
  const isDarkMode = useIsDarkMode();
  const insets = useSafeAreaInsets();

  // ダークモード対応のスタイル（光沢のある黒テーマに合わせた色）
  // NOTE: react-native-popup-menuはスタイルオブジェクトを要求するため、optionsContainerのみStyleSheetを使用
  const optionsContainerStyle = {
    borderRadius: 12,
    backgroundColor: isDarkMode ? '#1A1A1A' : 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 160,
    ...(respectSafeArea && { marginTop: insets.top }),
  };

  const iconColor = isDarkMode ? '#A0A0A0' : colors.light["on-surface-variant"];

  const renderMenuItem = (item: PopupMenuItem, index: number) => {
    const isLast = index === items.length - 1;
    const content = (
      <View
        className={`flex-row items-center py-3 px-4 ${!isLast ? 'border-b' : ''}`}
        style={!isLast ? { borderBottomColor: isDarkMode ? '#2A2A2A' : colors.primitive.gray[200], borderBottomWidth: StyleSheet.hairlineWidth } : undefined}
      >
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={20}
            color={
              item.destructive
                ? colors.light.error
                : item.iconColor || iconColor
            }
            className="mr-3"
          />
        )}
        <Text
          className={`text-base ${item.destructive ? 'text-danger' : isDarkMode ? 'text-white' : 'text-gray-800'}`}
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
            className="active:opacity-50"
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
          triggerTouchable: {
            activeOpacity: 0.7,
            hitSlop: { top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop },
          },
        }}
      >
        <Ionicons name={triggerIcon} size={triggerSize} color={triggerColor} />
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsContainer: optionsContainerStyle }}>
        {items.map((item, index) => renderMenuItem(item, index))}
      </MenuOptions>
    </Menu>
  );
}
