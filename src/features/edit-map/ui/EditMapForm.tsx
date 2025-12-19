/**
 * マップ編集フォーム Feature
 *
 * FSD: features/edit-map/ui に配置
 * - 純粋なUIコンポーネント
 * - ビジネスロジックはmodel層のhookを使用
 */

import { useCategories } from '@/entities/category';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import {
  colors,
  INPUT_LIMITS,
  USER_MAP_THEME_COLOR_LIST,
  type UserMapThemeColor,
} from '@/shared/config';
import type { MapWithUser } from '@/shared/types';
import { TagInput, PublicToggle } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useEditMapFormChanges, type EditMapFormData } from '../model';

// カテゴリアイコンのマッピング
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  gourmet: 'restaurant',
  shopping: 'cart',
  tourism: 'camera',
  culture: 'library',
  entertainment: 'mic',
  activity: 'bicycle',
  lifestyle: 'home',
  learning: 'school',
  other: 'ellipsis-horizontal',
};

interface EditMapFormProps {
  map: MapWithUser;
  /** 中間テーブルから取得したタグ名の配列 */
  initialTags: string[];
  onSubmit: (data: EditMapFormData) => void;
  isLoading?: boolean;
}

export function EditMapForm({
  map,
  initialTags,
  onSubmit,
  isLoading = false,
}: EditMapFormProps) {
  const { data: categories = [] } = useCategories();

  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    map.category_id || null
  );
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isPublic, setIsPublic] = useState(map.is_public);

  // サムネイル関連
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    map.thumbnail_url ? { uri: map.thumbnail_url, width: 0, height: 0 } : null
  );
  const [originalThumbnailUrl] = useState(map.thumbnail_url);
  const [themeColor, setThemeColor] = useState<UserMapThemeColor>(
    (map.theme_color as UserMapThemeColor) || 'pink'
  );

  // model層のhookを使用して変更検知
  const { hasChanges, isFormValid } = useEditMapFormChanges(map, initialTags, {
    name,
    description,
    selectedCategoryId,
    isPublic,
    themeColor,
    thumbnailUri: thumbnailImage?.uri || null,
    tags,
  });

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid || !hasChanges;

  const handleSubmit = () => {
    if (!isFormValid || !selectedCategoryId) {
      return;
    }

    // サムネイルの変更を判定
    const thumbnailChanged = thumbnailImage?.uri !== originalThumbnailUrl;
    const thumbnailRemoved = !thumbnailImage && Boolean(originalThumbnailUrl);

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      categoryId: selectedCategoryId,
      tags,
      isPublic,
      // 新しい画像が選択された場合のみ送信（既存URLの場合は送らない）
      thumbnailImage:
        thumbnailChanged &&
        thumbnailImage &&
        !thumbnailImage.uri.startsWith('http')
          ? thumbnailImage
          : undefined,
      removeThumbnail: thumbnailRemoved,
      themeColor,
    });
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background-secondary dark:bg-dark-background-secondary"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="p-4">
        {/* マップ統計情報（読み取り専用） */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="map" size={20} color={colors.primary.DEFAULT} />
            <Text className="ml-2 text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
              マップ情報
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {map.spots_count}
              </Text>
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                スポット
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {map.likes_count}
              </Text>
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                いいね
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">
                作成日
              </Text>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {new Date(map.created_at).toLocaleDateString('ja-JP')}
              </Text>
            </View>
          </View>
        </View>

        {/* マップ名（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            マップ名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="例：東京カフェ巡り"
            maxLength={INPUT_LIMITS.MAP_NAME}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base text-foreground dark:text-dark-foreground"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {name.length}/{INPUT_LIMITS.MAP_NAME}
          </Text>
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            説明 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="このマップについての説明を入力してください"
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.MAP_DESCRIPTION}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base text-foreground dark:text-dark-foreground"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {description.length}/{INPUT_LIMITS.MAP_DESCRIPTION}
          </Text>
        </View>

        {/* カテゴリ */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            カテゴリ <Text className="text-red-500">*</Text>
          </Text>
          <FlatList
            data={categories}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
            renderItem={({ item: category, index }) => {
              const isSelected = selectedCategoryId === category.id;
              const isLastRow = index >= categories.length - 3;
              const iconName =
                CATEGORY_ICONS[category.id] || 'ellipsis-horizontal';
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategoryId(category.id)}
                  className={`w-[31%] aspect-[4/3] rounded-xl border-2 items-center justify-center ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                      : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
                  }`}
                  style={isLastRow ? { marginBottom: 0 } : undefined}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={iconName}
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
                    {category.name}
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

        {/* サムネイル */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            サムネイル
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* テーマカラー */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            テーマカラー
          </Text>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
            マップ上のスポットがこの色で表示されます
          </Text>
          <View className="flex-row justify-between">
            {USER_MAP_THEME_COLOR_LIST.map((colorItem) => {
              const isSelected = themeColor === colorItem.key;
              const isWhite = colorItem.key === 'white';
              return (
                <TouchableOpacity
                  key={colorItem.key}
                  onPress={() => setThemeColor(colorItem.key)}
                  className={`w-9 h-9 rounded-full items-center justify-center ${
                    isSelected ? 'border-2 border-blue-500' : ''
                  } ${isWhite ? 'border border-gray-300' : ''}`}
                  style={{ backgroundColor: colorItem.color }}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={
                        isWhite || colorItem.key === 'yellow'
                          ? '#374151'
                          : '#FFFFFF'
                      }
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={isPublic
              ? '誰でもこのマップを見ることができます'
              : '自分だけがこのマップを見ることができます'}
          />
        </View>

        {/* 更新ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          className={`py-4 rounded-lg items-center mb-4 ${
            isButtonDisabled ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '更新中...' : '変更を保存'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
