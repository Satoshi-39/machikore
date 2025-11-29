/**
 * PopupMenu - 三点リーダメニュー用ポップアップコンポーネント
 *
 * 三点リーダボタンのすぐ下にメニューを表示する
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { colors } from '@/shared/config';

export interface PopupMenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  destructive?: boolean;
  onPress: () => void;
}

interface PopupMenuProps {
  items: PopupMenuItem[];
  triggerIcon?: keyof typeof Ionicons.glyphMap;
  triggerSize?: number;
  triggerColor?: string;
}

export function PopupMenu({
  items,
  triggerIcon = 'ellipsis-horizontal',
  triggerSize = 20,
  triggerColor = colors.gray[600],
}: PopupMenuProps) {
  return (
    <Menu>
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

      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        {items.map((item, index) => (
          <MenuOption key={item.id} onSelect={item.onPress}>
            <View
              style={[
                styles.menuItem,
                index < items.length - 1 && styles.menuItemBorder,
              ]}
            >
              {item.icon && (
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    item.destructive
                      ? colors.danger
                      : item.iconColor || colors.gray[700]
                  }
                  style={styles.menuIcon}
                />
              )}
              <Text
                style={[
                  styles.menuLabel,
                  item.destructive && styles.destructiveLabel,
                ]}
              >
                {item.label}
              </Text>
            </View>
          </MenuOption>
        ))}
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
    paddingVertical: 4,
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
