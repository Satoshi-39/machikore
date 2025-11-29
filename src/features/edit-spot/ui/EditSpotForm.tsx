/**
 * スポット編集フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { UserSpotWithMasterSpot } from '@/shared/api/supabase/spots';

interface EditSpotFormProps {
  spot: UserSpotWithMasterSpot;
  onSubmit: (data: {
    customName: string;
    description?: string;
    tags: string[];
  }) => void;
  isLoading?: boolean;
}

export function EditSpotForm({ spot, onSubmit, isLoading = false }: EditSpotFormProps) {
  const spotName = spot.custom_name || spot.master_spot?.name || '';

  const [customName, setCustomName] = useState(spotName);
  const [description, setDescription] = useState(spot.description || '');
  const [tags, setTags] = useState((spot.tags || []).join(', '));

  const handleSubmit = () => {
    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* 位置情報（読み取り専用） */}
        <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={20} color={colors.primary.DEFAULT} />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              スポット情報
            </Text>
          </View>

          {/* 元の名前 */}
          {spot.master_spot?.name && (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">元の名前</Text>
              <Text className="text-base text-gray-800 font-medium">
                {spot.master_spot.name}
              </Text>
            </View>
          )}

          {/* 住所 */}
          {spot.master_spot?.google_formatted_address && (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">住所</Text>
              <Text className="text-sm text-gray-700">
                {spot.master_spot.google_formatted_address}
              </Text>
            </View>
          )}

          {/* 座標 */}
          {spot.master_spot && (
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color={colors.gray[500]} />
              <Text className="ml-1 text-xs text-gray-500">
                {spot.master_spot.latitude.toFixed(6)}, {spot.master_spot.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* カスタム名（編集可能） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            スポット名
          </Text>
          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="例：お気に入りのカフェ"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-gray-500 mt-1">
            自分だけのわかりやすい名前をつけられます
          </Text>
        </View>

        {/* メモ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">メモ</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="このスポットについてのメモを入力してください"
            multiline
            numberOfLines={4}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">タグ</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="例：カフェ, 作業, Wi-Fi"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-gray-500 mt-1">
            カンマ区切りで入力してください
          </Text>
        </View>

        {/* 更新ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '更新中...' : '変更を保存'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
