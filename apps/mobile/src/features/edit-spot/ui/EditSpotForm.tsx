/**
 * スポット編集フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 */

import React, { useState, useEffect } from 'react';
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
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { SpotWithDetails, MapWithUser, ImageRow } from '@/shared/types';
import { useEditSpotFormChanges, useEditSpotStore } from '../model';
import { useMapLabels } from '@/entities/map-label';
import { useI18n, getCurrentLocale } from '@/shared/lib/i18n';
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
    // descriptionは別ページで編集・保存するため除外
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

  // Zustandストアから一言を取得（ストアになければspotから）
  const draftDescription = useEditSpotStore((state) => state.draftDescription);
  const description = draftDescription ?? spot.description ?? '';
  // 記事は即座にサーバー保存されるため、常にspotから取得
  const articleContent = spot.article_content;

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  // master_spotがない場合（現在地/ピン刺し登録）の判定
  const isManualRegistration = !spot.master_spot_id;
  // 現在のスポット名を取得（JSONB形式から現在のlocaleで抽出）
  const uiLanguage = getCurrentLocale();
  const initialSpotName = isManualRegistration && spot.name
    ? extractName(spot.name, uiLanguage) || ''
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

  // 既存画像が更新されたら（アップロード/削除成功後）、ローカルの状態をリセット
  useEffect(() => {
    setNewImages([]);
    setDeletedImageIds([]);
  }, [existingImages]);

  // 削除されていない既存画像
  const displayedExistingImages = existingImages.filter(
    (img) => !deletedImageIds.includes(img.id)
  );

  // 新しい画像を追加できる残り枚数
  const maxNewImages = Math.max(0, INPUT_LIMITS.MAX_IMAGES_PER_SPOT - displayedExistingImages.length);

  const handleDeleteExistingImage = (imageId: string) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
  };

  // 変更検出とバリデーション（descriptionはZustandストアで管理）
  const { hasChanges, isFormValid } = useEditSpotFormChanges(spot, initialTags, {
    tags,
    newImages,
    deletedImageIds,
    selectedMapId: selectedMapId ?? null,
    spotColor,
    labelId: selectedLabelId,
    spotName,
    isPublic,
  });

  // 変更検知を親に通知（FABの非活性状態制御用）
  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid || !hasChanges;

  const handleSubmit = () => {
    onSubmit({
      // descriptionは別ページで編集・保存するため除外
      tags,
      newImages: newImages.length > 0 ? newImages : undefined,
      deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
      mapId: selectedMapId || undefined,
      spotColor,
      labelId: selectedLabelId,
      // 現在地/ピン刺し登録の場合のみスポット名を渡す
      spotName: isManualRegistration ? spotName.trim() : undefined,
      isPublic,
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
        <View className="mb-6 bg-surface rounded-lg p-4 border-thin border-outline">
          <View className="mb-3">
            <Text className="text-sm font-semibold text-on-surface-variant">
              {t('spot.spotInfo')}
            </Text>
          </View>

          {/* Google検索経由のスポット名（読み取り専用） */}
          {!isManualRegistration && spot.master_spot?.name && (() => {
            const displaySpotName = extractName(spot.master_spot.name, uiLanguage);
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
            const address = extractAddress(spot.master_spot?.google_short_address, uiLanguage)
              || extractAddress(spot.google_short_address, uiLanguage);
            if (!address) return null;
            return (
              <View className="flex-row items-center">
                <AddressPinIcon size={16} color={colors.light['on-surface-variant']} />
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

        {/* このスポットを一言で（必須） - 別ページで編集 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-base font-semibold text-on-surface">
              {t('spot.oneWordRequired')}
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/edit-spot-description/${spot.id}`)}
            className="bg-surface border-thin border-outline rounded-lg px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="chatbubble-outline" size={iconSizeNum.md} className="text-primary" />
              <Text
                className={`ml-3 text-base flex-1 ${description ? 'text-on-surface' : 'text-on-surface-variant'}`}
                numberOfLines={1}
              >
                {description || t('spot.oneWordPlaceholder')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-gray-400" />
          </TouchableOpacity>
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
          {maxNewImages > 0 && (
            <View>
              {newImages.length > 0 && (
                <Text className="text-xs text-on-surface-variant mb-2">{t('spot.newPhotos')}</Text>
              )}
              <ImagePickerButton
                images={newImages}
                onImagesChange={setNewImages}
                maxImages={maxNewImages}
                hideCount
              />
            </View>
          )}

          <Text className="text-xs text-on-surface-variant mt-2">
            {t('spot.totalPhotos', { current: displayedExistingImages.length + newImages.length, max: INPUT_LIMITS.MAX_IMAGES_PER_SPOT })}
          </Text>
        </View>

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

        {/* ラベル */}
        {selectedMapId && (
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
        )}

        {/* スポットの色 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">
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
