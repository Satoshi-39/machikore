/**
 * スポットサムネイル選択コンポーネント
 *
 * タップ可能なプレビュー/プレースホルダーを表示し、
 * タップするとボトムシートで画像一覧から選択 → CropModalでクロップ
 * マップのThumbnailPickerと同様のUXパターン
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, borderRadiusNum, iconSizeNum, spacingNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { CropModal } from '@/features/crop-image';
import type { CropResult, ThumbnailCrop } from '@/shared/lib/image';
import { CroppedThumbnail } from '@/shared/ui';
import { getOriginalImageUrl } from '@/shared/api/supabase/storage';
import { downloadAndGetSize } from '@/shared/lib/image';
import { log } from '@/shared/config/logger';

export interface SpotThumbnailImage {
  uri: string;
  width: number;
  height: number;
  id?: string;
  /** クロップ用の元画像URI（最適化前のフル解像度） */
  originalUri?: string;
}

/** クロップ完了時の結果 */
export interface SpotThumbnailCropResult {
  uri: string;
  width: number;
  height: number;
  sourceIndex: number;
  /** DB保存用クロップ座標 */
  cropRegion: ThumbnailCrop;
}

interface SpotThumbnailPickerProps {
  images: SpotThumbnailImage[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  /** クロップ完了時（クロップ済みURI/サイズを返す） */
  onCropComplete?: (result: SpotThumbnailCropResult) => void;
  /** クロップ済みサムネイルのURI（プレビュー表示用） */
  croppedThumbnailUri?: string | null;
  /** 既存のクロップ座標（DB保存済み、新しいクロップがない場合に使用） */
  existingCrop?: ThumbnailCrop | null;
}

export function SpotThumbnailPicker({
  images,
  selectedIndex,
  onSelect,
  onCropComplete,
  croppedThumbnailUri,
  existingCrop,
}: SpotThumbnailPickerProps) {
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // ボトムシートの表示状態
  const [sheetVisible, setSheetVisible] = useState(false);

  // プレビューコンテナの幅（CroppedThumbnail用）
  const [previewWidth, setPreviewWidth] = useState(0);

  // CropModal用の状態
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<{
    index: number;
    uri: string;
    width: number;
    height: number;
  } | null>(null);

  // スナップポイント
  const snapPoints = useMemo(() => ['55%'], []);

  // プレビューエリアタップ → ボトムシートを開く
  const handleOpenSheet = useCallback(() => {
    setSheetVisible(true);
  }, []);

  // ボトムシート閉じる
  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSheetVisible(false);
    }
  }, []);

  // CropModalを開く（ボトムシートを先に閉じてから）
  const openCropModal = useCallback((index: number, uri: string, width: number, height: number) => {
    // ボトムシートが開いていれば閉じる
    setSheetVisible(false);
    // 少し遅延させてModalが閉じてからCropModalを開く
    setTimeout(() => {
      setPendingCropImage({ index, uri, width, height });
      setCropModalVisible(true);
    }, 300);
  }, []);

  // 画像選択 → CropModalを開く
  const handleSelectImage = useCallback(async (index: number) => {
    const image = images[index];
    if (!image) return;

    if (!onCropComplete) {
      onSelect(index);
      handleCloseSheet();
      return;
    }

    // ローカルファイル（originalUriあり、HTTP以外）の場合は従来通り
    if (image.originalUri && !image.originalUri.startsWith('http')) {
      const cropUri = image.originalUri;
      if (image.width && image.height) {
        openCropModal(index, cropUri, image.width, image.height);
      } else {
        RNImage.getSize(
          cropUri,
          (width, height) => openCropModal(index, cropUri, width, height),
          () => {
            log.warn('[SpotThumbnailPicker] 画像サイズ取得失敗、クロップなしで選択');
            onSelect(index);
            handleCloseSheet();
          },
        );
      }
      return;
    }

    // DB読み込み画像（HTTP URL）: ダウンロードして実サイズを取得
    // Image.getSizeはキャッシュから旧サイズを返す場合があるため使用しない
    try {
      const targetUrl = getOriginalImageUrl(image.uri) ?? image.uri;

      try {
        // まず originals/ を試す
        const result = await downloadAndGetSize(targetUrl);
        openCropModal(index, result.uri, result.width, result.height);
      } catch {
        // originals/ が存在しない場合はメインURLにフォールバック
        log.debug('[SpotThumbnailPicker] originals/ 未発見、メインURLで再クロップ');
        const result = await downloadAndGetSize(image.uri);
        openCropModal(index, result.uri, result.width, result.height);
      }
    } catch (error) {
      log.error('[SpotThumbnailPicker] 画像ダウンロードエラー:', error);
      onSelect(index);
      handleCloseSheet();
    }
  }, [images, onSelect, onCropComplete, handleCloseSheet, openCropModal]);

  // CropModal完了時
  const handleCropComplete = useCallback((result: CropResult) => {
    if (!pendingCropImage || !onCropComplete) return;

    onSelect(pendingCropImage.index);
    onCropComplete({
      uri: result.uri,
      width: result.width,
      height: result.height,
      sourceIndex: pendingCropImage.index,
      cropRegion: {
        originX: result.cropRegion.originX,
        originY: result.cropRegion.originY,
        width: result.cropRegion.width,
        height: result.cropRegion.height,
        imageWidth: pendingCropImage.width,
        imageHeight: pendingCropImage.height,
      },
    });
    setCropModalVisible(false);
    setPendingCropImage(null);
  }, [pendingCropImage, onCropComplete, onSelect]);

  // CropModalキャンセル時
  const handleCropCancel = useCallback(() => {
    setCropModalVisible(false);
    setPendingCropImage(null);
  }, []);

  // 「なし」選択
  const handleClearThumbnail = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  // 選択中の画像を再クロップ
  const handleRecrop = useCallback(() => {
    if (selectedIndex === null) return;
    handleSelectImage(selectedIndex);
  }, [selectedIndex, handleSelectImage]);

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

  if (images.length === 0) return null;

  // プレビュー表示URI
  const previewUri = croppedThumbnailUri ?? (selectedIndex !== null ? images[selectedIndex]?.uri : null);
  const hasSelection = selectedIndex !== null && previewUri;

  // 現在選択中の画像（ボトムシート内プレビュー用）
  const currentSelectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <View>
      {/* プレビュー / プレースホルダー */}
      {hasSelection ? (
        <View
          className="relative rounded-xl overflow-hidden"
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0) setPreviewWidth(w);
          }}
        >
          {croppedThumbnailUri ? (
            /* 新しくクロップした画像：クロップ済みファイルをそのまま表示 */
            <Image
              source={{ uri: croppedThumbnailUri }}
              style={{ width: '100%', aspectRatio: 1.91, borderRadius: borderRadiusNum.md }}
              contentFit="cover"
              transition={200}
            />
          ) : existingCrop && previewWidth > 0 && selectedIndex !== null && images[selectedIndex] ? (
            /* DB保存済みクロップ：CroppedThumbnailで元画像をクロップ表示 */
            <CroppedThumbnail
              url={images[selectedIndex].originalUri ?? images[selectedIndex].uri}
              crop={existingCrop}
              width={previewWidth}
              borderRadius={borderRadiusNum.md}
            />
          ) : (
            /* クロップなし：通常表示 */
            <Image
              source={{ uri: previewUri }}
              style={{ width: '100%', aspectRatio: 1.91, borderRadius: borderRadiusNum.md }}
              contentFit="cover"
              transition={200}
            />
          )}
          <View className="absolute bottom-2 right-2 flex-row gap-2">
            {onCropComplete && (
              <Pressable
                onPress={handleRecrop}
                className="bg-black/50 rounded-full px-3 py-1 flex-row items-center active:opacity-70"
              >
                <Ionicons name="crop-outline" size={iconSizeNum.sm} color="white" />
                <Text className="text-white text-sm ml-1">{t('spot.thumbnailEdit')}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleOpenSheet}
              className="bg-black/50 rounded-full px-3 py-1 flex-row items-center active:opacity-70"
            >
              <Ionicons name="swap-horizontal-outline" size={iconSizeNum.sm} color="white" />
              <Text className="text-white text-sm ml-1">{t('common.change')}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={handleOpenSheet}
          className="w-full h-24 rounded-lg border-thin border-dashed border-outline items-center justify-center bg-surface-variant active:opacity-80"
        >
          <Ionicons
            name="image-outline"
            size={iconSizeNum['2xl']}
            className="text-gray-400"
          />
          <Text className="mt-1 text-sm text-on-surface-variant">
            {t('spot.thumbnailAdd')}
          </Text>
        </Pressable>
      )}

      {/* ボトムシートモーダル */}
      {sheetVisible && (
        <Modal
          visible={sheetVisible}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={handleCloseSheet}
        >
          <GestureHandlerRootView className="flex-1">
            <View className="flex-1">
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
                    {t('spot.thumbnailSelect')}
                  </Text>
                  <Pressable
                    onPress={() => bottomSheetRef.current?.close()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
                  >
                    <Ionicons
                      name="close"
                      size={iconSizeNum.md}
                      color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                    />
                  </Pressable>
                </View>

                <BottomSheetScrollView
                  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* 現在のサムネイルセクション */}
                  {currentSelectedImage && previewUri && (
                    <View className="mb-5">
                      <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                        {t('spot.thumbnailCurrent')}
                      </Text>
                      <View className="items-center">
                        <View
                          className="rounded-xl overflow-hidden"
                          style={{
                            borderWidth: 3,
                            borderColor: colors.light.primary,
                          }}
                        >
                          {croppedThumbnailUri ? (
                            <Image
                              source={{ uri: croppedThumbnailUri }}
                              style={{ width: 200, height: 105, borderRadius: borderRadiusNum.md }}
                              contentFit="cover"
                            />
                          ) : existingCrop && selectedIndex !== null && images[selectedIndex] ? (
                            <CroppedThumbnail
                              url={images[selectedIndex].originalUri ?? images[selectedIndex].uri}
                              crop={existingCrop}
                              width={200}
                              borderRadius={8}
                            />
                          ) : (
                            <Image
                              source={{ uri: previewUri }}
                              style={{ width: 200, height: 105, borderRadius: borderRadiusNum.md }}
                              contentFit="cover"
                            />
                          )}
                        </View>
                        <View className="flex-row items-center mt-2 gap-3">
                          <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={iconSizeNum.sm} className="text-primary" />
                            <Text className="ml-1 text-xs text-primary font-medium">
                              {t('spot.thumbnailSelected')}
                            </Text>
                          </View>
                          {onCropComplete && (
                            <Pressable
                              onPress={handleRecrop}
                              className="flex-row items-center px-2 py-1 rounded-md bg-secondary"
                            >
                              <Ionicons
                                name="crop-outline"
                                size={iconSizeNum.sm}
                                color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                              />
                              <Text className="ml-1 text-xs text-on-surface-variant font-medium">
                                {t('spot.thumbnailEdit')}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* サムネイルなしの場合 */}
                  {!currentSelectedImage && (
                    <View className="mb-5">
                      <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                        {t('spot.thumbnailCurrent')}
                      </Text>
                      <View className="items-center py-4">
                        <Ionicons
                          name="image-outline"
                          size={iconSizeNum['2xl']}
                          color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                        />
                        <Text className="text-sm text-on-surface-variant mt-2">
                          {t('spot.thumbnailNone')}
                        </Text>
                        <Text className="text-xs text-on-surface-variant mt-1">
                          {t('spot.thumbnailSelectHint')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* 画像選択リスト（横スクロール） */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                      {t('spot.thumbnailUploaded')}
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: spacingNum[3], paddingLeft: spacingNum[1], paddingTop: spacingNum[1] }}
                    >
                      {/* 「なし」の選択肢 */}
                      <View className="relative" style={{ marginTop: 4 }}>
                        <Pressable
                          onPress={handleClearThumbnail}
                          className="rounded-lg overflow-hidden active:opacity-70 items-center justify-center"
                          style={{
                            width: 72,
                            height: 72,
                            borderWidth: selectedIndex === null ? 2 : 1,
                            borderColor: selectedIndex === null
                              ? colors.light.primary
                              : (isDarkMode ? colors.primitive.gray[600] : colors.primitive.gray[300]),
                            backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.secondary,
                          }}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={iconSizeNum.lg}
                            color={isDarkMode ? colors.primitive.gray[400] : colors.primitive.gray[500]}
                          />
                          <Text className="text-xs text-on-surface-variant mt-1">{t('spot.thumbnailNone')}</Text>
                        </Pressable>
                        {selectedIndex === null && (
                          <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                            <Ionicons name="checkmark" size={10} color="white" />
                          </View>
                        )}
                      </View>

                      {/* 画像一覧 */}
                      {images.map((image, index) => {
                        const isSelected = selectedIndex === index;
                        return (
                          <View key={image.id ?? index} className="relative" style={{ marginTop: 4 }}>
                            <Pressable
                              onPress={() => handleSelectImage(index)}
                              className="rounded-lg overflow-hidden active:opacity-70"
                              style={{
                                borderWidth: isSelected ? 2 : 0,
                                borderColor: colors.light.primary,
                              }}
                            >
                              <Image
                                source={{ uri: image.uri }}
                                style={{ width: 72, height: 72, borderRadius: borderRadiusNum.default }}
                                contentFit="cover"
                                transition={200}
                              />
                            </Pressable>
                            {isSelected && (
                              <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                                <Ionicons name="checkmark" size={10} color="white" />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </BottomSheetScrollView>
              </BottomSheet>
            </View>
          </GestureHandlerRootView>
        </Modal>
      )}

      {/* クロップモーダル（ボトムシートModalの外で独立表示） */}
      {pendingCropImage && (
        <CropModal
          visible={cropModalVisible}
          imageUri={pendingCropImage.uri}
          imageWidth={pendingCropImage.width}
          imageHeight={pendingCropImage.height}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </View>
  );
}
