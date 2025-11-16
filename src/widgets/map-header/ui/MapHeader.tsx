/**
 * マップヘッダーWidget
 *
 * デフォルトマップとカスタムマップのヘッダー表示を切り替える
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MapHeaderProps {
  isCustomMap: boolean;
  userName?: string;
  userAvatarUrl?: string;
  onLogoPress?: () => void;
}

export function MapHeader({
  isCustomMap,
  userName,
  userAvatarUrl,
  onLogoPress,
}: MapHeaderProps) {
  return (
    <View className="bg-white px-5 py-4">
      {isCustomMap ? (
        // カスタムマップ：ロゴ（左）、マップ名（中央）、ユーザーアイコン（右）
        <View className="flex-row items-center">
          {/* ロゴ（左端・固定幅）- クリックでデフォルトマップに戻る */}
          <Pressable
            onPress={onLogoPress}
            className="flex-row items-center"
            style={{ width: 80 }}
          >
            <Ionicons name="map" size={20} color="#007AFF" />
            <Text className="ml-1 text-base font-bold text-blue-500">街コレ</Text>
          </Pressable>

          {/* マップ名（中央） */}
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">
              {userName || 'ゲスト'}のマップ
            </Text>
          </View>

          {/* ユーザーアイコン（右端・固定幅） */}
          <View style={{ width: 80 }} className="items-end">
            {userAvatarUrl ? (
              <Image
                source={{ uri: userAvatarUrl }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-lg font-bold text-gray-600">
                  {userName?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        // デフォルトマップ：ロゴ（左）+ キャッチフレーズ（中央）
        <View className="flex-row items-center">
          {/* ロゴ（左端） */}
          <View className="flex-row items-center">
            <Ionicons name="map" size={20} color="#007AFF" />
            <Text className="ml-1 text-base font-bold text-blue-500">街コレ</Text>
          </View>

          {/* キャッチフレーズ（中央） */}
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-gray-700">
              日本の街を再発見しよう
            </Text>
          </View>

          {/* 右側のスペース（バランス調整） */}
          <View style={{ width: 60 }} />
        </View>
      )}
    </View>
  );
}
