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
import { colors, INPUT_LIMITS, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import { formatLocalizedDate } from '@/shared/lib/utils';
import type { MapWithUser } from '@/shared/types';
import { TagInput, PublicToggle, Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
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
  /** 公開スポット数（マップ公開の可否判定用） */
  publicSpotsCount?: number;
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
  publicSpotsCount = 0,
}: EditMapFormProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const { data: categories = [] } = useCategories();

  // ラベルデータ取得
  const { data: dbLabels = [], isLoading: isLabelsLoading } = useMapLabels(map.id);

  const [name, setName] = useState(map.name);
  const [description, setDescription] = useState(map.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    map.category_id || null
  );
  const [tags, setTags] = useState<string[]>(initialTags);
  // 公開スポットがない場合は強制的に非公開
  const [isPublic, setIsPublic] = useState(publicSpotsCount > 0 ? map.is_public : false);
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
    map.thumbnail_url ? {
      uri: map.thumbnail_url,
      width: map.thumbnail_crop?.imageWidth ?? 0,
      height: map.thumbnail_crop?.imageHeight ?? 0,
    } : null
  );
  const [originalThumbnailUrl] = useState(map.thumbnail_url);
  // submit済みフラグ（submit後に変更検知をスキップする）
  const [isSubmitted, setIsSubmitted] = useState(false);

  // サムネイル変更時にsubmitフラグをリセット
  const handleThumbnailChange = (image: ThumbnailImage | null) => {
    setThumbnailImage(image);
    setIsSubmitted(false);
  };

  // model層のhookを使用して変更検知
  // isSubmitted時はthumbnailUriを元のURLとして扱い、変更なしと判定する
  const { hasChanges, isFormValid } = useEditMapFormChanges(map, initialTags, initialLabels, {
    name,
    description,
    selectedCategoryId,
    isPublic,
    showLabelChips,
    thumbnailUri: isSubmitted ? (map.thumbnail_url ?? null) : (thumbnailImage?.uri || null),
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
    // submit済みにして変更検知をスキップ
    setIsSubmitted(true);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-surface"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="p-4">
        {/* マップ統計情報（読み取り専用） */}
        <View className="mb-6 bg-surface rounded-lg p-4 border-thin border-outline">
          <View className="flex-row items-center mb-3">
            <Ionicons name="map" size={iconSizeNum.md} className="text-primary" />
            <Text className="ml-2 text-sm font-semibold text-on-surface-variant">
              {t('editMap.mapInfo')}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xl font-bold text-on-surface">
                {map.spots_count}
              </Text>
              <Text className="text-xs text-on-surface-variant">
                {t('editMap.spots')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-on-surface">
                {map.likes_count}
              </Text>
              <Text className="text-xs text-on-surface-variant">
                {t('editMap.likes')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-on-surface-variant mb-1">
                {t('editMap.createdAt')}
              </Text>
              <Text className="text-sm text-on-surface-variant">
                {formatLocalizedDate(new Date(map.created_at))}
              </Text>
            </View>
          </View>
        </View>

        {/* マップ名（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('editMap.mapNameLabel')} <Text className="text-red-500">{t('editMap.required')}</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('editMap.mapNamePlaceholder')}
            maxLength={INPUT_LIMITS.MAP_NAME}
            className="bg-surface border-thin border-outline rounded-lg px-4 py-3 text-base text-on-surface"
            placeholderTextColor={colors.light['on-surface-variant']}
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {name.length}/{INPUT_LIMITS.MAP_NAME}
          </Text>
        </View>

        {/* 説明 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('editMap.descriptionLabel')} <Text className="text-red-500">{t('editMap.required')}</Text>
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('editMap.descriptionPlaceholder')}
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.MAP_DESCRIPTION}
            className="bg-surface border-thin border-outline rounded-lg px-4 py-3 text-base text-on-surface"
            placeholderTextColor={colors.light['on-surface-variant']}
            textAlignVertical="top"
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {description.length}/{INPUT_LIMITS.MAP_DESCRIPTION}
          </Text>
        </View>

        {/* カテゴリ */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-on-surface mb-2">
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
                  className={`w-[31%] aspect-[4/3] rounded-xl items-center justify-center ${
                    isSelected
                      ? 'bg-primary-container'
                      : 'bg-surface border-thin border-outline'
                  }`}
                  style={[
                    isLastRow ? { marginBottom: 0 } : undefined,
                    isSelected ? { borderWidth: 2, borderColor: themeColors.primary } : undefined,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={iconName}
                    size={iconSizeNum.xl}
                    color={isSelected ? themeColors.primary : themeColors['on-surface-variant']}
                  />
                  <Text
                    className={`text-xs font-medium mt-1.5 ${
                      isSelected
                        ? 'text-primary'
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

        {/* サムネイル */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('editMap.thumbnailLabel')}
          </Text>
          <ThumbnailPicker
            image={thumbnailImage}
            onImageChange={handleThumbnailChange}
            initialCrop={map.thumbnail_crop}
          />
        </View>

        {/* ラベル管理（今後のリリースで有効化予定） */}
        {/* {isLabelsLoading ? (
          <View className="mb-6">
            <Text className="text-base font-semibold text-on-surface mb-2">
              {t('editMap.labelLabel')}
            </Text>
            <ActivityIndicator size="small" className="text-primary" />
          </View>
        ) : (
          <MapLabelsSection labels={labels} onLabelsChange={setLabels} />
        )} */}

        {/* ラベルチップ表示設定（今後のリリースで有効化予定） */}
        {/* <View className={`mb-6 bg-surface rounded-lg p-4 border-thin border-outline ${labels.length === 0 ? 'opacity-50' : ''}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-4">
              <Ionicons
                name="pricetags-outline"
                size={iconSizeNum.md}
                color={showLabelChips && labels.length > 0 ? themeColors.primary : themeColors['on-surface-variant']}
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-medium text-on-surface">
                {t('editMap.showLabelChips')}
              </Text>
            </View>
            <Switch
              value={showLabelChips}
              onValueChange={setShowLabelChips}
              disabled={labels.length === 0}
              trackColor={{ false: themeColors['outline-variant'], true: themeColors.primary }}
              thumbColor="#fff"
            />
          </View>
          <Text className="text-xs text-on-surface-variant mt-2">
            {labels.length === 0
              ? t('editMap.showLabelChipsNoLabels')
              : t('editMap.showLabelChipsDescription')}
          </Text>
        </View> */}

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('editMap.tagsLabel')}
          </Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('editMap.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* 公開設定 */}
        <View className="mb-6 bg-surface rounded-lg p-4 border-thin border-outline">
          <PublicToggle
            value={isPublic}
            onValueChange={setIsPublic}
            description={isPublic
              ? t('editMap.publicDescription')
              : t('editMap.privateDescription')}
            disabled={publicSpotsCount === 0}
          />
          {publicSpotsCount === 0 && (
            <Text className="text-xs text-error mt-2">
              {t('editMap.publicSpotsRequiredToPublish')}
            </Text>
          )}
        </View>

        {/* 更新ボタン */}
        <View className="mb-4">
          <Button onPress={handleSubmit} disabled={isButtonDisabled}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('editMap.saveChanges')}
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
