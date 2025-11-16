/**
 * マップ全画面検索Widget
 */

import React from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface MapFullscreenSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

export function MapFullscreenSearch({
  searchQuery,
  onSearchChange,
  onClose,
}: MapFullscreenSearchProps) {

  return (
    <View className="flex-1 bg-white">
      {/* 検索バー */}
      <View className="bg-white border-b border-gray-200 px-5 py-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Ionicons name="search" size={20} color={colors.gray[400]} />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-800"
              placeholder="スポットを検索"
              placeholderTextColor={colors.gray[400]}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onSearchChange('')} className="p-1">
                <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
              </Pressable>
            )}
          </View>
          <Pressable onPress={onClose}>
            <Text className="text-base text-blue-600 font-medium">キャンセル</Text>
          </Pressable>
        </View>
      </View>

      {/* 検索結果・履歴エリア */}
      <ScrollView className="flex-1">
        {searchQuery.length === 0 ? (
          // 検索履歴（プレースホルダー）
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">最近の検索</Text>

            {/* サンプル履歴項目 */}
            {['東京観光マップ', 'カフェ巡りマップ', '紅葉スポット'].map((item, index) => (
              <Pressable
                key={index}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <Ionicons name="time-outline" size={20} color={colors.gray[400]} />
                <Text className="flex-1 ml-3 text-base text-gray-800">{item}</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.gray[400]} />
              </Pressable>
            ))}
          </View>
        ) : (
          // 検索結果（プレースホルダー）
          <View className="p-4">
            <Text className="text-sm text-gray-500 mb-3">
              "{searchQuery}" の検索結果
            </Text>

            {/* サンプル検索結果 */}
            {['東京タワー周辺マップ', '渋谷グルメマップ', '新宿散策マップ'].map((item, index) => (
              <Pressable
                key={index}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="map" size={20} color={colors.primary.DEFAULT} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base text-gray-800 font-medium">{item}</Text>
                  <Text className="text-sm text-gray-500 mt-0.5">25件のスポット</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
