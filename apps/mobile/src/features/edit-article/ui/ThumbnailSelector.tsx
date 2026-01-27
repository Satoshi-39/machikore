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
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { SpotImage } from './InsertMenu';

interface ThumbnailSelectorProps {
  /** モーダルの表示状態 */
  visible: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** サムネイル選択時のコールバック（画像IDを渡す、nullでサムネイルなし） */
  onSelectThumbnail: (imageId: string | null) => void;
  /** スポットID（新規アップロード時に使用） */
  spotId?: string;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 現在選択中のサムネイル画像ID */
  currentThumbnailId?: string | null;
  /** 新規画像アップロード完了時のコールバック（DBのimageIdを返す） */
  onImageUploaded?: (imageUrl: string, imageId: string) => Promise<string | null>;
  /** 画像削除時のコールバック */
  onDeleteImage?: (imageId: string) => void;
}

export function ThumbnailSelector({
  visible,
  onClose,
  onSelectThumbnail,
  spotId,
  spotImages = [],
  currentThumbnailId,
  onImageUploaded,
  onDeleteImage,
}: ThumbnailSelectorProps) {
  const isDarkMode = useIsDarkMode();
  const [isUploading, setIsUploading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント: 60%
  const snapPoints = useMemo(() => ['60%'], []);

  // 残り追加可能な画像数
  const remainingSlots = INPUT_LIMITS.MAX_IMAGES_PER_SPOT - spotImages.length;
  const canUploadNew = remainingSlots > 0;

  // 現在のサムネイル画像を取得
  // currentThumbnailIdが設定されていればその画像、なければnull（自動選択しない）
  const currentThumbnailImage = useMemo(() => {
    if (spotImages.length === 0) return null;
    if (currentThumbnailId) {
      return spotImages.find((img) => img.id === currentThumbnailId) || null;
    }
    return null;
  }, [spotImages, currentThumbnailId]);

  // サムネイルを解除（モーダルは閉じない）
  const handleClearThumbnail = useCallback(() => {
    onSelectThumbnail(null);
  }, [onSelectThumbnail]);

  // 既存画像を選択（モーダルは閉じない）
  const handleSelectExistingImage = useCallback((image: SpotImage) => {
    onSelectThumbnail(image.id);
  }, [onSelectThumbnail]);

  // 画像を削除（確認ダイアログ付き）
  const handleDeleteImage = useCallback((image: SpotImage) => {
    const isCurrentThumbnail = currentThumbnailImage?.id === image.id;

    Alert.alert(
      '画像を削除',
      isCurrentThumbnail
        ? 'この画像は現在サムネイルに設定されています。削除するとサムネイルも解除されます。'
        : 'この画像を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            // サムネイルの場合は解除
            if (isCurrentThumbnail) {
              onSelectThumbnail(null);
            }
            onDeleteImage?.(image.id);
          },
        },
      ]
    );
  }, [currentThumbnailImage, onSelectThumbnail, onDeleteImage]);

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

      // アップロードした画像をサムネイルとして選択（モーダルは閉じない）
      if (dbImageId) {
        onSelectThumbnail(dbImageId);
      }

      log.info('[ThumbnailSelector] サムネイル画像アップロード成功:', uploadResult.data.url);
    } catch (error) {
      log.error('[ThumbnailSelector] 画像アップロードエラー:', error);
      showImageProcessErrorAlert();
    } finally {
      setIsUploading(false);
    }
  }, [spotId, onImageUploaded, onSelectThumbnail]);

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

  // シート変更時のハンドラー（閉じた時）
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // 背景タップで閉じる
  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: colors.primitive.gray[400] }}
            backgroundStyle={{
              backgroundColor: isDarkMode ? colors.dark['surface-variant'] : colors.light['surface-variant'],
            }}
          >
            {/* ヘッダー */}
            <View className="flex-row items-center px-4 pb-3">
              <View className="w-8 h-8" />
              <Text className="flex-1 text-center text-lg font-semibold text-on-surface">
                サムネイル画像を選択
              </Text>
              <Pressable
                onPress={() => bottomSheetRef.current?.close()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                />
              </Pressable>
            </View>

            {/* アップロード中インジケーター */}
            {isUploading && (
              <View className="items-center justify-center py-4">
                <ActivityIndicator size="large" className="text-primary" />
                <Text className="mt-2 text-sm text-on-surface-variant">
                  アップロード中...
                </Text>
              </View>
            )}

            {!isUploading && (
              <BottomSheetScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
              >
                {/* 現在のサムネイルセクション（表示のみ） */}
                {currentThumbnailImage && (
                  <View className="mb-5">
                    <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                      現在のサムネイル
                    </Text>
                    <View className="items-center">
                      <View
                        className="rounded-xl overflow-hidden"
                        style={{
                          borderWidth: 3,
                          borderColor: colors.light.primary,
                        }}
                      >
                        <OptimizedImage
                          url={currentThumbnailImage.cloud_path}
                          width={200}
                          height={105}
                          borderRadius={8}
                          quality={80}
                        />
                      </View>
                      <View className="flex-row items-center mt-2">
                        <Ionicons name="checkmark-circle" size={16} className="text-primary" />
                        <Text className="ml-1 text-xs text-primary font-medium">
                          選択中
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* サムネイルがない場合の表示 */}
                {!currentThumbnailImage && spotImages.length > 0 && (
                  <View className="mb-5">
                    <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                      現在のサムネイル
                    </Text>
                    <View className="items-center py-4">
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                      />
                      <Text className="text-sm text-on-surface-variant mt-2">
                        サムネイルなし
                      </Text>
                      <Text className="text-xs text-on-surface-variant mt-1">
                        下の画像をタップして選択
                      </Text>
                    </View>
                  </View>
                )}

                {/* アップロードした画像セクション（横スクロール、削除ボタン付き） */}
                {spotImages.length > 0 && (
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                      アップロードした画像
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 12, paddingLeft: 4, paddingTop: 4 }}
                    >
                      {/* 「なし」の選択肢 */}
                      <View className="relative" style={{ marginTop: 4 }}>
                        <Pressable
                          onPress={handleClearThumbnail}
                          className="rounded-lg overflow-hidden active:opacity-70 items-center justify-center"
                          style={{
                            width: 72,
                            height: 72,
                            borderWidth: !currentThumbnailImage ? 2 : 1,
                            borderColor: !currentThumbnailImage ? colors.light.primary : (isDarkMode ? colors.primitive.gray[600] : colors.primitive.gray[300]),
                            backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.secondary,
                          }}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color={isDarkMode ? colors.primitive.gray[400] : colors.primitive.gray[500]}
                          />
                          <Text className="text-xs text-on-surface-variant mt-1">なし</Text>
                        </Pressable>
                        {/* 選択中マーク */}
                        {!currentThumbnailImage && (
                          <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                            <Ionicons name="checkmark" size={10} color="white" />
                          </View>
                        )}
                      </View>
                      {spotImages.map((image) => {
                        const isCurrentThumbnail = currentThumbnailImage?.id === image.id;
                        return (
                          <View key={image.id} className="relative" style={{ marginTop: 4 }}>
                            <Pressable
                              onPress={() => handleSelectExistingImage(image)}
                              className="rounded-lg overflow-hidden active:opacity-70"
                              style={{
                                borderWidth: isCurrentThumbnail ? 2 : 0,
                                borderColor: colors.light.primary,
                              }}
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
                            {/* 選択中マーク */}
                            {isCurrentThumbnail && (
                              <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                                <Ionicons name="checkmark" size={10} color="white" />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {/* 画像がない場合 */}
                {spotImages.length === 0 && (
                  <View className="mb-4 py-6 items-center">
                    <Ionicons
                      name="images-outline"
                      size={48}
                      color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                    />
                    <Text className="mt-2 text-sm text-on-surface-variant">
                      画像がありません
                    </Text>
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
              </BottomSheetScrollView>
            )}
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
