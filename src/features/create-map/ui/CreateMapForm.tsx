/**
 * マップ作成フォーム Feature
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';

type MapCategory = '旅行' | 'グルメ' | '観光' | 'ショッピング' | 'アクティビティ' | 'その他';

const CATEGORIES: MapCategory[] = [
  '旅行',
  'グルメ',
  '観光',
  'ショッピング',
  'アクティビティ',
  'その他',
];

interface CreateMapFormProps {
  onSubmit: (data: {
    name: string;
    description?: string;
    category?: MapCategory;
    tags: string[];
    isPublic: boolean;
    thumbnailImage?: ThumbnailImage;
  }) => void;
  isLoading?: boolean;
}

export function CreateMapForm({ onSubmit, isLoading = false }: CreateMapFormProps) {
  const [mapName, setMapName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | null>(null);
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(null);

  const handleSubmit = () => {
    if (!mapName.trim()) {
      Alert.alert('エラー', 'マップ名を入力してください');
      return;
    }

    onSubmit({
      name: mapName.trim(),
      description: description.trim() || undefined,
      category: selectedCategory || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublic,
      thumbnailImage: thumbnailImage || undefined,
    });
  };

  return (
    <ScrollView className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <View className="p-4">
        {/* マップ名 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            マップ名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={mapName}
            onChangeText={setMapName}
            placeholder="例：東京カフェ巡り"
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            説明
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="マップの説明を入力してください"
            multiline
            numberOfLines={4}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* カテゴリー */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            カテゴリー
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            タグ
          </Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="例：カフェ, スイーツ, デート"
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            カンマ区切りで入力してください
          </Text>
        </View>

        {/* サムネイル画像 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            サムネイル
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons
                name={isPublic ? 'earth' : 'lock-closed'}
                size={20}
                color={isPublic ? '#3B82F6' : '#6B7280'}
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
                {isPublic ? '公開' : '非公開'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={isPublic ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            公開すると他のユーザーもこのマップを見ることができます
          </Text>
        </View>

        {/* 作成ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '作成中...' : 'マップを作成'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
