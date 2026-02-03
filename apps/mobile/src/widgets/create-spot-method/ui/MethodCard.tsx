/**
 * 登録方法カード
 *
 * スポット登録方法の選択肢を表示するカード
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface MethodCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MethodCard({
  icon,
  title,
  description,
  onPress,
  disabled = false,
  loading = false,
}: MethodCardProps) {
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="flex-row items-center bg-surface-variant rounded-xl p-4"
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      {/* アイコン */}
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${themeColors.primary}15` }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={themeColors.primary} />
        ) : (
          <Ionicons name={icon} size={iconSizeNum.lg} color={themeColors.primary} />
        )}
      </View>

      {/* テキスト */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-medium text-on-surface">{title}</Text>
        <Text className="text-sm text-on-surface-variant mt-0.5">{description}</Text>
      </View>

      {/* シェブロン */}
      <Ionicons
        name="chevron-forward"
        size={iconSizeNum.md}
        color={themeColors['on-surface-variant']}
      />
    </Pressable>
  );
}
