/**
 * 動画選択ボタンコンポーネント
 *
 * カメラ撮影またはライブラリから動画を選択するユーザーアクション
 * 30秒以内のショート動画専用
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { colors, borderRadiusNum, iconSizeNum } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

export interface SelectedVideo {
  uri: string;
  width?: number;
  height?: number;
  duration?: number; // 秒
  fileSize?: number;
}

interface VideoPickerButtonProps {
  videos: SelectedVideo[];
  onVideosChange: (videos: SelectedVideo[]) => void;
  maxVideos?: number;
  maxDurationSeconds?: number;
  /** 枚数表示を非表示にする */
  hideCount?: boolean;
}

const MAX_DURATION_SECONDS = 30; // 30秒制限
const MAX_VIDEOS = 1; // ショート動画は1本まで

export function VideoPickerButton({
  videos,
  onVideosChange,
  maxVideos = MAX_VIDEOS,
  maxDurationSeconds = MAX_DURATION_SECONDS,
  hideCount = false,
}: VideoPickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  const requestPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionRequired'),
          t('imagePicker.cameraPermission')
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('imagePicker.permissionRequired'),
          t('videoPicker.libraryPermission')
        );
        return false;
      }
    }
    return true;
  };

  const pickVideo = async (useCamera: boolean) => {
    const hasPermission = await requestPermission(useCamera ? 'camera' : 'library');
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const remainingSlots = maxVideos - videos.length;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['videos'],
        allowsMultipleSelection: false,
        videoMaxDuration: maxDurationSeconds,
        quality: 0.8,
        exif: false,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0]!;

        // 動画の長さチェック
        const durationSeconds = asset.duration ? asset.duration / 1000 : undefined;
        if (durationSeconds && durationSeconds > maxDurationSeconds) {
          Alert.alert(
            t('videoPicker.tooLong'),
            t('videoPicker.tooLongMessage', { max: maxDurationSeconds, duration: Math.round(durationSeconds) })
          );
          return;
        }

        const selectedVideo: SelectedVideo = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          duration: durationSeconds,
          fileSize: asset.fileSize,
        };

        log.debug('[PickVideos] 動画選択:', {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          duration: durationSeconds,
          fileSize: asset.fileSize,
        });

        onVideosChange([...videos.slice(0, remainingSlots - 1), selectedVideo]);
      }
    } catch (error: any) {
      log.error('[PickVideos] 動画選択エラー:', error);
      if (error?.message?.includes('Camera not available')) {
        Alert.alert(
          t('imagePicker.cameraNotAvailable'),
          t('imagePicker.cameraNotAvailableMessage')
        );
      } else {
        Alert.alert(t('common.error'), t('videoPicker.selectionError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showActionSheet = () => {
    if (videos.length >= maxVideos) {
      Alert.alert(t('imagePicker.limitReached'), t('videoPicker.maxVideos', { max: maxVideos }));
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
            pickVideo(true);
          } else if (buttonIndex === 2) {
            pickVideo(false);
          }
        }
      );
    } else {
      Alert.alert(t('videoPicker.addVideo'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('imagePicker.takePhoto'), onPress: () => pickVideo(true) },
        { text: t('imagePicker.chooseFromLibrary'), onPress: () => pickVideo(false) },
      ]);
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onVideosChange(newVideos);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View>
      {/* 選択済み動画のプレビュー */}
      {videos.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {videos.map((video, index) => (
            <View key={index} className="relative">
              <View
                style={{ width: 120, height: 160, borderRadius: borderRadiusNum.md, overflow: 'hidden' }}
                className="bg-surface-variant"
              >
                <Video
                  source={{ uri: video.uri }}
                  style={{ width: 120, height: 160 }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={false}
                  isMuted
                />
                {/* 再生時間バッジ */}
                {video.duration && (
                  <View className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded">
                    <Text className="text-white text-xs font-medium">
                      {formatDuration(video.duration)}
                    </Text>
                  </View>
                )}
                {/* 動画アイコン */}
                <View className="absolute top-1 left-1 bg-black/50 p-1 rounded">
                  <Ionicons name="videocam" size={iconSizeNum.sm} color="white" />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeVideo(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={iconSizeNum.sm} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 追加ボタン */}
      <TouchableOpacity
        onPress={showActionSheet}
        disabled={isLoading || videos.length >= maxVideos}
        className={`flex-row items-center justify-center py-3 px-4 rounded-lg border-thin border-dashed ${
          videos.length >= maxVideos
            ? 'border-outline bg-surface-variant'
            : 'border-outline'
        }`}
      >
        <Ionicons
          name="videocam-outline"
          size={iconSizeNum.lg}
          color={videos.length >= maxVideos ? colors.primitive.gray[400] : colors.light.primary}
        />
        <Text
          className={`ml-2 text-base ${
            videos.length >= maxVideos
              ? 'text-on-surface-variant'
              : 'text-primary'
          }`}
        >
          {isLoading
            ? t('common.loading')
            : videos.length >= maxVideos
            ? t('videoPicker.maxVideos', { max: maxVideos })
            : t('videoPicker.addShortVideo')}
        </Text>
      </TouchableOpacity>

      {!hideCount && (
        <Text className="text-xs text-on-surface-variant mt-1">
          {t('videoPicker.videoCount', { current: videos.length, max: maxVideos, maxDuration: maxDurationSeconds })}
        </Text>
      )}
    </View>
  );
}
