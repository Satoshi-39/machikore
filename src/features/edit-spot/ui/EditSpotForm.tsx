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
import { colors, INPUT_LIMITS } from '@/shared/config';
import { StyledTextInput, TagInput, AddressPinIcon } from '@/shared/ui';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { UserSpotWithMasterSpot } from '@/shared/api/supabase/user-spots';
import type { Database } from '@/shared/types/supabase.generated';
import type { MapWithUser } from '@/shared/types';
import { useEditSpotFormChanges } from '../model';

type ImageRow = Database['public']['Tables']['images']['Row'];

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'updating' | 'uploading' | 'deleting' | 'done';
}

interface EditSpotFormProps {
  spot: UserSpotWithMasterSpot;
  existingImages?: ImageRow[];
  /** 中間テーブルから取得したタグ名の配列 */
  initialTags: string[];
  onSubmit: (data: {
    customName: string;
    description?: string;
    tags: string[];
    newImages?: SelectedImage[];
    deletedImageIds?: string[];
    mapId?: string;
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
  const router = useRouter();
  const spotName = spot.custom_name || spot.master_spot?.name || '';

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  const [customName, setCustomName] = useState(spotName);
  const [description, setDescription] = useState(spot.description || '');
  const articleContent = spot.article_content || '';
  const [tags, setTags] = useState<string[]>(initialTags);

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
    customName,
    description,
    tags,
    newImages,
    deletedImageIds,
    selectedMapId: selectedMapId ?? null,
  });

  // ボタンを無効化する条件
  const isButtonDisabled = isLoading || !isFormValid || !hasChanges;

  const handleSubmit = () => {
    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      tags,
      newImages: newImages.length > 0 ? newImages : undefined,
      deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
      mapId: selectedMapId || undefined,
    });
  };

  // ローディング表示のテキストを決定
  const getLoadingText = () => {
    if (!uploadProgress || uploadProgress.status === 'idle') {
      return 'スポットを更新中...';
    }
    if (uploadProgress.status === 'deleting') {
      return '画像を削除中...';
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
            {uploadProgress && uploadProgress.status === 'uploading' && uploadProgress.total > 0 && (
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
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
              スポット情報
            </Text>
          </View>

          {/* 元の名前 */}
          {spot.master_spot?.name && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">元の名前</Text>
              <Text className="text-base text-foreground dark:text-dark-foreground font-medium">
                {spot.master_spot.name}
              </Text>
            </View>
          )}

          {/* 住所 */}
          {(spot.master_spot?.google_short_address || spot.google_short_address) && (
            <View className="flex-row items-center">
              <AddressPinIcon size={16} color={colors.gray[500]} />
              <Text className="ml-1 text-sm text-foreground-secondary dark:text-dark-foreground-secondary flex-1">
                {spot.master_spot?.google_short_address || spot.google_short_address}
              </Text>
            </View>
          )}
        </View>

        {/* マップ（表示のみ） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            所属するマップ
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

        {/* スポットの概要（必須） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            スポットの概要 <Text className="text-red-500">*</Text>
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
            onPress={() => router.push(`/edit-spot-article/${spot.id}`)}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="document-text-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="ml-3 text-base text-foreground dark:text-dark-foreground">
                {articleContent ? '記事を編集' : '記事を書く'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            {articleContent ? '記事が書かれています' : 'このスポットについて詳しく書いてみましょう'}
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

          {/* 既存の画像 */}
          {displayedExistingImages.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-2">登録済みの写真</Text>
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
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-2">新しく追加する写真</Text>
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
            合計 {displayedExistingImages.length + newImages.length}/{INPUT_LIMITS.MAX_IMAGES_PER_SPOT}枚
          </Text>
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
            {isLoading ? '更新中...' : '変更を保存'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
