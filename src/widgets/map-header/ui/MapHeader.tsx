/**
 * マップヘッダーWidget
 *
 * デフォルトマップとカスタムマップのヘッダー表示を切り替える
 * FSDの原則：Widget層は複数の要素を組み合わせた複合コンポーネント
 */

import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MapRow } from '@/shared/types/database.types';

interface MapHeaderProps {
  isCustomMap: boolean;
  mapTitle?: string;
  userName?: string;
  userAvatarUrl?: string;
  userId?: string;
  userMaps?: MapRow[];
  onClose?: () => void;
  onMapSelect?: (mapId: string) => void;
  onUserPress?: () => void;
}

export function MapHeader({
  isCustomMap,
  mapTitle,
  userName,
  userAvatarUrl,
  userId,
  userMaps = [],
  onClose,
  onMapSelect,
  onUserPress,
}: MapHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMapTitlePress = () => {
    if (userMaps.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleMapItemPress = (mapId: string) => {
    onMapSelect?.(mapId);
    setIsDropdownOpen(false);
  };

  return (
    <View className="bg-white px-5 py-4">
      {isCustomMap ? (
        // カスタムマップ：✕ボタン（左）、マップ名（中央）、ユーザーアイコン（右）
        <View className="flex-row items-center">
          {/* ✕ボタン（左端・固定幅）- クリックでデフォルトマップに戻る */}
          <Pressable
            onPress={onClose}
            className="items-center justify-center"
            style={{ width: 40 }}
          >
            <Ionicons name="close-circle-outline" size={32} color="#007AFF" />
          </Pressable>

          {/* マップ名（中央）- クリックでドロップダウン表示 */}
          <View className="flex-1 items-center">
            <Pressable
              onPress={handleMapTitlePress}
              className="flex-row items-center"
            >
              <Text className="text-xl font-bold text-gray-800">
                {mapTitle || `${userName || 'ゲスト'}のマップ`}
              </Text>
              {userMaps.length > 0 && (
                <Ionicons
                  name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6B7280"
                  style={{ marginLeft: 8 }}
                />
              )}
            </Pressable>

            {/* ドロップダウンメニュー */}
            {isDropdownOpen && userMaps.length > 0 && (
              <View
                className="absolute top-10 bg-white rounded-lg shadow-lg border border-gray-200"
                style={{
                  width: 280,
                  maxHeight: 300,
                  zIndex: 1000,
                }}
              >
                <ScrollView>
                  {userMaps.map((map) => (
                    <Pressable
                      key={map.id}
                      onPress={() => handleMapItemPress(map.id)}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {map.name}
                      </Text>
                      {map.description && (
                        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                          {map.description}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* ユーザーアイコン（右端・固定幅） */}
          <Pressable
            style={{ width: 40 }}
            className="items-end"
            onPress={onUserPress}
          >
            {userAvatarUrl ? (
              <Image
                source={{ uri: userAvatarUrl }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-base font-bold text-gray-600">
                  {userName?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </Pressable>
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
