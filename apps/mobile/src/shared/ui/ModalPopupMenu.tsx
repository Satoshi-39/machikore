/**
 * ModalPopupMenu - Modal版ポップアップメニュー
 *
 * BottomSheet内など、通常のPopupMenuが正しく動作しない場合に使用
 * タップ位置を測定してその場にメニューを表示する
 * UIはreact-native-popup-menuのPopoverスタイルに合わせている
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MENU_WIDTH = 160;

export interface ModalPopupMenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  destructive?: boolean;
  onPress: () => void;
}

interface ModalPopupMenuProps {
  items: ModalPopupMenuItem[];
  triggerIcon?: keyof typeof Ionicons.glyphMap;
  triggerSize?: number;
}

export function ModalPopupMenu({
  items,
  triggerIcon = 'ellipsis-horizontal',
  triggerSize = 20,
}: ModalPopupMenuProps) {
  const isDarkMode = useIsDarkMode();
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<View>(null);

  const openMenu = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      // メニューの表示位置を計算（トリガーの下、右寄せ）
      let left = x + width - MENU_WIDTH;
      let top = y + height + 4;

      // 画面外にはみ出さないように調整
      if (left < 8) left = 8;
      if (left + MENU_WIDTH > SCREEN_WIDTH - 8) left = SCREEN_WIDTH - MENU_WIDTH - 8;
      if (top + 100 > SCREEN_HEIGHT) top = y - 100; // 下に余裕がなければ上に表示

      setMenuPosition({ top, left });
      setVisible(true);
    });
  }, []);

  const closeMenu = useCallback(() => {
    setVisible(false);
  }, []);

  const handleItemPress = useCallback((onPress: () => void) => {
    closeMenu();
    onPress();
  }, [closeMenu]);

  const themeColors = isDarkMode ? colors.dark : colors.light;
  const iconColor = themeColors["on-surface-variant"];

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        className="p-1"
        hitSlop={8}
      >
        <View className="p-1">
          <Ionicons name={triggerIcon} size={triggerSize || iconSizeNum.md} className="text-on-surface-variant" />
        </View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View className="flex-1">
            <TouchableWithoutFeedback>
              <View
                className={`absolute rounded-xl py-2 shadow-lg ${
                  isDarkMode ? 'bg-surface-variant' : 'bg-surface'
                }`}
                style={{ top: menuPosition.top, left: menuPosition.left, minWidth: MENU_WIDTH }}
              >
                {items.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleItemPress(item.onPress)}
                    className={`flex-row items-center py-3 px-4 active:bg-black/5 ${
                      index < items.length - 1
                        ? isDarkMode
                          ? 'border-b border-outline'
                          : 'border-b border-outline-variant'
                        : ''
                    }`}
                  >
                    <View className="flex-row items-center">
                      {item.icon && (
                        <Ionicons
                          name={item.icon}
                          size={iconSizeNum.md}
                          color={
                            item.destructive
                              ? colors.light.error
                              : item.iconColor || iconColor
                          }
                          className="mr-3"
                        />
                      )}
                      <Text
                        className={`text-base ${
                          item.destructive
                            ? 'text-red-500'
                            : isDarkMode
                              ? 'text-white'
                              : 'text-gray-800'
                        }`}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
