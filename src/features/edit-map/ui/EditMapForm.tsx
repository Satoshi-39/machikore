/**
 * マップ編集フォーム Feature
 *
 * FSD: features/edit-map/ui に配置
 * - 純粋なUIコンポーネント
 * - ビジネスロジックはmodel層のhookを使用
 */

import { useCategories } from '@/entities/category';
import { useMapLabels } from '@/entities/map-label';
import { ThumbnailPicker, type ThumbnailImage } from '@/features/pick-images';
import { MapLabelsSection, type LocalMapLabel } from '@/features/manage-map-labels';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import { formatLocalizedDate } from '@/shared/lib/utils';
import type { MapWithUser } from '@/shared/types';
import { TagInput, PublicToggle } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Switch,
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

/** DBから取得したラベルをLocalMapLabel形式に変換 */
function toLocalLabels(dbLabels: { id: string; name: string; color: string; sort_order: number }[]): LocalMapLabel[] {
  return dbLabels.map((l) => ({
    id: l.id,
    name: l.name,
    color: l.color,
    sort_order: l.sort_order,
  }));
}

export function EditMapForm({
  map,
  initialTags,
  onSubmit,
  isLoading = false,
}: EditMapFormProps) {
  const { t } = useI18n();
  const { data: categories = [] } = useCategories();

  // ラベルデータ取得
  const { data: dbLabels = [], isLoading: isLabelsLoading } = useMapLabels(map.id);

  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    map.category_id || null
  );
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isPublic, setIsPublic] = useState(map.is_public);
  const [showLabelChips, setShowLabelChips] = useState(map.show_label_chips ?? false);

  // ラベルのローカルステート
  const [labels, setLabels] = useState<LocalMapLabel[]>([]);
  const [initialLabels, setInitialLabels] = useState<LocalMapLabel[]>([]);

  // DBからラベルを読み込んだらローカルステートにセット
  useEffect(() => {
    if (dbLabels.length > 0 || !isLabelsLoading) {
      const converted = toLocalLabels(dbLabels);
      setLabels(converted);
      setInitialLabels(converted);
    }
  }, [dbLabels, isLabelsLoading]);

  // サムネイル関連
  const [thumbnailImage, setThumbnailImage] = useState<ThumbnailImage | null>(
    map.thumbnail_url ? { uri: map.thumbnail_url, width: 0, height: 0 } : null
  );
  const [originalThumbnailUrl] = useState(map.thumbnail_url);

  // model層のhookを使用して変更検知
  const { hasChanges, isFormValid } = useEditMapFormChanges(map, initialTags, initialLabels, {
    name,
    description,
    selectedCategoryId,
    isPublic,
    showLabelChips,
    thumbnailUri: thumbnailImage?.uri || null,
    tags,
    labels,
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
      showLabelChips,
      // 新しい画像が選択された場合のみ送信（既存URLの場合は送らない）
      thumbnailImage:
        thumbnailChanged &&
        thumbnailImage &&
        !thumbnailImage.uri.startsWith('http')
          ? thumbnailImage
          : undefined,
      removeThumbnail: thumbnailRemoved,
      labels,
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
              {t('editMap.mapInfo')}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {map.spots_count}
              </Text>
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {t('editMap.spots')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {map.likes_count}
              </Text>
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {t('editMap.likes')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">
                {t('editMap.createdAt')}
              </Text>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {formatLocalizedDate(new Date(map.created_at))}
              </Text>
            </View>
          </View>
        </View>

        {/* マップ名（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('editMap.mapNameLabel')} <Text className="text-red-500">{t('editMap.required')}</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('editMap.mapNamePlaceholder')}
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
            {t('editMap.descriptionLabel')} <Text className="text-red-500">{t('editMap.required')}</Text>
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('editMap.descriptionPlaceholder')}
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
            {t('editMap.categoryLabel')} <Text className="text-red-500">{t('editMap.required')}</Text>
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
                    {getTranslatedName(category.name, category.name_translations)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ラベル管理 */}
        {isLabelsLoading ? (
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
              {t('editMap.labelLabel')}
            </Text>
            <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
          </View>
        ) : (
          <MapLabelsSection labels={labels} onLabelsChange={setLabels} />
        )}

        {/* ラベルチップ表示設定 */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-4">
              <Ionicons
                name="pricetags-outline"
                size={20}
                color={showLabelChips ? colors.primary.DEFAULT : '#9CA3AF'}
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
                {t('editMap.showLabelChips')}
              </Text>
            </View>
            <Switch
              value={showLabelChips}
              onValueChange={setShowLabelChips}
              trackColor={{ false: '#D1D5DB', true: colors.primary.DEFAULT }}
              thumbColor="#fff"
            />
          </View>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            {t('editMap.showLabelChipsDescription')}
          </Text>
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('editMap.tagsLabel')}
          </Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('editMap.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* サムネイル */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('editMap.thumbnailLabel')}
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={setThumbnailImage}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={isPublic
              ? t('editMap.publicDescription')
              : t('editMap.privateDescription')}
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
            {isLoading ? t('editMap.updating') : t('editMap.saveChanges')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
