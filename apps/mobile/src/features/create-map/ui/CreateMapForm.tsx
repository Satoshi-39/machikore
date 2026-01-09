/**
 * マップ作成フォーム Feature
 *
 * FSD: features/create-map/ui に配置
 * - 純粋なUIコンポーネント
 * - ビジネスロジックはmodel層のhookを使用
 */

import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import { INPUT_LIMITS } from '@/shared/config';
import { StyledTextInput, TagInput, PublicToggle } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCategories } from '@/entities/category';
import { useCreateMapFormValidation, type CreateMapFormData } from '../model';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';

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

interface CreateMapFormProps {
  onSubmit: (data: CreateMapFormData) => void;
  isLoading?: boolean;
}

export function CreateMapForm({
  onSubmit,
  isLoading = false,
}: CreateMapFormProps) {
  const { t, locale } = useI18n();
  const { data: categories = [] } = useCategories();

  const [mapName, setMapName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    null
  );

  // model層のhookを使用してバリデーション
  const { isFormValid } = useCreateMapFormValidation({
    name: mapName,
    description,
    selectedCategoryId,
  });

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid;

  const handleSubmit = () => {
    if (!mapName.trim()) {
      Alert.alert(t('common.error'), t('map.mapName'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(t('common.error'), t('map.mapDescription'));
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert(t('common.error'), t('map.categoryRequired'));
      return;
    }

    onSubmit({
      name: mapName.trim(),
      description: description.trim(),
      categoryId: selectedCategoryId,
      tags,
      isPublic,
      thumbnailImage: thumbnailImage || undefined,
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
        {/* マップ名 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
            {t('map.mapNameRequired')} <Text className="text-red-500">*</Text>
          </Text>
          <StyledTextInput
            value={mapName}
            onChangeText={setMapName}
            placeholder={t('map.mapNamePlaceholder')}
            maxLength={INPUT_LIMITS.MAP_NAME}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {mapName.length}/{INPUT_LIMITS.MAP_NAME}
          </Text>
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('map.descriptionRequired')} <Text className="text-red-500">*</Text>
          </Text>
          <StyledTextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('map.descriptionPlaceholder')}
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.MAP_DESCRIPTION}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {description.length}/{INPUT_LIMITS.MAP_DESCRIPTION}
          </Text>
        </View>

        {/* カテゴリー */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('map.categoryRequired')} <Text className="text-red-500">*</Text>
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
                    {getTranslatedName(category.name, category.name_translations, locale)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('map.tags')}
          </Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('map.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* サムネイル画像 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('map.thumbnail')}
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={t('map.publicDescription')}
          />
        </View>

        {/* 作成ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          className={`py-4 rounded-lg items-center mb-4 ${
            isButtonDisabled ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? t('map.creating') : t('map.createMap')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
