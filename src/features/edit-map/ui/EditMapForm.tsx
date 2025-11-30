/**
 * マップ編集フォーム Feature
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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import type { MapWithUser } from '@/shared/types';

interface EditMapFormProps {
  map: MapWithUser;
  onSubmit: (data: {
    name: string;
    description?: string;
    category?: string;
    tags: string[];
    isPublic: boolean;
    thumbnailImage?: ThumbnailImage;
    removeThumbnail?: boolean;
  }) => void;
  isLoading?: boolean;
}

export function EditMapForm({ map, onSubmit, isLoading = false }: EditMapFormProps) {
  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description || '');
  const [category, setCategory] = useState(map.category || '');
  const [tags, setTags] = useState((map.tags || []).join(', '));
  const [isPublic, setIsPublic] = useState(map.is_public);

  // サムネイル関連
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    map.thumbnail_url ? { uri: map.thumbnail_url, width: 0, height: 0 } : null
  );
  const [originalThumbnailUrl] = useState(map.thumbnail_url);

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    // サムネイルの変更を判定
    const thumbnailChanged = thumbnailImage?.uri !== originalThumbnailUrl;
    const thumbnailRemoved = !thumbnailImage && Boolean(originalThumbnailUrl);

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      isPublic,
      // 新しい画像が選択された場合のみ送信（既存URLの場合は送らない）
      thumbnailImage: thumbnailChanged && thumbnailImage && !thumbnailImage.uri.startsWith('http')
        ? thumbnailImage
        : undefined,
      removeThumbnail: thumbnailRemoved,
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* マップ統計情報（読み取り専用） */}
        <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Ionicons name="map" size={20} color={colors.primary.DEFAULT} />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              マップ情報
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-800">
                {map.spots_count}
              </Text>
              <Text className="text-xs text-gray-500">スポット</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-800">
                {map.likes_count}
              </Text>
              <Text className="text-xs text-gray-500">いいね</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 mb-1">作成日</Text>
              <Text className="text-sm text-gray-700">
                {new Date(map.created_at).toLocaleDateString('ja-JP')}
              </Text>
            </View>
          </View>
        </View>

        {/* マップ名（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            マップ名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="例：東京カフェ巡り"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">説明</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="このマップについての説明を入力してください"
            multiline
            numberOfLines={4}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* カテゴリ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">カテゴリ</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="例：グルメ, 旅行, ショッピング"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
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

        {/* サムネイル */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            サムネイル
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-gray-800">
                公開設定
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {isPublic
                  ? '誰でもこのマップを見ることができます'
                  : '自分だけがこのマップを見ることができます'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#E5E7EB', true: colors.primary.light }}
              thumbColor={isPublic ? colors.primary.DEFAULT : '#F3F4F6'}
            />
          </View>
        </View>

        {/* 更新ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading || !name.trim()}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading || !name.trim() ? 'bg-blue-300' : 'bg-blue-500'
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
