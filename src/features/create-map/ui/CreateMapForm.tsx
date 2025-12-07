/**
 * マップ作成フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 */

import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import { MAP_CATEGORIES, type MapCategory } from '@/shared/config';
import { StyledTextInput, TagInput } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

export function CreateMapForm({
  onSubmit,
  isLoading = false,
}: CreateMapFormProps) {
  const [mapName, setMapName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    null
  );

  const handleSubmit = () => {
    if (!mapName.trim()) {
      Alert.alert('エラー', 'マップ名を入力してください');
      return;
    }

    onSubmit({
      name: mapName.trim(),
      description: description.trim() || undefined,
      category: selectedCategory || undefined,
      tags,
      isPublic,
      thumbnailImage: thumbnailImage || undefined,
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-background-secondary dark:bg-dark-background-secondary"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View className="p-4">
        {/* マップ名 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
            マップ名 <Text className="text-red-500">*</Text>
          </Text>
          <StyledTextInput
            value={mapName}
            onChangeText={setMapName}
            placeholder="例：東京カフェ巡り"
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            説明
          </Text>
          <StyledTextInput
            value={description}
            onChangeText={setDescription}
            placeholder="マップの説明を入力してください"
            multiline
            numberOfLines={4}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
        </View>

        {/* カテゴリー */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            カテゴリー
          </Text>
          <FlatList
            data={MAP_CATEGORIES}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item.value}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
            renderItem={({ item: category, index }) => {
              const isSelected = selectedCategory === category.value;
              const isLastRow = index >= 3;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(category.value)}
                  className={`w-[31%] aspect-[4/3] rounded-xl border-2 items-center justify-center ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                      : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
                  }`}
                  style={isLastRow ? { marginBottom: 0 } : undefined}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={category.icon}
                    size={28}
                    color={isSelected ? '#3B82F6' : '#9CA3AF'}
                  />
                  <Text
                    className={`text-xs font-medium mt-1.5 ${
                      isSelected
                        ? 'text-blue-500'
                        : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                    }`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            タグ
          </Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="タグを入力してEnter"
            maxTags={10}
          />
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
      {/* 下部余白 */}
      <View className="h-8" />
    </ScrollView>
  );
}
