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
import { colors } from '@/shared/config';
import { log } from '@/shared/config/logger';

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
          '動画を選択するには、設定から写真ライブラリへのアクセスを許可してください。'
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
            '動画が長すぎます',
            `${maxDurationSeconds}秒以内の動画を選択してください。\n選択した動画: ${Math.round(durationSeconds)}秒`
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
          'カメラが利用できません',
          'シミュレータではカメラを使用できません。ライブラリから選択してください。'
        );
      } else {
        Alert.alert('エラー', '動画の選択に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showActionSheet = () => {
    if (videos.length >= maxVideos) {
      Alert.alert('上限に達しました', `最大${maxVideos}本まで追加できます`);
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
            pickVideo(true);
          } else if (buttonIndex === 2) {
            pickVideo(false);
          }
        }
      );
    } else {
      Alert.alert('動画を追加', '', [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'カメラで撮影', onPress: () => pickVideo(true) },
        { text: 'ライブラリから選択', onPress: () => pickVideo(false) },
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
                style={{ width: 120, height: 160, borderRadius: 8, overflow: 'hidden' }}
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
                  <Ionicons name="videocam" size={14} color="white" />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeVideo(index)}
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
        disabled={isLoading || videos.length >= maxVideos}
        className={`flex-row items-center justify-center py-3 px-4 rounded-lg border border-dashed ${
          videos.length >= maxVideos
            ? 'border-outline bg-surface-variant'
            : 'border-outline'
        }`}
      >
        <Ionicons
          name="videocam-outline"
          size={24}
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
            ? '読み込み中...'
            : videos.length >= maxVideos
            ? `最大${maxVideos}本`
            : 'ショート動画を追加'}
        </Text>
      </TouchableOpacity>

      {!hideCount && (
        <Text className="text-xs text-on-surface-variant mt-1">
          {videos.length}/{maxVideos}本（最大{maxDurationSeconds}秒）
        </Text>
      )}
    </View>
  );
}
