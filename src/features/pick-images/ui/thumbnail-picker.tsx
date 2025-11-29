/**
 * サムネイル画像選択コンポーネント
 *
 * マップのサムネイル用に1枚の画像を選択する
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/shared/config';

export interface ThumbnailImage {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

interface ThumbnailPickerProps {
  image: ThumbnailImage | null;
  onImageChange: (image: ThumbnailImage | null) => void;
}

export function ThumbnailPicker({
  image,
  onImageChange,
}: ThumbnailPickerProps) {
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
        allowsMultipleSelection: false,
        quality: 0.8,
        exif: false,
        aspect: [16, 9], // サムネイル用のアスペクト比
        allowsEditing: true,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0]!;
        onImageChange({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });
      }
    } catch (error: any) {
      console.error('画像選択エラー:', error);
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

  return (
    <View>
      {image ? (
        // 選択済み画像のプレビュー
        <View className="relative">
          <Image
            source={{ uri: image.uri }}
            className="w-full h-40 rounded-lg"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removeImage}
            className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 items-center justify-center"
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showActionSheet}
            className="absolute bottom-2 right-2 bg-black/50 rounded-full px-3 py-1 flex-row items-center"
          >
            <Ionicons name="camera-outline" size={16} color="white" />
            <Text className="text-white text-sm ml-1">変更</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 追加ボタン
        <TouchableOpacity
          onPress={showActionSheet}
          disabled={isLoading}
          className="w-full h-40 rounded-lg border border-dashed border-gray-300 items-center justify-center bg-gray-50"
        >
          <Ionicons
            name="image-outline"
            size={40}
            color={colors.gray[400]}
          />
          <Text className="mt-2 text-base text-gray-500">
            {isLoading ? '読み込み中...' : 'サムネイルを追加'}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            任意
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
