/**
 * スポット作成フォーム Feature
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { PlaceSearchResult } from '@/features/search-places';

interface CreateSpotFormProps {
  placeData: PlaceSearchResult; // Google Places APIから取得した情報
  onSubmit: (data: {
    customName: string;
    description?: string;
    tags: string[];
  }) => void;
  isLoading?: boolean;
}

export function CreateSpotForm({ placeData, onSubmit, isLoading = false }: CreateSpotFormProps) {
  // カスタム名の初期値はGoogle元の名前
  const [customName, setCustomName] = useState(placeData.name);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!customName.trim()) {
      Alert.alert('エラー', 'スポット名を入力してください');
      return;
    }

    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Google元の情報（読み取り専用） */}
        <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={20} color={colors.primary.DEFAULT} />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              Google Placesから取得した情報
            </Text>
          </View>

          {/* Google元の名前 */}
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">スポット名（元）</Text>
            <Text className="text-base text-gray-800 font-medium">{placeData.name}</Text>
          </View>

          {/* 住所 */}
          {placeData.address && (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">住所</Text>
              <Text className="text-sm text-gray-700">{placeData.address}</Text>
            </View>
          )}

          {/* 座標 */}
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color={colors.gray[500]} />
            <Text className="ml-1 text-xs text-gray-500">
              {placeData.latitude.toFixed(6)}, {placeData.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* カスタム名（編集可能） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            スポット名 <Text className="text-red-500">*</Text>
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

        {/* 登録ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '登録中...' : 'スポットを登録'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
