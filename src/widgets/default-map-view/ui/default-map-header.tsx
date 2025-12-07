/**
 * デフォルトマップヘッダー（Snapchat風）
 *
 * 左: 街コレアイコン
 * 中央: 現在地の街/市区/都道府県名（アイコン付き）
 * 右: 虫眼鏡アイコン（検索ボタン）
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DefaultMapHeaderProps {
  /** 表示する地名 */
  locationName: string;
  /** 地名の種類 */
  locationType: 'machi' | 'city' | 'prefecture' | 'country' | 'earth' | 'unknown';
  /** 検索ボタン押下時 */
  onSearchPress?: () => void;
  /** 地名押下時 */
  onLocationPress?: () => void;
  /** 非表示状態 */
  isHidden?: boolean;
}

export function DefaultMapHeader({
  locationName,
  locationType,
  onSearchPress,
  onLocationPress,
  isHidden = false,
}: DefaultMapHeaderProps) {
  const isDarkMode = useIsDarkMode();

  // 地名の種類に応じたアイコン設定（検索結果と同じ）
  const getLocationConfig = () => {
    switch (locationType) {
      case 'machi':
        return { iconName: 'map' as const, iconColor: colors.secondary.DEFAULT, bgColor: 'bg-green-100', emoji: null };
      case 'city':
        return { iconName: 'business' as const, iconColor: '#ea580c', bgColor: 'bg-orange-100', emoji: null };
      case 'prefecture':
        return { iconName: 'earth' as const, iconColor: '#9333ea', bgColor: 'bg-purple-100', emoji: null };
      case 'country':
        return { iconName: null, iconColor: null, bgColor: 'bg-white', emoji: '🇯🇵' };
      case 'earth':
        return { iconName: 'globe' as const, iconColor: '#0284c7', bgColor: 'bg-sky-100', emoji: null };
      default:
        return { iconName: 'location' as const, iconColor: colors.primary.DEFAULT, bgColor: 'bg-blue-100', emoji: null };
    }
  };

  const locationConfig = getLocationConfig();

  return (
    <View
      className="flex-row items-center justify-between px-4 py-2"
      style={{
        opacity: isHidden ? 0 : 1,
      }}
      pointerEvents={isHidden ? 'none' : 'auto'}
    >
      {/* 左: 街コレアイコン */}
      <View className="w-12 h-12 items-center justify-center">
        <Image
          source={require('../../../../assets/images/machikore7.png')}
          style={{ width: 44, height: 44 }}
          resizeMode="contain"
        />
      </View>

      {/* 中央: 地名表示（楕円形コンテナ） */}
      <View className="flex-1 items-center mx-2">
        <TouchableOpacity
          onPress={onLocationPress}
          className="rounded-full bg-surface dark:bg-dark-surface-elevated items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.4 : 0.15,
            shadowRadius: 4,
            elevation: 4,
            width: SCREEN_WIDTH / 2,
            height: 40,
          }}
          activeOpacity={0.7}
        >
          {/* 左端のアイコン（絶対位置） */}
          <View
            className={`absolute left-1 w-8 h-8 rounded-full items-center justify-center ${locationConfig.bgColor}`}
          >
            {locationConfig.emoji ? (
              <Text className="text-base">{locationConfig.emoji}</Text>
            ) : (
              <Ionicons
                name={locationConfig.iconName!}
                size={16}
                color={locationConfig.iconColor!}
              />
            )}
          </View>
          {/* 中央の地名 */}
          <Text
            className="text-lg font-semibold text-foreground dark:text-dark-foreground"
            numberOfLines={1}
          >
            {locationName || '街コレ'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 右: 虫眼鏡アイコン */}
      <TouchableOpacity
        onPress={onSearchPress}
        className="w-10 h-10 rounded-full bg-surface dark:bg-dark-surface-elevated items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name="search"
          size={22}
          color={isDarkMode ? colors.gray[300] : colors.gray[600]}
        />
      </TouchableOpacity>
    </View>
  );
}
