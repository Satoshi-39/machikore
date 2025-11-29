/**
 * 画像選択ボタンコンポーネント
 *
 * カメラ撮影またはライブラリから画像を選択するユーザーアクション
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/shared/config';

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
}

export function ImagePickerButton({
  images,
  onImagesChange,
  maxImages = 5,
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
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsMultipleSelection: !useCamera && images.length < maxImages - 1,
        quality: 0.8,
        exif: false,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.slice(0, maxImages - images.length).map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        }));

        onImagesChange([...images, ...newImages]);
      }
    } catch (error: any) {
      console.error('画像選択エラー:', error);
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
          images.length >= maxImages ? 'border-gray-200 bg-gray-50' : 'border-gray-300'
        }`}
      >
        <Ionicons
          name="camera-outline"
          size={24}
          color={images.length >= maxImages ? colors.gray[400] : colors.primary.DEFAULT}
        />
        <Text
          className={`ml-2 text-base ${
            images.length >= maxImages ? 'text-gray-400' : 'text-primary'
          }`}
        >
          {isLoading
            ? '読み込み中...'
            : images.length >= maxImages
            ? `最大${maxImages}枚`
            : '写真を追加'}
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 mt-1">
        {images.length}/{maxImages}枚
      </Text>
    </View>
  );
}
