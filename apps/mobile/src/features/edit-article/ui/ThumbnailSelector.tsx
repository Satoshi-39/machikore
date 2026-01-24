/**
 * サムネイル選択モーダル
 *
 * スポットのサムネイル画像を選択するためのボトムシート
 * - 既存の画像から選択
 * - 写真ライブラリから新規アップロード
 */

import { colors, INPUT_LIMITS } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useIsDarkMode } from '@/shared/lib/providers';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import {
  convertToJpeg,
  requestImagePermission,
  showImagePickerMenu,
  showImageLimitAlert,
  showImageUploadErrorAlert,
  showImageProcessErrorAlert,
  showSpotNotFoundAlert,
} from '@/shared/lib/image';
import { OptimizedImage } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { SpotImage } from './InsertMenu';

interface ThumbnailSelectorProps {
  /** モーダルの表示状態 */
  visible: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** サムネイル選択時のコールバック（画像IDを渡す、nullで自動選択に戻す） */
  onSelectThumbnail: (imageId: string | null) => void;
  /** スポットID（新規アップロード時に使用） */
  spotId?: string;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 現在選択中のサムネイル画像ID */
  currentThumbnailId?: string | null;
  /** 新規画像アップロード完了時のコールバック（DBのimageIdを返す） */
  onImageUploaded?: (imageUrl: string, imageId: string) => Promise<string | null>;
}

export function ThumbnailSelector({
  visible,
  onClose,
  onSelectThumbnail,
  spotId,
  spotImages = [],
  currentThumbnailId,
  onImageUploaded,
}: ThumbnailSelectorProps) {
  const isDarkMode = useIsDarkMode();
  const [isUploading, setIsUploading] = useState(false);

  // 残り追加可能な画像数
  const remainingSlots = INPUT_LIMITS.MAX_IMAGES_PER_SPOT - spotImages.length;
  const canUploadNew = remainingSlots > 0;

  // 既存画像を選択
  const handleSelectExistingImage = useCallback((image: SpotImage) => {
    onSelectThumbnail(image.id);
    onClose();
  }, [onSelectThumbnail, onClose]);

  // 自動選択に戻す
  const handleResetToAuto = useCallback(() => {
    onSelectThumbnail(null);
    onClose();
  }, [onSelectThumbnail, onClose]);

  // 新規画像をアップロード
  const pickAndUploadImage = useCallback(async (useCamera: boolean) => {
    if (!spotId) {
      showSpotNotFoundAlert();
      return;
    }

    const hasPermission = await requestImagePermission(useCamera ? 'camera' : 'library');
    if (!hasPermission) return;

    setIsUploading(true);
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
        exif: false,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      if (!asset) return;

      // 画像を変換
      const converted = await convertToJpeg(asset.uri);

      // Supabaseにアップロード
      const imageId = uuidv4();
      const fileName = `${imageId}.jpg`;
      const path = `${spotId}/${fileName}`;

      const uploadResult = await uploadImage({
        uri: converted.uri,
        bucket: STORAGE_BUCKETS.SPOT_IMAGES,
        path,
      });

      if (!uploadResult.success) {
        log.error('[ThumbnailSelector] アップロード失敗:', uploadResult.error);
        showImageUploadErrorAlert();
        return;
      }

      // imagesテーブルへの追加を通知し、DBで生成されたIDを取得
      const dbImageId = await onImageUploaded?.(uploadResult.data.url, imageId);

      // アップロードした画像をサムネイルとして選択
      if (dbImageId) {
        onSelectThumbnail(dbImageId);
      }
      onClose();

      log.info('[ThumbnailSelector] サムネイル画像アップロード成功:', uploadResult.data.url);
    } catch (error) {
      log.error('[ThumbnailSelector] 画像アップロードエラー:', error);
      showImageProcessErrorAlert();
    } finally {
      setIsUploading(false);
    }
  }, [spotId, onImageUploaded, onClose]);

  // 新規アップロードメニュー表示
  const handleNewUpload = useCallback(() => {
    if (!canUploadNew) {
      showImageLimitAlert(INPUT_LIMITS.MAX_IMAGES_PER_SPOT);
      return;
    }

    showImagePickerMenu(
      () => pickAndUploadImage(true),
      () => pickAndUploadImage(false)
    );
  }, [canUploadNew, pickAndUploadImage]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-2xl px-4 pb-8 pt-4"
          style={{
            backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
            maxHeight: '70%',
          }}
        >
          {/* ハンドル */}
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-300 dark:bg-gray-600" />

          {/* タイトル */}
          <Text className="mb-4 text-center text-lg font-semibold text-foreground dark:text-dark-foreground">
            サムネイル画像を選択
          </Text>

          {/* アップロード中インジケーター */}
          {isUploading && (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
              <Text className="mt-2 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                アップロード中...
              </Text>
            </View>
          )}

          {!isUploading && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 自動選択オプション */}
              <View className="mb-4">
                <Pressable
                  onPress={handleResetToAuto}
                  className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${
                    currentThumbnailId === null
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : 'active:bg-muted dark:active:bg-dark-muted'
                  }`}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: currentThumbnailId === null
                        ? colors.primary.DEFAULT
                        : isDarkMode ? colors.dark.muted : colors.light.muted,
                    }}
                  >
                    <Ionicons
                      name="sparkles"
                      size={20}
                      color={currentThumbnailId === null ? 'white' : (isDarkMode ? colors.dark.foreground : colors.light.foreground)}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
                      自動選択
                    </Text>
                    <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                      記事に挿入されていない最初の画像を使用
                    </Text>
                  </View>
                  {currentThumbnailId === null && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} />
                  )}
                </Pressable>
              </View>

              {/* 既存画像セクション */}
              {spotImages.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
                    画像を選択
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {spotImages.map((image) => {
                      const isSelected = currentThumbnailId === image.id;
                      return (
                        <Pressable
                          key={image.id}
                          onPress={() => handleSelectExistingImage(image)}
                          className="relative rounded-lg overflow-hidden active:opacity-70"
                          style={{
                            borderWidth: isSelected ? 3 : 0,
                            borderColor: colors.primary.DEFAULT,
                          }}
                        >
                          <OptimizedImage
                            url={image.cloud_path}
                            width={100}
                            height={100}
                            borderRadius={8}
                            quality={75}
                          />
                          {isSelected && (
                            <View className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                              <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 新規アップロードボタン */}
              <View className="mb-2">
                <Text className="mb-2 text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
                  新しい画像を追加 {canUploadNew ? `(残り${remainingSlots}枚)` : '(上限に達しました)'}
                </Text>
                <Pressable
                  onPress={handleNewUpload}
                  disabled={!canUploadNew}
                  className={`flex-row items-center gap-4 rounded-xl px-4 py-3 ${
                    canUploadNew
                      ? 'active:bg-muted dark:active:bg-dark-muted'
                      : 'opacity-50'
                  }`}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.dark.muted
                        : colors.light.muted,
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
                    />
                  </View>
                  <Text className="text-base text-foreground dark:text-dark-foreground">
                    写真ライブラリから選択
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          )}

          {/* キャンセルボタン */}
          <Pressable
            onPress={onClose}
            className="mt-4 items-center rounded-xl py-3 active:bg-muted dark:active:bg-dark-muted"
          >
            <Text className="text-base font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
              キャンセル
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
