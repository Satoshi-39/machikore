/**
 * 画像選択ボタンコンポーネント
 *
 * カメラ撮影またはライブラリから画像を選択するユーザーアクション
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, INPUT_LIMITS } from '@/shared/config';
import { log } from '@/shared/config/logger';

export interface SelectedImage {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

interface ImagePickerButtonProps {
  images: SelectedImage[];
  onImagesChange: (images: SelectedImage[]) => void;
  maxImages?: number;
  /** 枚数表示を非表示にする（編集画面で合計表示を別途行う場合用） */
  hideCount?: boolean;
}

// 画像をJPEGに変換・圧縮・リサイズするヘルパー
const MAX_IMAGE_DIMENSION = 1920; // 最大幅/高さ

async function convertToJpeg(uri: string): Promise<{ uri: string; width: number; height: number }> {
  // まず元画像の情報を取得するため一度処理
  const info = await ImageManipulator.manipulateAsync(uri, [], {});

  // リサイズが必要かチェック
  const actions: ImageManipulator.Action[] = [];
  if (info.width > MAX_IMAGE_DIMENSION || info.height > MAX_IMAGE_DIMENSION) {
    if (info.width > info.height) {
      actions.push({ resize: { width: MAX_IMAGE_DIMENSION } });
    } else {
      actions.push({ resize: { height: MAX_IMAGE_DIMENSION } });
    }
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: 0.6, // 圧縮率を上げてファイルサイズを削減
    format: ImageManipulator.SaveFormat.JPEG,
  });
  log.debug(`[PickImages] JPEG変換完了: ${result.width}x${result.height}`);
  return { uri: result.uri, width: result.width, height: result.height };
}

export function ImagePickerButton({
  images,
  onImagesChange,
  maxImages = INPUT_LIMITS.MAX_IMAGES_PER_SPOT,
  hideCount = false,
}: ImagePickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '権限が必要です',
          'カメラを使用するには、設定からカメラへのアクセスを許可してください。'
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '権限が必要です',
          '写真を選択するには、設定から写真ライブラリへのアクセスを許可してください。'
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
      const remainingSlots = maxImages - images.length;
      const allowMultiple = !useCamera && remainingSlots > 1;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsMultipleSelection: allowMultiple,
        selectionLimit: remainingSlots, // 残り枠数を上限に
        quality: 0.8,
        exif: false,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets.length > 0) {
        // 選択された各画像をJPEGに変換
        const convertedImages: SelectedImage[] = [];
        let conversionErrors = 0;

        for (const asset of result.assets.slice(0, remainingSlots)) {
          try {
            const converted = await convertToJpeg(asset.uri);
            convertedImages.push({
              uri: converted.uri,
              width: converted.width,
              height: converted.height,
              fileSize: asset.fileSize,
            });
          } catch (error) {
            log.error('[PickImages] 画像変換エラー:', error);
            conversionErrors++;
          }
        }

        if (convertedImages.length > 0) {
          onImagesChange([...images, ...convertedImages]);
        }

        if (conversionErrors > 0) {
          Alert.alert(
            '画像変換エラー',
            `${conversionErrors}枚の画像を処理できませんでした。別の画像を選択してください。`
          );
        }
      }
    } catch (error: any) {
      log.error('[PickImages] 画像選択エラー:', error);
      // シミュレータでカメラが使えない場合
      if (error?.message?.includes('Camera not available')) {
        Alert.alert('カメラが利用できません', 'シミュレータではカメラを使用できません。ライブラリから選択してください。');
      } else {
        Alert.alert('エラー', '画像の選択に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showActionSheet = () => {
    if (images.length >= maxImages) {
      Alert.alert('上限に達しました', `最大${maxImages}枚まで追加できます`);
      return;
    }

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
      Alert.alert('画像を追加', '', [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'カメラで撮影', onPress: () => pickImage(true) },
        { text: 'ライブラリから選択', onPress: () => pickImage(false) },
      ]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View>
      {/* 選択済み画像のプレビュー */}
      {images.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {images.map((image, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri: image.uri }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 追加ボタン */}
      <TouchableOpacity
        onPress={showActionSheet}
        disabled={isLoading || images.length >= maxImages}
        className={`flex-row items-center justify-center py-3 px-4 rounded-lg border border-dashed ${
          images.length >= maxImages ? 'border-border dark:border-dark-border bg-background-secondary dark:bg-dark-background-secondary' : 'border-border dark:border-dark-border'
        }`}
      >
        <Ionicons
          name="camera-outline"
          size={24}
          color={images.length >= maxImages ? colors.gray[400] : colors.primary.DEFAULT}
        />
        <Text
          className={`ml-2 text-base ${
            images.length >= maxImages ? 'text-foreground-muted dark:text-dark-foreground-muted' : 'text-primary'
          }`}
        >
          {isLoading
            ? '読み込み中...'
            : images.length >= maxImages
            ? `最大${maxImages}枚`
            : '写真を追加'}
        </Text>
      </TouchableOpacity>

      {!hideCount && (
        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
          {images.length}/{maxImages}枚
        </Text>
      )}
    </View>
  );
}
