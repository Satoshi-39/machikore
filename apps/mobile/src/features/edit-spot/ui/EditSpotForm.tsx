/**
 * スポット編集フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import { Input, TagInput, AddressPinIcon, SpotColorPicker, LabelPicker, Button, Text as ButtonText, buttonTextVariants, Progress } from '@/shared/ui';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { SpotWithDetails, MapWithUser, ImageRow } from '@/shared/types';
import { useEditSpotFormChanges } from '../model';
import { useMapLabels } from '@/entities/map-label';
import { useI18n, getCurrentLocale } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'updating' | 'uploading' | 'deleting' | 'done';
}

interface EditSpotFormProps {
  spot: SpotWithDetails;
  existingImages?: ImageRow[];
  /** 中間テーブルから取得したタグ名の配列 */
  initialTags: string[];
  onSubmit: (data: {
    description: string;
    tags: string[];
    newImages?: SelectedImage[];
    deletedImageIds?: string[];
    mapId?: string;
    spotColor?: SpotColor;
    labelId?: string | null;
    /** 現在地/ピン刺し登録のスポット名（編集） */
    spotName?: string;
  }) => void;
  isLoading?: boolean;
  uploadProgress?: UploadProgress;
  /** ユーザーのマップ一覧 */
  userMaps?: MapWithUser[];
  /** 選択されたマップID */
  selectedMapId?: string | null;
  /** マップ読み込み中 */
  isMapsLoading?: boolean;
}

export function EditSpotForm({
  spot,
  existingImages = [],
  initialTags,
  onSubmit,
  isLoading = false,
  uploadProgress,
  userMaps = [],
  selectedMapId,
  isMapsLoading = false,
}: EditSpotFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const initialDescription = spot.description || '';

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  // master_spotがない場合（現在地/ピン刺し登録）の判定
  const isManualRegistration = !spot.master_spot_id;
  // 現在のスポット名を取得（JSONB形式から現在のlocaleで抽出）
  const uiLanguage = getCurrentLocale();
  const initialSpotName = isManualRegistration && spot.name
    ? extractName(spot.name, uiLanguage) || ''
    : '';

  const [description, setDescription] = useState(initialDescription);
  const [spotName, setSpotName] = useState(initialSpotName);
  const articleContent = spot.article_content || '';
  const [tags, setTags] = useState<string[]>(initialTags);
  const [spotColor, setSpotColor] = useState<SpotColor>(
    (spot.spot_color as SpotColor) || DEFAULT_SPOT_COLOR
  );
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(spot.label_id ?? null);

  // マップのラベル一覧を取得
  const { data: mapLabels = [], isLoading: isLabelsLoading } = useMapLabels(selectedMapId);

  // 画像関連
  const [newImages, setNewImages] = useState<SelectedImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // 削除されていない既存画像
  const displayedExistingImages = existingImages.filter(
    (img) => !deletedImageIds.includes(img.id)
  );

  // 新しい画像を追加できる残り枚数
  const maxNewImages = Math.max(0, INPUT_LIMITS.MAX_IMAGES_PER_SPOT - displayedExistingImages.length);

  const handleDeleteExistingImage = (imageId: string) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
  };

  // 変更検出とバリデーション
  const { hasChanges, isFormValid } = useEditSpotFormChanges(spot, initialTags, {
    description,
    tags,
    newImages,
    deletedImageIds,
    selectedMapId: selectedMapId ?? null,
    spotColor,
    labelId: selectedLabelId,
    spotName,
  });

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid || !hasChanges;

  const handleSubmit = () => {
    onSubmit({
      description: description.trim(),
      tags,
      newImages: newImages.length > 0 ? newImages : undefined,
      deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
      mapId: selectedMapId || undefined,
      spotColor,
      labelId: selectedLabelId,
      // 現在地/ピン刺し登録の場合のみスポット名を渡す
      spotName: isManualRegistration ? spotName.trim() : undefined,
    });
  };

  // ローディング表示のテキストを決定
  const getLoadingText = () => {
    if (!uploadProgress || uploadProgress.status === 'idle') {
      return t('spot.updatingSpot');
    }
    if (uploadProgress.status === 'deleting') {
      return t('spot.deletingImages');
    }
    if (uploadProgress.status === 'uploading') {
      return t('spot.uploadingImages', { current: uploadProgress.current, total: uploadProgress.total });
    }
    return t('spot.processingComplete');
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background-secondary dark:bg-dark-background-secondary"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20}
    >
        {/* ローディングオーバーレイ */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-surface dark:bg-dark-surface rounded-2xl p-6 mx-8 items-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary mt-4 text-center">
              {getLoadingText()}
            </Text>
            {uploadProgress && uploadProgress.status === 'uploading' && uploadProgress.total > 0 && (
              <Progress
                className="w-48 mt-3"
                value={uploadProgress.current}
                max={uploadProgress.total}
              />
            )}
          </View>
        </View>
      </Modal>

      <View className="p-4">
        {/* マップ（表示のみ） - 一番上 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('map.belongingMap')}
          </Text>
          <View className="bg-muted dark:bg-dark-muted border border-border dark:border-dark-border rounded-lg px-4 py-3 flex-row items-center">
            {isMapsLoading ? (
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            ) : selectedMap ? (
              <View className="flex-row items-center flex-1">
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                  <Ionicons name="map" size={12} color="#FFFFFF" />
                </View>
                <Text className="text-base text-foreground dark:text-dark-foreground">{selectedMap.name}</Text>
              </View>
            ) : (
              <Text className="text-base text-foreground-muted dark:text-dark-foreground-muted">{t('map.noMapSelected')}</Text>
            )}
          </View>
        </View>

        {/* 位置情報（読み取り専用） */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
              {t('spot.spotInfo')}
            </Text>
          </View>

          {/* Google検索経由のスポット名（読み取り専用） */}
          {!isManualRegistration && spot.master_spot?.name && (() => {
            const displaySpotName = extractName(spot.master_spot.name, uiLanguage);
            if (!displaySpotName) return null;
            return (
              <View className="mb-3">
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">{t('spot.spotName')}</Text>
                <Text className="text-base text-foreground dark:text-dark-foreground font-medium">
                  {displaySpotName}
                </Text>
              </View>
            );
          })()}

          {/* 住所 */}
          {(() => {
            const address = extractAddress(spot.master_spot?.google_short_address, uiLanguage)
              || extractAddress(spot.google_short_address, uiLanguage);
            if (!address) return null;
            return (
              <View className="flex-row items-center">
                <AddressPinIcon size={16} color={colors.gray[500]} />
                <Text className="ml-1 text-sm text-foreground-secondary dark:text-dark-foreground-secondary flex-1">
                  {address}
                </Text>
              </View>
            );
          })()}
        </View>

        {/* スポット名（現在地/ピン刺し登録の場合のみ編集可能） */}
        {isManualRegistration && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
              {t('spot.spotName')} <Text className="text-red-500">*</Text>
            </Text>
            <Input
              value={spotName}
              onChangeText={setSpotName}
              placeholder={t('spot.spotNamePlaceholder')}
              maxLength={INPUT_LIMITS.SPOT_NAME}
            />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1">
              {t('spot.spotNameHint')}
            </Text>
          </View>
        )}

        {/* このスポットを一言で！（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('spot.oneWordRequired')} <Text className="text-red-500">*</Text>
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {description.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* 記事 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">{t('spot.article')}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/edit-spot-article/${spot.id}`)}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="document-text-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="ml-3 text-base text-foreground dark:text-dark-foreground">
                {articleContent ? t('spot.articleEdit') : t('spot.articleWrite')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          {!articleContent && (
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
              {t('spot.articleWriteHint')}
            </Text>
          )}
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">{t('map.tags')}</Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('map.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* ラベル */}
        {selectedMapId && (
          <View className="mb-6" style={{ zIndex: 3000 }}>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
              {t('spot.label')}
            </Text>
            <LabelPicker
              labels={mapLabels}
              selectedLabelId={selectedLabelId}
              onLabelChange={setSelectedLabelId}
              isLoading={isLabelsLoading}
            />
          </View>
        )}

        {/* スポットの色 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            {t('spot.spotColor')}
          </Text>
          <View style={{ opacity: selectedLabelId ? 0.5 : 1 }} pointerEvents={selectedLabelId ? 'none' : 'auto'}>
            <SpotColorPicker
              selectedColor={spotColor}
              onColorChange={setSpotColor}
            />
          </View>
          {selectedLabelId && (
            <Text className="text-xs text-red-500 mt-2">
              {t('spot.labelColorNotice')}
            </Text>
          )}
        </View>

        {/* 写真 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">{t('spot.photos')}</Text>

          {/* 既存の画像 */}
          {displayedExistingImages.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-2">{t('spot.existingPhotos')}</Text>
              <View className="flex-row flex-wrap gap-2">
                {displayedExistingImages.map((image) => (
                  <View key={image.id} className="relative">
                    <Image
                      source={{ uri: image.cloud_path || '' }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteExistingImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 新しい画像の追加 */}
          {maxNewImages > 0 && (
            <View>
              {newImages.length > 0 && (
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-2">{t('spot.newPhotos')}</Text>
              )}
              <ImagePickerButton
                images={newImages}
                onImagesChange={setNewImages}
                maxImages={maxNewImages}
                hideCount
              />
            </View>
          )}

          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            {t('spot.totalPhotos', { current: displayedExistingImages.length + newImages.length, max: INPUT_LIMITS.MAX_IMAGES_PER_SPOT })}
          </Text>
        </View>

        {/* 更新ボタン */}
        <View className="mb-4">
          <Button onPress={handleSubmit} disabled={isButtonDisabled}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('spot.saveChanges')}
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
