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
import { CropModal } from '@/features/crop-image';
import { CroppedThumbnail } from '@/shared/ui';
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
          '権限が必要です',
          'カメラを使用するには、設定からカメラへのアクセスを許可してください。',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: '設定を開く', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '権限が必要です',
          '写真を選択するには、設定から写真ライブラリへのアクセスを許可してください。',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: '設定を開く', onPress: () => Linking.openSettings() },
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
        Alert.alert('カメラが利用できません', 'シミュレータではカメラを使用できません。ライブラリから選択してください。');
      } else {
        Alert.alert('エラー', '画像の選択に失敗しました');
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
  const handleRecrop = useCallback(() => {
    if (!image) return;

    const originalUri = image.originalUri ?? image.uri;
    const originalWidth = image.originalWidth ?? image.width;
    const originalHeight = image.originalHeight ?? image.height;

    // width/heightが不明（0）の場合、Image.getSizeで取得する
    if (!originalWidth || !originalHeight) {
      RNImage.getSize(
        originalUri,
        (width, height) => {
          setPendingImage({ uri: originalUri, width, height });
          setCropModalVisible(true);
        },
        (error) => {
          log.error('[ThumbnailPicker] 画像サイズ取得エラー:', error);
          Alert.alert('エラー', '画像の読み込みに失敗しました');
        },
      );
      return;
    }

    setPendingImage({
      uri: originalUri,
      width: originalWidth,
      height: originalHeight,
    });
    setCropModalVisible(true);
  }, [image]);

  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['キャンセル', 'カメラで撮影', 'ライブラリから選択'],
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
      Alert.alert('サムネイルを追加', '', [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'カメラで撮影', onPress: () => pickImage(true) },
        { text: 'ライブラリから選択', onPress: () => pickImage(false) },
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
              <Text className="text-white text-sm ml-1">編集</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showActionSheet}
              className="bg-black/50 rounded-full px-3 py-1 flex-row items-center"
            >
              <Ionicons name="camera-outline" size={iconSizeNum.sm} color="white" />
              <Text className="text-white text-sm ml-1">変更</Text>
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
            {isLoading ? '読み込み中...' : 'サムネイルを追加'}
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
