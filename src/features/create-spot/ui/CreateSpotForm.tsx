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
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { StyledTextInput, TagInput } from '@/shared/ui';
import {
  type SpotLocationInput,
  isPlaceSearchResult,
} from '@/features/search-places';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { MapWithUser } from '@/shared/types';

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
    tags: string[];
    images: SelectedImage[];
    mapId: string;
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
  // Google検索結果か手動登録かを判定
  const isGooglePlace = isPlaceSearchResult(placeData);

  // カスタム名の初期値（Google検索結果の場合は元の名前、手動の場合は空）
  const [customName, setCustomName] = useState(placeData.name ?? '');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<SelectedImage[]>([]);

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  const handleSubmit = () => {
    if (!customName.trim()) {
      Alert.alert('エラー', 'スポット名を入力してください');
      return;
    }

    if (!selectedMapId) {
      Alert.alert('エラー', 'マップを選択してください');
      return;
    }

    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      tags,
      images,
      mapId: selectedMapId,
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
    <ScrollView
      className="flex-1 bg-background-secondary dark:bg-dark-background-secondary"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
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
            <Ionicons
              name={isGooglePlace ? 'information-circle' : 'location'}
              size={20}
              color={colors.primary.DEFAULT}
            />
            <Text className="ml-2 text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
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
          {placeData.address && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">住所</Text>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{placeData.address}</Text>
            </View>
          )}

          {/* 座標 */}
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color={colors.gray[500]} />
            <Text className="ml-1 text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
              {placeData.latitude.toFixed(6)}, {placeData.longitude.toFixed(6)}
            </Text>
          </View>
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

        {/* カスタム名（編集可能） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            スポット名 <Text className="text-red-500">*</Text>
          </Text>
          <StyledTextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="例：お気に入りのカフェ"
            maxLength={INPUT_LIMITS.SPOT_NAME}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
              自分だけのわかりやすい名前をつけられます
            </Text>
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {customName.length}/{INPUT_LIMITS.SPOT_NAME}
            </Text>
          </View>
        </View>

        {/* メモ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">メモ</Text>
          <StyledTextInput
            value={description}
            onChangeText={setDescription}
            placeholder="このスポットについてのメモを入力してください"
            multiline
            numberOfLines={4}
            maxLength={INPUT_LIMITS.SPOT_DESCRIPTION}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1 text-right">
            {description.length}/{INPUT_LIMITS.SPOT_DESCRIPTION}
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
          disabled={isLoading}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '登録中...' : 'スポットを登録'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-8" />
    </ScrollView>
  );
}
