/**
 * 公開/非公開トグルコンポーネント
 *
 * マップやコレクションの公開状態を切り替えるための共通コンポーネント
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

type ToggleVariant = 'default' | 'compact';

interface PublicToggleProps {
  /** 公開状態 */
  value: boolean;
  /** 値が変更されたときのコールバック */
  onValueChange: (value: boolean) => void;
  /** 無効状態 */
  disabled?: boolean;
  /** 表示バリアント: default（説明付き）または compact（コンパクト） */
  variant?: ToggleVariant;
  /** カスタム公開時ラベル */
  publicLabel?: string;
  /** カスタム非公開時ラベル */
  privateLabel?: string;
  /** 説明文（variantがdefaultの場合のみ表示） */
  description?: string;
}

export function PublicToggle({
  value,
  onValueChange,
  disabled = false,
  variant = 'default',
  publicLabel = '公開',
  privateLabel = '非公開',
  description,
}: PublicToggleProps) {
  if (variant === 'compact') {
    return (
      <View className="flex-row items-center">
        <Ionicons
          name={value ? 'earth' : 'lock-closed'}
          size={16}
          color={value ? colors.primary.DEFAULT : colors.gray[500]}
        />
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1 mr-3">
          {value ? '公開中' : '非公開'}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.gray[300], true: colors.primary.DEFAULT }}
          thumbColor="#fff"
          disabled={disabled}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    );
  }

  // default variant
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons
            name={value ? 'earth' : 'lock-closed'}
            size={20}
            color={value ? colors.primary.DEFAULT : colors.gray[500]}
            style={{ marginRight: 8 }}
          />
          <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
            {value ? publicLabel : privateLabel}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.gray[300], true: colors.primary.DEFAULT }}
          thumbColor="#fff"
          disabled={disabled}
        />
      </View>
      {description && (
        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
          {description}
        </Text>
      )}
    </View>
  );
}
