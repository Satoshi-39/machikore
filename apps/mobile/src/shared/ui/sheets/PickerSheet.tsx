/**
 * ピッカーシート
 *
 * ドロップダウン選択用のボトムシート
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, iconSizeNum, duration as durationTokens } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

export interface PickerOption<T = string> {
  value: T;
  label: string;
}

interface PickerSheetProps<T = string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  allowDeselect?: boolean;
}

export function PickerSheet<T = string>({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  allowDeselect = true,
}: PickerSheetProps<T>) {
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: durationTokens.slow,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: durationTokens.slow,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: durationTokens.medium,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: durationTokens.medium,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleSelect = (value: T) => {
    if (allowDeselect && selectedValue === value) {
      // 同じ値をタップしたら選択解除
      onSelect(null as T);
    } else {
      onSelect(value);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* 背景オーバーレイ */}
        <Animated.View
          className="absolute inset-0 bg-black/50"
          style={{ opacity: fadeAnim }}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* シートコンテンツ */}
        <Animated.View
          className="bg-surface rounded-t-3xl"
          style={{
            maxHeight: MAX_SHEET_HEIGHT,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ヘッダー */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b-thin border-outline-variant">
            <View className="w-10" />
            <Text className="text-base font-semibold text-on-surface">
              {title}
            </Text>
            <Pressable onPress={onClose} className="w-10 items-end">
              <Ionicons name="close" size={iconSizeNum.lg} color={themeColors['on-surface-variant']} />
            </Pressable>
          </View>

          {/* オプションリスト */}
          <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const isSelected = selectedValue === option.value;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => handleSelect(option.value)}
                  className={`flex-row items-center justify-between px-4 py-4 ${
                    index < options.length - 1
                      ? 'border-b-thin border-outline-variant'
                      : ''
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected
                        ? 'text-primary font-medium'
                        : 'text-on-surface'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={22}
                      className="text-primary"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
