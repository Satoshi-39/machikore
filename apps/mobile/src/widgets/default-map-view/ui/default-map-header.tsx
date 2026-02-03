/**
 * デフォルトマップヘッダー（Snapchat風）
 *
 * 左: 街コレアイコン または 戻るボタン
 * 中央: 現在地の街/市区/都道府県名（アイコン付き）
 * 右: 虫眼鏡アイコン（検索ボタン）
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, LOCATION_ICONS, LOCATION_TYPE_MAP, iconSizeNum, shadow } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DefaultMapHeaderProps {
  /** 表示する地名 */
  locationName: string;
  /** 地名の種類 */
  locationType: 'machi' | 'city' | 'prefecture' | 'region' | 'country' | 'earth' | 'unknown';
  /** 検索ボタン押下時 */
  onSearchPress?: () => void;
  /** 地名押下時 */
  onLocationPress?: () => void;
  /** 非表示状態 */
  isHidden?: boolean;
  /** 戻るボタンを表示するか */
  showBackButton?: boolean;
  /** 戻るボタン押下時 */
  onBackPress?: () => void;
}

export function DefaultMapHeader({
  locationName,
  locationType,
  onSearchPress,
  onLocationPress,
  isHidden = false,
  showBackButton = false,
  onBackPress,
}: DefaultMapHeaderProps) {
  const isDarkMode = useIsDarkMode();

  // 地名の種類に応じたアイコン設定を取得
  const iconKey = LOCATION_TYPE_MAP[locationType] || 'MASTER_SPOT';
  const locationConfig = LOCATION_ICONS[iconKey];

  return (
    <View
      className="flex-row items-center justify-between px-4 py-2"
      style={{
        opacity: isHidden ? 0 : 1,
      }}
      pointerEvents={isHidden ? 'none' : 'auto'}
    >
      {/* 左: 戻るボタン または 街コレアイコン */}
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress}
          className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center"
          style={{
            ...shadow.dropdown,
            ...(isDarkMode && { shadowOpacity: 0.4 }),
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={iconSizeNum.lg}
            color={isDarkMode ? colors.primitive.gray[300] : colors.primitive.gray[600]}
          />
        </TouchableOpacity>
      ) : (
        <View className="w-12 h-12 items-center justify-center">
          <Image
            source={require('@assets/images/machikore7.png')}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        </View>
      )}

      {/* 中央: 地名表示（楕円形コンテナ） */}
      <View className="flex-1 items-center mx-2">
        <TouchableOpacity
          onPress={onLocationPress}
          className="rounded-full bg-surface-variant items-center justify-center"
          style={{
            ...shadow.dropdown,
            ...(isDarkMode && { shadowOpacity: 0.4 }),
            width: SCREEN_WIDTH / 2,
            height: 40,
          }}
          activeOpacity={0.7}
        >
          {/* 左端のアイコン（絶対位置） */}
          <View
            className={`absolute left-1 w-8 h-8 rounded-full items-center justify-center ${locationConfig.bgColor}`}
          >
            {'emoji' in locationConfig ? (
              <Text className="text-base">{locationConfig.emoji}</Text>
            ) : (
              <Ionicons
                name={locationConfig.name}
                size={iconSizeNum.sm}
                color={locationConfig.color}
              />
            )}
          </View>
          {/* 中央の地名 */}
          <Text
            className="text-lg font-semibold text-on-surface"
            numberOfLines={1}
          >
            {locationName || '街コレ'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 右: 虫眼鏡アイコン */}
      <TouchableOpacity
        onPress={onSearchPress}
        className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center"
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
          size={iconSizeNum.lg}
          color={isDarkMode ? colors.primitive.gray[300] : colors.primitive.gray[600]}
        />
      </TouchableOpacity>
    </View>
  );
}
