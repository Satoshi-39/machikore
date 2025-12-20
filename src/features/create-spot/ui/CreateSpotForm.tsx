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
import { StyledTextInput, TagInput, AddressPinIcon, SpotColorPicker, LabelPicker } from '@/shared/ui';
import {
  type SpotLocationInput,
  isPlaceSearchResult,
  useSelectedPlaceStore,
} from '@/features/search-places';
import { useRouter } from 'expo-router';
import type { ProseMirrorDoc } from '@/shared/types';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { MapWithUser } from '@/shared/types';
import { useCreateSpotFormValidation } from '../model';
import { useMapLabels } from '@/entities/map-label';

// 記事コンテンツが空かどうかを判定
function isEmptyArticle(doc: ProseMirrorDoc | null): boolean {
  if (!doc) return true;
  if (!doc.content || doc.content.length === 0) return true;
  if (doc.content.length === 1) {
    const firstNode = doc.content[0];
    if (!firstNode) return true;
    if (
      firstNode.type === 'paragraph' &&
      (!firstNode.content || firstNode.content.length === 0)
    ) {
      return true;
    }
  }
  return false;
}

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'creating' | 'uploading' | 'done';
}

interface CreateSpotFormProps {
  placeData: SpotLocationInput; // Google Places検索結果 または 手動登録
  onSubmit: (data: {
    customName: string;
    description?: string;
    articleContent?: ProseMirrorDoc | null;
    tags: string[];
    images: SelectedImage[];
    mapId: string;
    spotColor: SpotColor;
    labelId?: string | null;
  }) => void;
  isLoading?: boolean;
  uploadProgress?: UploadProgress;
  /** ユーザーのマップ一覧 */
  userMaps?: MapWithUser[];
  /** マップ読み込み中 */
  isMapsLoading?: boolean;
  /** 選択されたマップID */
  selectedMapId?: string | null;
}

export function CreateSpotForm({
  placeData,
  onSubmit,
  isLoading = false,
  uploadProgress,
  userMaps = [],
  isMapsLoading = false,
  selectedMapId,
}: CreateSpotFormProps) {
  const router = useRouter();

  // Google検索結果か手動登録かを判定
  const isGooglePlace = isPlaceSearchResult(placeData);

  // 「このスポットを一言で」は常に空から開始
  const [customName, setCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [spotColor, setSpotColor] = useState<SpotColor>(DEFAULT_SPOT_COLOR);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  // 記事コンテンツはストアから取得
  const draftArticleContent = useSelectedPlaceStore((state) => state.draftArticleContent);

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  // マップのラベル一覧を取得
  const { data: mapLabels = [], isLoading: isLabelsLoading } = useMapLabels(selectedMapId);

  // バリデーション
  const { isFormValid } = useCreateSpotFormValidation({
    customName,
    description,
    selectedMapId: selectedMapId ?? null,
  });

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid;

  const handleSubmit = () => {
    if (!customName.trim()) {
      Alert.alert('エラー', '「このスポットを一言で」を入力してください');
      return;
    }

    if (!selectedMapId) {
      Alert.alert('エラー', 'マップを選択してください');
      return;
    }

    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      articleContent: draftArticleContent,
      tags,
      images,
      mapId: selectedMapId,
      spotColor,
      labelId: selectedLabelId,
    });
  };

  // ローディング表示のテキストを決定
  const getLoadingText = () => {
    if (!uploadProgress || uploadProgress.status === 'idle') {
      return 'スポットを作成中...';
    }
    if (uploadProgress.status === 'uploading') {
      return `画像をアップロード中... (${uploadProgress.current}/${uploadProgress.total})`;
    }
    return '完了処理中...';
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
            {uploadProgress && uploadProgress.status === 'uploading' && (
              <View className="w-48 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View className="p-4">
        {/* 位置情報（読み取り専用） */}
        <View className="mb-6 bg-surface dark:bg-dark-surface rounded-lg p-4 border border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            {isGooglePlace && (
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.primary.DEFAULT}
              />
            )}
            <Text className={`text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary ${isGooglePlace ? 'ml-2' : ''}`}>
              {isGooglePlace
                ? 'Google Placesから取得した情報'
                : !isGooglePlace && 'source' in placeData && placeData.source === 'current_location'
                ? '現在地から登録'
                : '地図上で選択した位置'}
            </Text>
          </View>

          {/* Google検索の場合: 元の名前を表示 */}
          {isGooglePlace && placeData.name && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">スポット名（元）</Text>
              <Text className="text-base text-foreground dark:text-dark-foreground font-medium">{placeData.name}</Text>
            </View>
          )}

          {/* 住所 */}
          {placeData.shortAddress && (
            <View className="flex-row items-center">
              <AddressPinIcon size={16} color={colors.gray[500]} />
              <Text className="ml-1 text-sm text-foreground-secondary dark:text-dark-foreground-secondary flex-1">{placeData.shortAddress}</Text>
            </View>
          )}
        </View>

        {/* マップ（表示のみ） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            追加するマップ
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
              <Text className="text-base text-foreground-muted dark:text-dark-foreground-muted">マップが選択されていません</Text>
            )}
          </View>
        </View>

        {/* このスポットを一言で！（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            このスポットを一言で！ <Text className="text-red-500">*</Text>
          </Text>
          <StyledTextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="例：最高のラーメン屋"
            maxLength={INPUT_LIMITS.SPOT_ONE_WORD}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {customName.length}/{INPUT_LIMITS.SPOT_ONE_WORD}
            </Text>
          </View>
        </View>

        {/* スポットの概要（任意） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            スポットの概要
          </Text>
          <StyledTextInput
            value={description}
            onChangeText={setDescription}
            placeholder="このスポットの魅力を簡潔に"
            multiline
            numberOfLines={2}
            maxLength={INPUT_LIMITS.SPOT_SUMMARY}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {description.length}/{INPUT_LIMITS.SPOT_SUMMARY}
            </Text>
          </View>
        </View>

        {/* 記事 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">記事</Text>
          <TouchableOpacity
            onPress={() => router.push('/create-spot-article')}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.gray[400]}
              />
              <Text
                className={`ml-3 text-base ${
                  isEmptyArticle(draftArticleContent)
                    ? 'text-foreground-muted dark:text-dark-foreground-muted'
                    : 'text-foreground dark:text-dark-foreground'
                }`}
                numberOfLines={1}
              >
                {isEmptyArticle(draftArticleContent)
                  ? 'スポットについて詳しく書いてみましょう'
                  : '記事が入力されています'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            ここに入力した内容が記事ページで表示されます
          </Text>
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">タグ</Text>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="タグを入力してEnter"
            maxTags={10}
          />
        </View>

        {/* ラベル */}
        {selectedMapId && (
          <View className="mb-6" style={{ zIndex: 3000 }}>
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
              ラベル
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
            スポットの色
          </Text>
          <View style={{ opacity: selectedLabelId ? 0.5 : 1 }} pointerEvents={selectedLabelId ? 'none' : 'auto'}>
            <SpotColorPicker
              selectedColor={spotColor}
              onColorChange={setSpotColor}
            />
          </View>
          {selectedLabelId && (
            <Text className="text-xs text-red-500 mt-2">
              ※ラベルが設定されている場合、ラベルの色が優先されます
            </Text>
          )}
        </View>

        {/* 写真 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">写真</Text>
          <ImagePickerButton
            images={images}
            onImagesChange={setImages}
            maxImages={INPUT_LIMITS.MAX_IMAGES_PER_SPOT}
          />
        </View>

        {/* 登録ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          className={`py-4 rounded-lg items-center mb-4 ${
            isButtonDisabled ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '登録中...' : 'スポットを登録'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
