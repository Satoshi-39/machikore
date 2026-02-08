/**
 * 画像選択ボタンコンポーネント
 *
 * カメラ撮影またはライブラリから画像を選択するユーザーアクション
 * 選択した画像はローカルの永続ディレクトリに保存される
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActionSheetIOS, Platform, Linking, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, borderRadiusNum, INPUT_LIMITS, iconSizeNum, SUBSCRIPTION } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { convertToJpeg, saveDraftImage, deleteDraftImage } from '@/shared/lib/image';
import { useI18n } from '@/shared/lib/i18n';

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
  /** 画像をローカルに永続保存するかどうか（スポット作成時はtrue） */
  persistLocally?: boolean;
  /** 画像削除時のコールバック（ローカル永続化時に使用） */
  onImageRemove?: (index: number, uri: string) => Promise<void>;
  /** 上限到達時のアップグレード誘導コールバック（プレミアム導線用） */
  onUpgradePress?: () => void;
}

export function ImagePickerButton({
  images,
  onImagesChange,
  maxImages = INPUT_LIMITS.MAX_IMAGES_PER_SPOT,
  hideCount = false,
  persistLocally = false,
  onImageRemove,
  onUpgradePress,
}: ImagePickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

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

            // ローカル永続化が有効な場合、永続ディレクトリに保存
            let finalUri = converted.uri;
            if (persistLocally) {
              finalUri = await saveDraftImage(converted.uri);
            }

            convertedImages.push({
              uri: finalUri,
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
            t('imagePicker.conversionError'),
            t('imagePicker.conversionErrorMessage', { count: conversionErrors })
          );
        }
      }
    } catch (error: any) {
      log.error('[PickImages] 画像選択エラー:', error);
      // シミュレータでカメラが使えない場合
      if (error?.message?.includes('Camera not available')) {
        Alert.alert(t('imagePicker.cameraNotAvailable'), t('imagePicker.cameraNotAvailableMessage'));
      } else {
        Alert.alert(t('common.error'), t('imagePicker.selectionError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showActionSheet = () => {
    if (images.length >= maxImages) {
      if (onUpgradePress) {
        Alert.alert(
          t('imagePicker.photoLimitReached'),
          t('imagePicker.photoLimitUpgradeMessage', {
            freeLimit: SUBSCRIPTION.FREE_IMAGE_LIMIT,
            premiumLimit: SUBSCRIPTION.PREMIUM_IMAGE_LIMIT,
          }),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('imagePicker.upgradeToPremium'), onPress: onUpgradePress },
          ]
        );
      } else {
        Alert.alert(t('imagePicker.limitReached'), t('imagePicker.limitMessage', { max: maxImages }));
      }
      return;
    }

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
      Alert.alert(t('imagePicker.addImage'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('imagePicker.takePhoto'), onPress: () => pickImage(true) },
        { text: t('imagePicker.chooseFromLibrary'), onPress: () => pickImage(false) },
      ]);
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    // ローカル永続化が有効で、コールバックがある場合はそちらを使用
    if (persistLocally && onImageRemove && imageToRemove) {
      await onImageRemove(index, imageToRemove.uri);
    } else if (persistLocally && imageToRemove) {
      // コールバックがない場合は直接削除
      try {
        await deleteDraftImage(imageToRemove.uri);
      } catch (error) {
        log.warn('[PickImages] ドラフト画像削除エラー:', error);
      }
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } else {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  return (
    <View>
      {/* 選択済み画像のプレビュー（横スクロール） */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          className="mb-3"
        >
          {images.map((image, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri: image.uri }}
                style={{ width: 80, height: 80, borderRadius: borderRadiusNum.md }}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={iconSizeNum.sm} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 追加ボタン */}
      <TouchableOpacity
        onPress={showActionSheet}
        disabled={isLoading || (images.length >= maxImages && !onUpgradePress)}
        className={`flex-row items-center justify-center py-3 px-4 rounded-lg border-thin border-dashed ${
          images.length >= maxImages && !onUpgradePress ? 'border-outline bg-surface-variant' : 'border-outline'
        }`}
      >
        <Ionicons
          name="camera-outline"
          size={iconSizeNum.lg}
          color={images.length >= maxImages && !onUpgradePress ? colors.primitive.gray[400] : colors.primitive.gray[500]}
        />
        <Text
          className={`ml-2 text-base ${
            images.length >= maxImages && !onUpgradePress ? 'text-on-surface-variant' : 'text-on-surface'
          }`}
        >
          {isLoading
            ? t('common.loading')
            : images.length >= maxImages && !onUpgradePress
            ? t('imagePicker.maxPhotos', { max: maxImages })
            : t('imagePicker.addPhoto')}
        </Text>
      </TouchableOpacity>

      {!hideCount && (
        <Text className="text-xs text-on-surface-variant mt-1">
          {t('imagePicker.photoCount', { current: images.length, max: maxImages })}
        </Text>
      )}
    </View>
  );
}
