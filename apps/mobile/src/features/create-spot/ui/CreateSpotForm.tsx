/**
 * スポット作成フォーム Feature
 *
 * FSDの原則：Featureはユーザーのアクション・インタラクション
 * Google Places検索結果 または 手動登録（現在地/ピン刺し）の両方に対応
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import { Input, TagInput, AddressPinIcon, SpotColorPicker, LabelPicker, Button, Text as ButtonText, buttonTextVariants, Progress, PublicToggle } from '@/shared/ui';
import { isEmptyArticle } from '@/shared/lib';
import { isPlaceSearchResult, useSelectedPlaceStore } from '@/features/search-places';
import { useRouter } from 'expo-router';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import { useCreateSpotFormValidation } from '../model';
import type { CreateSpotFormProps } from '../model/types';
import { useMapLabels } from '@/entities/map-label';
import { useI18n } from '@/shared/lib/i18n';

export function CreateSpotForm({
  placeData,
  onSubmit,
  isLoading = false,
  uploadProgress,
  userMaps = [],
  isMapsLoading = false,
  selectedMapId,
}: CreateSpotFormProps) {
  const { t } = useI18n();
  const router = useRouter();

  // Google検索結果か手動登録かを判定
  const isGooglePlace = isPlaceSearchResult(placeData);

  // 「このスポットを一言で」は常に空から開始
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [spotColor, setSpotColor] = useState<SpotColor>(DEFAULT_SPOT_COLOR);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  // スポットの公開/非公開（デフォルト: 非公開 - 記事がないと公開不可）
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // 現在地/ピン刺し登録用のスポット名（Google Places以外の場合のみ使用）
  const [spotName, setSpotName] = useState('');

  // 記事コンテンツはストアから取得
  const draftArticleContent = useSelectedPlaceStore((state) => state.draftArticleContent);

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  // マップが非公開かどうか
  const isMapPrivate = selectedMap ? !selectedMap.is_public : true;

  // 公開トグルの変更ハンドラ（マップも公開される旨を通知）
  const handlePublicToggleChange = (value: boolean) => {
    // 非公開→公開に変更 && マップが非公開の場合、通知を表示
    if (value && !isPublic && isMapPrivate) {
      Alert.alert(t('spot.publishNoticeTitle'));
    }
    setIsPublic(value);
  };

  // マップのラベル一覧を取得
  const { data: mapLabels = [], isLoading: isLabelsLoading } = useMapLabels(selectedMapId);

  // バリデーション
  const { isFormValid } = useCreateSpotFormValidation({
    description,
    selectedMapId: selectedMapId ?? null,
  });

  // ボタンを無効化する条件
  // 現在地/ピン刺し登録の場合はスポット名も必須
  const isSpotNameValid = isGooglePlace || spotName.trim().length > 0;
  const isButtonDisabled = isLoading || !isFormValid || !isSpotNameValid;

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('spot.oneWordRequired'));
      return;
    }

    if (!selectedMapId) {
      Alert.alert(t('common.error'), t('map.targetMap'));
      return;
    }

    // 現在地/ピン刺し登録の場合はスポット名必須
    if (!isGooglePlace && !spotName.trim()) {
      Alert.alert(t('common.error'), t('spot.spotNameRequired'));
      return;
    }

    onSubmit({
      description: description.trim(),
      articleContent: draftArticleContent,
      tags,
      images,
      mapId: selectedMapId,
      spotColor,
      labelId: selectedLabelId,
      // 現在地/ピン刺し登録の場合のみスポット名を渡す
      spotName: isGooglePlace ? undefined : spotName.trim(),
      isPublic,
    });
  };

  // ローディング表示のテキストを決定
  const getLoadingText = () => {
    if (!uploadProgress || uploadProgress.status === 'idle') {
      return t('spot.creatingSpot');
    }
    if (uploadProgress.status === 'uploading') {
      return t('spot.uploadingImages', { current: uploadProgress.current, total: uploadProgress.total });
    }
    return t('spot.processingComplete');
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-surface-variant"
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
            {uploadProgress && uploadProgress.status === 'uploading' && (
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
          <Text className="text-base font-semibold text-on-surface mb-2">
            {t('map.targetMap')}
          </Text>
          <View className="bg-secondary border border-outline rounded-lg px-4 py-3 flex-row items-center">
            {isMapsLoading ? (
              <ActivityIndicator size="small" className="text-primary" />
            ) : selectedMap ? (
              <View className="flex-row items-center flex-1">
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                  <Ionicons name="map" size={12} color={colors.light['on-primary']} />
                </View>
                <Text className="text-base text-on-surface">{selectedMap.name}</Text>
              </View>
            ) : (
              <Text className="text-base text-on-surface-variant">{t('map.noMapSelected')}</Text>
            )}
          </View>
        </View>

        {/* 位置情報（読み取り専用） */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-outline">
          <View className="flex-row items-center mb-3">
            {isGooglePlace && (
              <Ionicons
                name="information-circle"
                size={20}
                className="text-primary"
              />
            )}
            <Text className={`text-sm font-semibold text-on-surface-variant ${isGooglePlace ? 'ml-2' : ''}`}>
              {isGooglePlace
                ? t('spot.googlePlacesInfo')
                : !isGooglePlace && 'source' in placeData && placeData.source === 'current_location'
                ? t('spot.currentLocationInfo')
                : t('spot.mapPinInfo')}
            </Text>
          </View>

          {/* Google検索の場合: 元の名前を表示 */}
          {isGooglePlace && placeData.name && (
            <View className="mb-3">
              <Text className="text-xs text-on-surface-variant mb-1">{t('spot.originalSpotName')}</Text>
              <Text className="text-base text-on-surface font-medium">{placeData.name}</Text>
            </View>
          )}

          {/* 住所 */}
          {placeData.shortAddress && (
            <View className="flex-row items-center">
              <AddressPinIcon size={16} color={colors.light['on-surface-variant']} />
              <Text className="ml-1 text-sm text-on-surface-variant flex-1">{placeData.shortAddress}</Text>
            </View>
          )}
        </View>

        {/* スポット名（現在地/ピン刺し登録の場合のみ） */}
        {!isGooglePlace && (
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
            <Ionicons name="pencil" size={14} className="text-gray-400" style={{ marginLeft: 6 }} />
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={t('spot.oneWordPlaceholder')}
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
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
          <ImagePickerButton
            images={images}
            onImagesChange={setImages}
            maxImages={INPUT_LIMITS.MAX_IMAGES_PER_SPOT}
          />
        </View>

        {/* 記事 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-on-surface mb-2">{t('spot.article')}</Text>
          <TouchableOpacity
            onPress={() => router.push('/create-spot-article')}
            className="bg-surface border border-outline rounded-lg px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="document-text-outline"
                size={20}
                className="text-gray-400"
              />
              <Text
                className={`ml-3 text-base ${
                  isEmptyArticle(draftArticleContent)
                    ? 'text-on-surface-variant'
                    : 'text-on-surface'
                }`}
                numberOfLines={1}
              >
                {isEmptyArticle(draftArticleContent)
                  ? t('spot.articleEmpty')
                  : t('spot.articleEntered')}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              className="text-gray-400"
            />
          </TouchableOpacity>
          <Text className="text-xs text-on-surface-variant mt-1">
            {t('spot.articleHint')}
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
          <View className="bg-surface border border-outline rounded-lg p-4">
            <PublicToggle
              value={isPublic}
              onValueChange={handlePublicToggleChange}
              description={t('spot.visibilityDescription')}
              disabled={isEmptyArticle(draftArticleContent)}
            />
            {isEmptyArticle(draftArticleContent) && (
              <Text className="text-xs text-warning mt-2">
                {t('spot.articleRequiredToPublish')}
              </Text>
            )}
          </View>
        </View>

        {/* 登録ボタン */}
        <View className="mb-4">
          <Button onPress={handleSubmit} disabled={isButtonDisabled}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('spot.registerSpotButton')}
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
