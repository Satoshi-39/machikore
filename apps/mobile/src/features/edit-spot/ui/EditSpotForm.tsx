/**
 * スポット編集フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS, DEFAULT_SPOT_COLOR, borderRadiusNum, iconSizeNum, type SpotColor } from '@/shared/config';
import { Input, TagInput, AddressPinIcon, SpotColorPicker, LabelPicker, Button, Text as ButtonText, buttonTextVariants, Progress, PublicToggle } from '@/shared/ui';
import { ImagePickerButton, SpotThumbnailPicker, type SelectedImage, type SpotThumbnailCropResult } from '@/features/pick-images';
import type { SpotWithDetails, MapWithUser, ImageRow } from '@/shared/types';
import type { ThumbnailCrop } from '@/shared/lib/image';
import { useImageLimitGuard } from '@/features/check-usage-limit';
import { useEditSpotFormChanges } from '../model';
import { useMapLabels } from '@/entities/map-label';
import { useI18n } from '@/shared/lib/i18n';
import { getOptimizedImageUrl } from '@/shared/lib/image';
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
    /** スポットの公開/非公開設定 */
    isPublic?: boolean;
    /** サムネイル画像ID（既存画像から選択、nullで解除） */
    thumbnailImageId?: string | null;
    /** クロップ済みサムネイルのクロップ座標 */
    thumbnailCrop?: ThumbnailCrop | null;
  }) => void;
  isLoading?: boolean;
  uploadProgress?: UploadProgress;
  /** ユーザーのマップ一覧 */
  userMaps?: MapWithUser[];
  /** 選択されたマップID */
  selectedMapId?: string | null;
  /** マップ読み込み中 */
  isMapsLoading?: boolean;
  /** マップの公開スポット数（最後のスポット非公開時の警告用） */
  publicSpotsCount?: number;
  /** 変更検知コールバック（FABの非活性状態制御用） */
  onHasChangesChange?: (hasChanges: boolean) => void;
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
  publicSpotsCount = 0,
  onHasChangesChange,
}: EditSpotFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { imageLimit, handleUpgradePress } = useImageLimitGuard();

  // 一言はローカルstateで管理（サーバー値を初期値として使用）
  const [description, setDescription] = useState(spot.description ?? '');
  // 記事エディタでdescriptionが更新された場合にローカルstateを同期
  useEffect(() => {
    setDescription(spot.description ?? '');
  }, [spot.description]);
  // 記事は即座にサーバー保存されるため、常にspotから取得
  const articleContent = spot.article_content;

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  // master_spotがない場合（現在地/ピン刺し登録）の判定
  const isManualRegistration = !spot.master_spot_id;
  // 現在のスポット名を取得（TEXT型をそのまま使用）
  const spotLanguage = spot.language || 'ja';
  const initialSpotName = isManualRegistration && spot.name
    ? spot.name
    : '';

  const [spotName, setSpotName] = useState(initialSpotName);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [spotColor, setSpotColor] = useState<SpotColor>(
    (spot.spot_color as SpotColor) || DEFAULT_SPOT_COLOR
  );
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(spot.label_id ?? null);
  // 記事がない場合は強制的に非公開（公開不可）
  const [isPublic, setIsPublic] = useState<boolean>(
    articleContent ? (spot.is_public ?? false) : false
  );

  // マップが非公開かどうか
  const isMapPrivate = selectedMap ? !selectedMap.is_public : true;

  // このスポットが現在公開中かどうか（DB上の値）
  const isCurrentlyPublic = spot.is_public ?? false;

  // 公開トグルの変更ハンドラ
  const handlePublicToggleChange = (value: boolean) => {
    // 非公開→公開に変更 && マップが非公開の場合、通知を表示
    if (value && !isPublic && isMapPrivate) {
      Alert.alert(t('spot.publishNoticeTitle'));
    }
    // 公開→非公開に変更 && 最後の公開スポットの場合、通知を表示
    if (!value && isPublic && isCurrentlyPublic && publicSpotsCount === 1) {
      Alert.alert(t('spot.unpublishNoticeTitle'));
    }
    setIsPublic(value);
  };

  // マップのラベル一覧を取得
  const { data: mapLabels = [], isLoading: isLabelsLoading } = useMapLabels(selectedMapId);

  // 画像関連
  const [newImages, setNewImages] = useState<SelectedImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // サムネイル関連
  const [selectedThumbnailId, setSelectedThumbnailId] = useState<string | null>(
    spot.thumbnail_image_id ?? null
  );
  const [croppedThumbnail, setCroppedThumbnail] = useState<{
    uri: string;
    width: number;
    height: number;
    cropRegion: ThumbnailCrop;
  } | null>(null);
  // submit済みフラグ（プレビューは維持しつつ変更検知をスキップする）
  const [isCropSubmitted, setIsCropSubmitted] = useState(false);

  // 既存画像が更新されたら（アップロード/削除成功後）、ローカルの状態をリセット
  useEffect(() => {
    setNewImages([]);
    setDeletedImageIds([]);
  }, [existingImages]);

  // スポットデータが更新されたら（保存成功後の再取得）、サムネイル状態をリセット
  // thumbnail_crop をJSON文字列化して依存に入れることで、同じ画像の再クロップも検知
  const thumbnailCropKey = JSON.stringify(spot.thumbnail_crop);
  useEffect(() => {
    setSelectedThumbnailId(spot.thumbnail_image_id ?? null);
    setCroppedThumbnail(null);
    setIsCropSubmitted(false);
  }, [spot.thumbnail_image_id, thumbnailCropKey]);

  // 削除されていない既存画像
  const displayedExistingImages = existingImages.filter(
    (img) => !deletedImageIds.includes(img.id)
  );

  // サムネイルが未設定だが画像がある場合、自動選択
  useEffect(() => {
    if (selectedThumbnailId === null && displayedExistingImages.length > 0) {
      const firstImage = displayedExistingImages.reduce((min, img) =>
        (img.order_index ?? 0) < (min.order_index ?? 0) ? img : min
      );
      setSelectedThumbnailId(firstImage.id);
    }
  }, [selectedThumbnailId, displayedExistingImages]);

  // 新しい画像を追加できる残り枚数
  const maxNewImages = Math.max(0, imageLimit - displayedExistingImages.length);

  const handleDeleteExistingImage = (imageId: string) => {
    const newDeletedIds = [...deletedImageIds, imageId];
    setDeletedImageIds(newDeletedIds);
    // サムネイル画像が削除された場合は残りの画像から自動選択
    if (imageId === selectedThumbnailId) {
      const remainingImages = existingImages.filter(
        (img) => !newDeletedIds.includes(img.id)
      );
      if (remainingImages.length > 0) {
        // order_index最小の画像を自動選択
        const nextImage = remainingImages.reduce((min, img) =>
          (img.order_index ?? 0) < (min.order_index ?? 0) ? img : min
        );
        setSelectedThumbnailId(nextImage.id);
      } else {
        setSelectedThumbnailId(null);
      }
      setCroppedThumbnail(null);
      setIsCropSubmitted(false);
    }
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
    isPublic,
    thumbnailImageId: selectedThumbnailId,
    thumbnailCrop: (!isCropSubmitted && croppedThumbnail) ? croppedThumbnail.cropRegion : null,
  });

  // 変更検知を親に通知（FABの非活性状態制御用）
  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid || !hasChanges;

  // サムネイル画像選択ハンドラ（既存画像のインデックスからIDに変換）
  const handleThumbnailSelect = useCallback((index: number | null) => {
    if (index !== null) {
      const image = displayedExistingImages[index];
      if (image) {
        setSelectedThumbnailId(image.id);
      }
    }
  }, [displayedExistingImages]);

  // サムネイルクロップ完了ハンドラ
  const handleThumbnailCropComplete = useCallback((result: SpotThumbnailCropResult) => {
    setCroppedThumbnail({
      uri: result.uri,
      width: result.width,
      height: result.height,
      cropRegion: result.cropRegion,
    });
    setIsCropSubmitted(false);
  }, []);

  const handleSubmit = () => {
    const hasThumbnailChanged = selectedThumbnailId !== (spot.thumbnail_image_id ?? null) || croppedThumbnail !== null;
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
      isPublic,
      // サムネイル変更があれば渡す
      thumbnailImageId: hasThumbnailChanged ? selectedThumbnailId : undefined,
      thumbnailCrop: hasThumbnailChanged ? (croppedThumbnail?.cropRegion ?? null) : undefined,
    });
    // submit済みにして変更検知をスキップ（プレビュー表示用のcroppedThumbnailは維持）
    setIsCropSubmitted(true);
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
      className="flex-1 bg-surface"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={20}
    >
        {/* ローディングオーバーレイ */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-surface rounded-2xl p-6 mx-8 items-center">
            <ActivityIndicator size="large" className="text-primary" />
            <Text className="text-base text-on-surface-variant mt-4 text-center">
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
        <View className="mb-6 flex-row items-center">
          {isMapsLoading ? (
            <ActivityIndicator size="small" className="text-primary" />
          ) : selectedMap ? (
            <>
              <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                <Ionicons name="map" size={iconSizeNum.xs} color={colors.light['on-primary']} />
              </View>
              <Text className="text-lg font-semibold text-on-surface">{selectedMap.name}</Text>
            </>
          ) : (
            <Text className="text-base text-on-surface-variant">{t('map.noMapSelected')}</Text>
          )}
        </View>

        {/* 位置情報（読み取り専用） */}
        <View className="mb-6 bg-surface-variant rounded-lg p-4">
          <View className="mb-3">
            <Text className="text-sm font-semibold text-on-surface-variant">
              {t('spot.spotInfo')}
            </Text>
          </View>

          {/* Google検索経由のスポット名（読み取り専用） */}
          {!isManualRegistration && spot.master_spot?.name && (() => {
            const displaySpotName = extractName(spot.master_spot.name, spotLanguage);
            if (!displaySpotName) return null;
            return (
              <View className="mb-3">
                <Text className="text-base text-on-surface font-medium">
                  {displaySpotName}
                </Text>
              </View>
            );
          })()}

          {/* 住所 */}
          {(() => {
            const address = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
              || extractAddress(spot.google_short_address, spotLanguage);
            if (!address) return null;
            return (
              <View className="flex-row items-center">
                <AddressPinIcon size={iconSizeNum.sm} color={colors.light['on-surface-variant']} />
                <Text className="ml-1 text-sm text-on-surface-variant flex-1">
                  {address}
                </Text>
              </View>
            );
          })()}
        </View>

        {/* スポット名（現在地/ピン刺し登録の場合のみ編集可能） */}
        {isManualRegistration && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-on-surface mb-2">
              {t('spot.spotName')} <Text className="text-red-500">*</Text>
            </Text>
            <Input
              value={spotName}
              onChangeText={setSpotName}
              placeholder={t('spot.spotNamePlaceholder')}
              maxLength={INPUT_LIMITS.SPOT_NAME}
            />
            <Text className="text-xs text-on-surface-variant mt-1">
              {t('spot.spotNameHint')}
            </Text>
          </View>
        )}

        {/* このスポットを一言で（必須） */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-base font-semibold text-on-surface">
              {t('spot.oneWordRequired')}
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
            multiline
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-on-surface-variant">
              {description.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* 写真 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">{t('spot.photos')}</Text>

          {/* 既存の画像 */}
          {displayedExistingImages.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs text-on-surface-variant mb-2">{t('spot.existingPhotos')}</Text>
              <View className="flex-row flex-wrap gap-2">
                {displayedExistingImages.map((image) => (
                  <View key={image.id} className="relative">
                    <Image
                      source={getOptimizedImageUrl(image.cloud_path, { width: 160, height: 160, quality: 75 }) || ''}
                      style={{ width: 80, height: 80, borderRadius: borderRadiusNum.md }}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteExistingImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    >
                      <Ionicons name="close" size={iconSizeNum.sm} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 新しい画像の追加 */}
          {(maxNewImages > 0 || handleUpgradePress) && (
            <View>
              {newImages.length > 0 && (
                <Text className="text-xs text-on-surface-variant mb-2">{t('spot.newPhotos')}</Text>
              )}
              <ImagePickerButton
                images={newImages}
                onImagesChange={setNewImages}
                maxImages={maxNewImages}
                hideCount
                onUpgradePress={handleUpgradePress}
              />
            </View>
          )}

          <Text className="text-xs text-on-surface-variant mt-2">
            {t('spot.totalPhotos', { current: displayedExistingImages.length + newImages.length, max: imageLimit })}
          </Text>
        </View>

        {/* サムネイル選択 */}
        {displayedExistingImages.length > 0 && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-on-surface mb-2">{t('spot.thumbnail')}</Text>
            <SpotThumbnailPicker
              images={displayedExistingImages
                .filter((img) => img.cloud_path)
                .map((img) => ({
                  uri: getOptimizedImageUrl(img.cloud_path, { width: 400, quality: 80 }) || img.cloud_path!,
                  originalUri: img.cloud_path!,
                  width: img.width ?? 0,
                  height: img.height ?? 0,
                  id: img.id,
                }))}
              selectedIndex={(() => {
                if (!selectedThumbnailId) return null;
                const idx = displayedExistingImages.findIndex((img) => img.id === selectedThumbnailId);
                return idx >= 0 ? idx : null;
              })()}
              onSelect={handleThumbnailSelect}
              onCropComplete={handleThumbnailCropComplete}
              croppedThumbnailUri={croppedThumbnail?.uri}
              existingCrop={!croppedThumbnail ? spot.thumbnail_crop : null}
            />
          </View>
        )}

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">{t('map.tags')}</Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('map.tagsPlaceholder')}
            maxTags={10}
          />
        </View>

        {/* ラベル（今後のリリースで有効化予定） */}
        {/* {selectedMapId && (
          <View className="mb-6" style={{ zIndex: 3000 }}>
            <Text className="text-base font-semibold text-on-surface mb-2">
              {t('spot.label')}
            </Text>
            <LabelPicker
              labels={mapLabels}
              selectedLabelId={selectedLabelId}
              onLabelChange={setSelectedLabelId}
              isLoading={isLabelsLoading}
            />
          </View>
        )} */}

        {/* スポットの色 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('spot.spotColor')}
          </Text>
          <SpotColorPicker
            selectedColor={spotColor}
            onColorChange={setSpotColor}
          />
        </View>

        {/* 公開/非公開設定 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('spot.visibilitySettings')}
          </Text>
          <View className="bg-surface border-thin border-outline rounded-lg p-4">
            <PublicToggle
              value={isPublic}
              onValueChange={handlePublicToggleChange}
              description={t('spot.visibilityDescription')}
              disabled={!articleContent}
            />
            {!articleContent && (
              <Text className="text-xs text-warning mt-2">
                {t('spot.articleRequiredToPublish')}
              </Text>
            )}
          </View>
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
