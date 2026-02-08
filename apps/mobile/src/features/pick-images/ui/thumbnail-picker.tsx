/**
 * サムネイル画像選択コンポーネント
 *
 * サムネイル用に1枚の画像を選択する
 * - 画像選択後にCropModalでクロップ位置を調整
 * - 元画像URIを保持して再クロップが可能
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActionSheetIOS, Platform, Linking, Image as RNImage, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { log } from '@/shared/config/logger';
import { borderRadiusNum, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { CropModal } from '@/features/crop-image';
import { CroppedThumbnail } from '@/shared/ui';
import { getOriginalImageUrl } from '@/shared/api/supabase/storage';
import { downloadAndGetSize } from '@/shared/lib/image';
import type { CropResult, ThumbnailCrop } from '@/shared/lib/image';

export interface ThumbnailImage {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
  /** 元画像URI（再クロップ用） */
  originalUri?: string;
  /** 元画像の幅 */
  originalWidth?: number;
  /** 元画像の高さ */
  originalHeight?: number;
  /** DB保存用クロップ座標 */
  cropRegion?: ThumbnailCrop;
}

interface ThumbnailPickerProps {
  image: ThumbnailImage | null;
  onImageChange: (image: ThumbnailImage | null) => void;
  /** DB保存済みのクロップ座標（初期表示用） */
  initialCrop?: ThumbnailCrop | null;
  /** クロップ・表示のアスペクト比（デフォルト: 1.91） */
  aspectRatio?: number;
  /** プレビューの角丸（デフォルト: borderRadiusNum.md） */
  borderRadius?: number;
  /** プレビューの最大幅（指定時は中央寄せ） */
  maxWidth?: number;
}

export function ThumbnailPicker({
  image,
  onImageChange,
  initialCrop,
  aspectRatio = 1.91,
  borderRadius = borderRadiusNum.md,
  maxWidth,
}: ThumbnailPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();
  // CropModal用の状態
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);

  const requestPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionRequired'),
          t('imagePicker.cameraPermission'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('imagePicker.openSettings'), onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionRequired'),
          t('imagePicker.libraryPermission'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('imagePicker.openSettings'), onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (useCamera: boolean) => {
    const hasPermission = await requestPermission(useCamera ? 'camera' : 'library');
    if (!hasPermission) return;

    setIsLoading(true);
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

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0]!;
        // 選択した画像をCropModalに渡す
        setPendingImage({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        });
        setCropModalVisible(true);
      }
    } catch (error: any) {
      log.error('[PickImages] 画像選択エラー:', error);
      if (error?.message?.includes('Camera not available')) {
        Alert.alert(t('imagePicker.cameraNotAvailable'), t('imagePicker.cameraNotAvailableMessage'));
      } else {
        Alert.alert(t('common.error'), t('imagePicker.selectionError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // CropModal完了時
  const handleCropComplete = useCallback((result: CropResult) => {
    if (!pendingImage) return;

    onImageChange({
      uri: result.uri,
      width: result.width,
      height: result.height,
      originalUri: pendingImage.uri,
      originalWidth: pendingImage.width,
      originalHeight: pendingImage.height,
      cropRegion: {
        originX: result.cropRegion.originX,
        originY: result.cropRegion.originY,
        width: result.cropRegion.width,
        height: result.cropRegion.height,
        imageWidth: pendingImage.width,
        imageHeight: pendingImage.height,
      },
    });
    setCropModalVisible(false);
    setPendingImage(null);
  }, [pendingImage, onImageChange]);

  // CropModalキャンセル時
  const handleCropCancel = useCallback(() => {
    setCropModalVisible(false);
    setPendingImage(null);
  }, []);

  // 「編集」ボタン - 既存画像を再クロップ
  const handleRecrop = useCallback(async () => {
    if (!image) return;

    // ローカルファイル（originalUriあり）の場合は従来通り
    if (image.originalUri && !image.originalUri.startsWith('http')) {
      const w = image.originalWidth ?? image.width;
      const h = image.originalHeight ?? image.height;

      if (!w || !h) {
        RNImage.getSize(
          image.originalUri,
          (width, height) => {
            setPendingImage({ uri: image.originalUri!, width, height });
            setCropModalVisible(true);
          },
          (error) => {
            log.error('[ThumbnailPicker] 画像サイズ取得エラー:', error);
            Alert.alert(t('common.error'), t('imagePicker.imageLoadError'));
          },
        );
        return;
      }

      setPendingImage({ uri: image.originalUri, width: w, height: h });
      setCropModalVisible(true);
      return;
    }

    // DB読み込み画像（HTTP URL）: ダウンロードして実サイズを取得
    // Image.getSizeはキャッシュから旧サイズを返す場合があるため使用しない
    try {
      const targetUrl = getOriginalImageUrl(image.uri) ?? image.uri;

      try {
        // まず originals/ を試す
        const result = await downloadAndGetSize(targetUrl);
        setPendingImage(result);
        setCropModalVisible(true);
      } catch {
        // originals/ が存在しない場合はメインURLにフォールバック
        log.debug('[ThumbnailPicker] originals/ 未発見、メインURLで再クロップ');
        const result = await downloadAndGetSize(image.uri);
        setPendingImage(result);
        setCropModalVisible(true);
      }
    } catch (error) {
      log.error('[ThumbnailPicker] 画像ダウンロードエラー:', error);
      Alert.alert(t('common.error'), t('imagePicker.imageLoadError'));
    }
  }, [image]);

  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('imagePicker.takePhoto'), t('imagePicker.chooseFromLibrary')],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage(true);
          } else if (buttonIndex === 2) {
            pickImage(false);
          }
        }
      );
    } else {
      Alert.alert(t('imagePicker.addThumbnail'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('imagePicker.takePhoto'), onPress: () => pickImage(true) },
        { text: t('imagePicker.chooseFromLibrary'), onPress: () => pickImage(false) },
      ]);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  const { width: windowWidth } = useWindowDimensions();
  // パディング分を差し引いたコンテナ幅（p-4 = 16px × 2）
  const fullWidth = windowWidth - 32;
  const containerWidth = maxWidth ? Math.min(fullWidth, maxWidth) : fullWidth;

  // 表示用のクロップ座標（新しいクロップがあればそちらを優先、なければDB保存済みを使用）
  const displayCrop = image?.cropRegion ?? initialCrop;

  return (
    <View style={maxWidth ? { alignItems: 'center' } : undefined}>
      {image ? (
        // 選択済み画像のプレビュー
        <View className="relative" style={maxWidth ? { width: containerWidth } : undefined}>
          {displayCrop ? (
            <CroppedThumbnail
              url={image.originalUri ?? image.uri}
              crop={displayCrop}
              width={containerWidth}
              borderRadius={borderRadius}
              aspectRatio={aspectRatio}
            />
          ) : (
            <Image
              source={{ uri: image.uri }}
              style={{ width: containerWidth, aspectRatio, borderRadius }}
              contentFit="cover"
              transition={200}
            />
          )}
          <TouchableOpacity
            onPress={removeImage}
            className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 items-center justify-center"
          >
            <Ionicons name="close" size={iconSizeNum.md} color="white" />
          </TouchableOpacity>
          <View className="absolute bottom-2 right-2 flex-row gap-2">
            <TouchableOpacity
              onPress={handleRecrop}
              className="bg-black/50 rounded-full px-3 py-1 flex-row items-center"
            >
              <Ionicons name="crop-outline" size={iconSizeNum.sm} color="white" />
              <Text className="text-white text-sm ml-1">{t('common.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showActionSheet}
              className="bg-black/50 rounded-full px-3 py-1 flex-row items-center"
            >
              <Ionicons name="camera-outline" size={iconSizeNum.sm} color="white" />
              <Text className="text-white text-sm ml-1">{t('common.change')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // 追加ボタン
        <TouchableOpacity
          onPress={showActionSheet}
          disabled={isLoading}
          className="w-full h-40 rounded-lg border-thin border-dashed border-outline items-center justify-center bg-surface-variant"
        >
          <Ionicons
            name="image-outline"
            size={iconSizeNum['3xl']}
            className="text-gray-400"
          />
          <Text className="mt-2 text-base text-on-surface-variant">
            {isLoading ? t('common.loading') : t('imagePicker.addThumbnail')}
          </Text>
        </TouchableOpacity>
      )}

      {/* クロップモーダル */}
      {pendingImage && (
        <CropModal
          visible={cropModalVisible}
          imageUri={pendingImage.uri}
          imageWidth={pendingImage.width}
          imageHeight={pendingImage.height}
          aspectRatio={aspectRatio}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </View>
  );
}
