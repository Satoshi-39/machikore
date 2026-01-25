/**
 * 挿入メニュー
 *
 * エディタに画像やその他のコンテンツを挿入するためのメニュー
 * プラスボタンをタップすると表示される
 *
 * 画像挿入の選択肢:
 * 1. 既にアップロード済みの画像（スポットに紐づく画像）を選択
 * 2. 写真ライブラリから新規アップロード
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
  Alert,
} from 'react-native';

/** スポットに紐づく画像の型 */
export interface SpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
}

interface InsertMenuProps {
  /** メニューの表示状態 */
  visible: boolean;
  /** メニューを閉じる */
  onClose: () => void;
  /** 画像挿入（URLを渡す） */
  onInsertImage: (imageUrl: string) => void;
  /** スポットID（新規アップロード時にimagesテーブルに追加するため） */
  spotId?: string;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 新規画像アップロード完了時のコールバック（imagesテーブル更新用、DBのimageIdを返す） */
  onImageUploaded?: (imageUrl: string, imageId: string) => Promise<string | null>;
  /** 画像削除時のコールバック */
  onDeleteImage?: (imageId: string) => void;
}

export function InsertMenu({
  visible,
  onClose,
  onInsertImage,
  spotId,
  spotImages = [],
  onImageUploaded,
  onDeleteImage,
}: InsertMenuProps) {
  const isDarkMode = useIsDarkMode();
  const [isUploading, setIsUploading] = useState(false);

  // 残り追加可能な画像数
  const remainingSlots = INPUT_LIMITS.MAX_IMAGES_PER_SPOT - spotImages.length;
  const canUploadNew = remainingSlots > 0;

  // 既存画像を選択
  const handleSelectExistingImage = useCallback((image: SpotImage) => {
    if (image.cloud_path) {
      onInsertImage(image.cloud_path);
      onClose();
    }
  }, [onInsertImage, onClose]);

  // 画像を削除（確認ダイアログ付き）
  const handleDeleteImage = useCallback((image: SpotImage) => {
    Alert.alert(
      '画像を削除',
      'この画像を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            onDeleteImage?.(image.id);
          },
        },
      ]
    );
  }, [onDeleteImage]);

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
      const fileName = `${uuidv4()}.jpg`;
      const path = `${spotId}/${fileName}`;

      const uploadResult = await uploadImage({
        uri: converted.uri,
        bucket: STORAGE_BUCKETS.SPOT_IMAGES,
        path,
      });

      if (!uploadResult.success) {
        log.error('[InsertMenu] アップロード失敗:', uploadResult.error);
        showImageUploadErrorAlert();
        return;
      }

      // imagesテーブルへの追加を通知（uuidを渡す）
      await onImageUploaded?.(uploadResult.data.url, fileName.replace('.jpg', ''));

      // エディタに画像を挿入
      onInsertImage(uploadResult.data.url);
      onClose();

      log.info('[InsertMenu] 画像挿入成功:', uploadResult.data.url);
    } catch (error) {
      log.error('[InsertMenu] 画像挿入エラー:', error);
      showImageProcessErrorAlert();
    } finally {
      setIsUploading(false);
    }
  }, [spotId, onInsertImage, onImageUploaded, onClose]);

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
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-secondary" />

          {/* タイトル */}
          <Text className="mb-4 text-center text-lg font-semibold text-on-surface">
            画像を挿入
          </Text>

          {/* アップロード中インジケーター */}
          {isUploading && (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
              <Text className="mt-2 text-sm text-on-surface-variant">
                アップロード中...
              </Text>
            </View>
          )}

          {!isUploading && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 既存画像セクション */}
              {spotImages.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                    アップロード済みの画像
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingLeft: 4, paddingTop: 4 }}
                  >
                    {spotImages.map((image) => (
                      <View key={image.id} className="relative" style={{ marginTop: 4 }}>
                        <Pressable
                          onPress={() => handleSelectExistingImage(image)}
                          className="rounded-lg overflow-hidden active:opacity-70"
                        >
                          <OptimizedImage
                            url={image.cloud_path}
                            width={72}
                            height={72}
                            borderRadius={6}
                            quality={75}
                          />
                        </Pressable>
                        {/* 削除ボタン（onDeleteImageがある場合のみ表示） */}
                        {onDeleteImage && (
                          <Pressable
                            onPress={() => handleDeleteImage(image)}
                            className="absolute -top-1 -right-1 rounded-full items-center justify-center"
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            }}
                            hitSlop={4}
                          >
                            <Ionicons name="close" size={12} color="white" />
                          </Pressable>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* 新規アップロードボタン */}
              <View className="mb-2">
                <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                  新しい画像を追加 {canUploadNew ? `(残り${remainingSlots}枚)` : '(上限に達しました)'}
                </Text>
                <Pressable
                  onPress={handleNewUpload}
                  disabled={!canUploadNew}
                  className={`flex-row items-center gap-4 rounded-xl px-4 py-3 ${
                    canUploadNew
                      ? 'active:bg-secondary'
                      : 'opacity-50'
                  }`}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.dark.secondary
                        : colors.light.secondary,
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                    />
                  </View>
                  <Text className="text-base text-on-surface">
                    写真ライブラリから選択
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          )}

          {/* キャンセルボタン */}
          <Pressable
            onPress={onClose}
            className="mt-4 items-center rounded-xl py-3 active:bg-secondary"
          >
            <Text className="text-base font-medium text-on-surface-variant">
              キャンセル
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
