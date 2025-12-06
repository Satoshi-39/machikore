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
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { StyledTextInput } from '@/shared/ui';
import { ImagePickerButton, type SelectedImage } from '@/features/pick-images';
import type { UserSpotWithMasterSpot } from '@/shared/api/supabase/user-spots';
import type { Database } from '@/shared/types/supabase.generated';
import type { MapWithUser } from '@/shared/types';

type ImageRow = Database['public']['Tables']['images']['Row'];

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'updating' | 'uploading' | 'deleting' | 'done';
}

interface EditSpotFormProps {
  spot: UserSpotWithMasterSpot;
  existingImages?: ImageRow[];
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
  onSubmit,
  isLoading = false,
  uploadProgress,
  userMaps = [],
  selectedMapId,
  isMapsLoading = false,
}: EditSpotFormProps) {
  const spotName = spot.custom_name || spot.master_spot?.name || '';

  // 選択中のマップを取得
  const selectedMap = userMaps.find(m => m.id === selectedMapId);

  const [customName, setCustomName] = useState(spotName);
  const [description, setDescription] = useState(spot.description || '');
  const [tags, setTags] = useState((spot.tags || []).join(', '));

  // 画像関連
  const [newImages, setNewImages] = useState<SelectedImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // 削除されていない既存画像
  const displayedExistingImages = existingImages.filter(
    (img) => !deletedImageIds.includes(img.id)
  );

  // 新しい画像を追加できる残り枚数
  const maxNewImages = Math.max(0, 4 - displayedExistingImages.length);

  const handleDeleteExistingImage = (imageId: string) => {
    setDeletedImageIds([...deletedImageIds, imageId]);
  };

  const handleSubmit = () => {
    onSubmit({
      customName: customName.trim(),
      description: description.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
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
          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={20} color={colors.primary.DEFAULT} />
            <Text className="ml-2 text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
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
          {spot.master_spot?.google_formatted_address && (
            <View className="mb-3">
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mb-1">住所</Text>
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {spot.master_spot.google_formatted_address}
              </Text>
            </View>
          )}

          {/* 座標 */}
          {spot.master_spot && (
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color={colors.gray[500]} />
              <Text className="ml-1 text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {spot.master_spot.latitude.toFixed(6)}, {spot.master_spot.longitude.toFixed(6)}
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

        {/* カスタム名（編集可能） */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">
            スポット名
          </Text>
          <StyledTextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="例：お気に入りのカフェ"
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            自分だけのわかりやすい名前をつけられます
          </Text>
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
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
        </View>

        {/* タグ */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-2">タグ</Text>
          <StyledTextInput
            value={tags}
            onChangeText={setTags}
            placeholder="例：カフェ, 作業, Wi-Fi"
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-4 py-3 text-base"
          />
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
            カンマ区切りで入力してください
          </Text>
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
              />
            </View>
          )}

          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            合計 {displayedExistingImages.length + newImages.length}/4枚
          </Text>
        </View>

        {/* 更新ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-lg items-center mb-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? '更新中...' : '変更を保存'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 下部余白 */}
      <View className="h-8" />
    </ScrollView>
  );
}
