/**
 * マップ作成フォーム Feature
 *
 * FSD: features/create-map/ui に配置
 * - 純粋なUIコンポーネント
 * - ビジネスロジックはmodel層のhookを使用
 */

import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import { INPUT_LIMITS, colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Input, TagInput, PublicToggle, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    null
  );
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

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
      isPublic: false, // 新規作成時はスポットがないため必ず非公開
      thumbnailImage: thumbnailImage || undefined,
    });
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-surface-variant"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="p-4">
        {/* マップ名 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface">
            {t('map.mapNameRequired')} <Text className="text-red-500">*</Text>
          </Text>
          <Input
            value={mapName}
            onChangeText={setMapName}
            placeholder={t('map.mapNamePlaceholder')}
            maxLength={INPUT_LIMITS.MAP_NAME}
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {mapName.length}/{INPUT_LIMITS.MAP_NAME}
          </Text>
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('map.descriptionRequired')} <Text className="text-red-500">*</Text>
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('map.descriptionPlaceholder')}
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.MAP_DESCRIPTION}
            textAlignVertical="top"
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {description.length}/{INPUT_LIMITS.MAP_DESCRIPTION}
          </Text>
        </View>

        {/* カテゴリー */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-on-surface mb-2">
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
                      ? 'bg-primary-container border-blue-500'
                      : 'bg-surface border-outline'
                  }`}
                  style={isLastRow ? { marginBottom: 0 } : undefined}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={iconName}
                    size={28}
                    color={isSelected ? themeColors.primary : themeColors['on-surface-variant']}
                  />
                  <Text
                    className={`text-xs font-medium mt-1.5 ${
                      isSelected
                        ? 'text-blue-500'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {getTranslatedName(category.name, category.name_translations, locale)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* サムネイル画像 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('map.thumbnail')}
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('map.tags')}
          </Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('map.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-surface border border-outline rounded-lg px-4 py-3 opacity-50">
          <PublicToggle
            value={false}
            onValueChange={() => {}}
            description={t('map.publicDescription')}
            disabled
          />
          <Text className="text-xs text-error mt-2">
            {t('editMap.publicSpotsRequiredToPublish')}
          </Text>
        </View>

        {/* 作成ボタン */}
        <View className="mb-4">
          <Button onPress={handleSubmit} disabled={isButtonDisabled}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('map.createMap')}
              </ButtonText>
            )}
          </Button>
        </View>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
