/**
 * プロフィール編集フォーム
 *
 * 基本情報の編集UI（アバター、表示名、ユーザー名、自己紹介）
 * アバター画像選択後にCropModal（1:1）でクロップ位置を調整
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Input } from '@/shared/ui';
import { colors, INPUT_LIMITS, avatarSizeNum, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { CropModal } from '@/features/crop-image';
import type { CropResult, ThumbnailCrop } from '@/shared/lib/image';
import { log } from '@/shared/config/logger';

export interface AvatarFile {
  uri: string;
  type: string;
  name: string;
  /** 元画像URI（再クロップ用） */
  originalUri?: string;
  /** 元画像の幅 */
  originalWidth?: number;
  /** 元画像の高さ */
  originalHeight?: number;
}

interface EditProfileFormProps {
  /** 編集モード（fullモードでセクションタイトル表示） */
  isFullMode: boolean;
  /** アバターURL */
  avatarUri: string | null;
  /** アバタークロップ座標（既存のクロップ情報） */
  avatarCrop?: ThumbnailCrop | null;
  /** アバター変更時のコールバック */
  onAvatarChange: (uri: string, file: AvatarFile, crop: ThumbnailCrop) => void;
  /** 表示名 */
  displayName: string;
  /** 表示名変更時のコールバック */
  onDisplayNameChange: (value: string) => void;
  /** 自己紹介 */
  bio: string;
  /** 自己紹介変更時のコールバック */
  onBioChange: (value: string) => void;
}

export function EditProfileForm({
  isFullMode,
  avatarUri,
  avatarCrop,
  onAvatarChange,
  displayName,
  onDisplayNameChange,
  bio,
  onBioChange,
}: EditProfileFormProps) {
  const { t } = useI18n();

  // CropModal用の状態
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    width: number;
    height: number;
    mimeType?: string;
    fileName?: string;
  } | null>(null);

  // 画像選択（CropModal経由）
  const handlePickImage = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t('profile.photoPermissionRequired'), t('profile.photoPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPendingImage({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType || undefined,
        fileName: asset.fileName || undefined,
      });
      setCropModalVisible(true);
    }
  }, [t]);

  // CropModal完了時
  const handleCropComplete = useCallback((result: CropResult) => {
    if (!pendingImage) return;

    const crop: ThumbnailCrop = {
      originX: result.cropRegion.originX,
      originY: result.cropRegion.originY,
      width: result.cropRegion.width,
      height: result.cropRegion.height,
      imageWidth: pendingImage.width,
      imageHeight: pendingImage.height,
    };

    onAvatarChange(
      pendingImage.uri,
      {
        uri: pendingImage.uri,
        type: pendingImage.mimeType || 'image/jpeg',
        name: pendingImage.fileName || `avatar_${Date.now()}.jpg`,
        originalUri: pendingImage.uri,
        originalWidth: pendingImage.width,
        originalHeight: pendingImage.height,
      },
      crop,
    );
    setCropModalVisible(false);
    setPendingImage(null);
  }, [pendingImage, onAvatarChange]);

  // CropModalキャンセル時
  const handleCropCancel = useCallback(() => {
    setCropModalVisible(false);
    setPendingImage(null);
  }, []);

  // 既存アバターの再クロップ
  const handleRecrop = useCallback(() => {
    if (!avatarUri) return;

    // 既存画像のサイズを取得してCropModalを開く
    RNImage.getSize(
      avatarUri,
      (width, height) => {
        setPendingImage({
          uri: avatarUri,
          width,
          height,
        });
        setCropModalVisible(true);
      },
      (error) => {
        log.error('[EditProfileForm] 画像サイズ取得エラー:', error);
        Alert.alert('エラー', '画像の読み込みに失敗しました');
      },
    );
  }, [avatarUri]);

  // アバタープレビュー表示
  const avatarSize = avatarSizeNum['2xl'];
  const renderAvatarPreview = () => {
    if (!avatarUri) {
      return (
        <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
          <Ionicons name="person" size={iconSizeNum['3xl']} className="text-on-surface-variant" />
        </View>
      );
    }

    // クロップ情報がある場合はクロップ表示
    if (avatarCrop) {
      const scale = avatarSize / avatarCrop.width;
      const imageDisplayWidth = avatarCrop.imageWidth * scale;
      const imageDisplayHeight = avatarCrop.imageHeight * scale;

      return (
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: avatarUri }}
            style={{
              position: 'absolute',
              width: imageDisplayWidth,
              height: imageDisplayHeight,
              left: -avatarCrop.originX * scale,
              top: -avatarCrop.originY * scale,
            }}
            cachePolicy="memory-disk"
          />
        </View>
      );
    }

    // クロップなし: 従来通りcover表示
    return (
      <Image
        source={{ uri: avatarUri }}
        style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    );
  };

  return (
    <>
      {/* アバター画像 */}
      <View className="items-center py-6 bg-surface">
        <View className="relative">
          <Pressable onPress={handlePickImage}>
            {renderAvatarPreview()}
            <View
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.light.primary }}
            >
              <Ionicons name="camera" size={iconSizeNum.sm} color="white" />
            </View>
          </Pressable>
        </View>
        {avatarUri && avatarCrop && (
          <Pressable onPress={handleRecrop} className="mt-2 flex-row items-center">
            <Ionicons name="crop-outline" size={iconSizeNum.sm} className="text-primary" />
            <Text className="text-sm text-primary ml-1">{t('common.edit')}</Text>
          </Pressable>
        )}
        {!avatarCrop && (
          <Text className="text-sm text-on-surface-variant mt-2">
            {t('profile.tapToChangePhoto')}
          </Text>
        )}
      </View>

      {/* フォーム */}
      <View className={`bg-surface px-4 py-4 ${isFullMode ? 'border-t-hairline border-outline-variant' : ''}`}>
        {/* セクションタイトル（fullモードのみ） */}
        {isFullMode && (
          <Text className="text-sm font-medium text-on-surface-variant mb-4">
            {t('profile.basicInfo')}
          </Text>
        )}

        {/* 表示名 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-on-surface mb-1">
            {t('profile.displayName')}
          </Text>
          <Input
            value={displayName}
            onChangeText={onDisplayNameChange}
            placeholder={t('profile.displayNamePlaceholder')}
            maxLength={INPUT_LIMITS.USER_DISPLAY_NAME}
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {displayName.length}/{INPUT_LIMITS.USER_DISPLAY_NAME}
          </Text>
        </View>

        {/* 自己紹介 */}
        <View>
          <Text className="text-sm font-medium text-on-surface mb-1">
            {t('profile.bio')}
          </Text>
          <Input
            value={bio}
            onChangeText={onBioChange}
            placeholder={t('profile.bioPlaceholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
            maxLength={INPUT_LIMITS.USER_BIO}
          />
          <Text className="text-xs text-on-surface-variant mt-1 text-right">
            {bio.length}/{INPUT_LIMITS.USER_BIO}
          </Text>
        </View>
      </View>

      {/* クロップモーダル */}
      {pendingImage && (
        <CropModal
          visible={cropModalVisible}
          imageUri={pendingImage.uri}
          imageWidth={pendingImage.width}
          imageHeight={pendingImage.height}
          aspectRatio={1}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
