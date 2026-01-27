/**
 * 挿入メニュー
 *
 * エディタに画像やその他のコンテンツを挿入するためのメニュー
 * プラスボタンをタップすると表示される
 *
 * メニュー項目:
 * 1. 画像を挿入 - スポットに紐づく画像または新規アップロード
 * 2. YouTube動画を埋め込み - YouTubeのURLを入力
 */

import { colors, INPUT_LIMITS } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useIsDarkMode } from '@/shared/lib/providers';
import { uploadImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import {
  convertToJpeg,
  requestImagePermission,
  showImagePickerMenu,
  showImageLimitAlert,
  showImageUploadErrorAlert,
  showImageProcessErrorAlert,
  showSpotNotFoundAlert,
} from '@/shared/lib/image';
import { OptimizedImage } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

/** メニュー画面の種類 */
type MenuScreen = 'main' | 'image' | 'youtube';

/** スポットに紐づく画像の型 */
export interface SpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
}

interface InsertMenuProps {
  /** メニューの表示状態 */
  visible: boolean;
  /** メニューを閉じる */
  onClose: () => void;
  /** 画像挿入（URLを渡す） */
  onInsertImage: (imageUrl: string) => void;
  /** YouTube動画挿入（URLを渡す） */
  onInsertYoutube?: (youtubeUrl: string) => void;
  /** スポットID（新規アップロード時にimagesテーブルに追加するため） */
  spotId?: string;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 新規画像アップロード完了時のコールバック（imagesテーブル更新用、DBのimageIdを返す） */
  onImageUploaded?: (imageUrl: string, imageId: string) => Promise<string | null>;
  /** 画像削除時のコールバック */
  onDeleteImage?: (imageId: string) => void;
}

export function InsertMenu({
  visible,
  onClose,
  onInsertImage,
  onInsertYoutube,
  spotId,
  spotImages = [],
  onImageUploaded,
  onDeleteImage,
}: InsertMenuProps) {
  const isDarkMode = useIsDarkMode();
  const [isUploading, setIsUploading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('main');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント
  const snapPoints = useMemo(() => ['50%'], []);

  // 残り追加可能な画像数
  const remainingSlots = INPUT_LIMITS.MAX_IMAGES_PER_SPOT - spotImages.length;
  const canUploadNew = remainingSlots > 0;

  // メニューを閉じてリセット
  const handleClose = useCallback(() => {
    setCurrentScreen('main');
    setYoutubeUrl('');
    onClose();
  }, [onClose]);

  // 既存画像を選択
  const handleSelectExistingImage = useCallback((image: SpotImage) => {
    if (image.cloud_path) {
      onInsertImage(image.cloud_path);
      bottomSheetRef.current?.close();
    }
  }, [onInsertImage]);

  // 画像を削除（確認ダイアログ付き）
  const handleDeleteImage = useCallback((image: SpotImage) => {
    Alert.alert(
      '画像を削除',
      'この画像を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            onDeleteImage?.(image.id);
          },
        },
      ]
    );
  }, [onDeleteImage]);

  // 新規画像をアップロード
  const pickAndUploadImage = useCallback(async (useCamera: boolean) => {
    if (!spotId) {
      showSpotNotFoundAlert();
      return;
    }

    const hasPermission = await requestImagePermission(useCamera ? 'camera' : 'library');
    if (!hasPermission) return;

    setIsUploading(true);
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

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      if (!asset) return;

      // 画像を変換
      const converted = await convertToJpeg(asset.uri);

      // Supabaseにアップロード
      const fileName = `${uuidv4()}.jpg`;
      const path = `${spotId}/${fileName}`;

      const uploadResult = await uploadImage({
        uri: converted.uri,
        bucket: STORAGE_BUCKETS.SPOT_IMAGES,
        path,
      });

      if (!uploadResult.success) {
        log.error('[InsertMenu] アップロード失敗:', uploadResult.error);
        showImageUploadErrorAlert();
        return;
      }

      // imagesテーブルへの追加を通知（uuidを渡す）
      await onImageUploaded?.(uploadResult.data.url, fileName.replace('.jpg', ''));

      // エディタに画像を挿入
      onInsertImage(uploadResult.data.url);
      bottomSheetRef.current?.close();

      log.info('[InsertMenu] 画像挿入成功:', uploadResult.data.url);
    } catch (error) {
      log.error('[InsertMenu] 画像挿入エラー:', error);
      showImageProcessErrorAlert();
    } finally {
      setIsUploading(false);
    }
  }, [spotId, onInsertImage, onImageUploaded]);

  // 新規アップロードメニュー表示
  const handleNewUpload = useCallback(() => {
    if (!canUploadNew) {
      showImageLimitAlert(INPUT_LIMITS.MAX_IMAGES_PER_SPOT);
      return;
    }

    showImagePickerMenu(
      () => pickAndUploadImage(true),
      () => pickAndUploadImage(false)
    );
  }, [canUploadNew, pickAndUploadImage]);

  // YouTube URLのバリデーション
  const isValidYoutubeUrl = useCallback((url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
    return youtubeRegex.test(url);
  }, []);

  // YouTube動画を挿入
  const handleInsertYoutube = useCallback(() => {
    if (!isValidYoutubeUrl(youtubeUrl)) {
      Alert.alert('無効なURL', '有効なYouTubeのURLを入力してください');
      return;
    }

    onInsertYoutube?.(youtubeUrl);
    setYoutubeUrl('');
    bottomSheetRef.current?.close();
  }, [youtubeUrl, isValidYoutubeUrl, onInsertYoutube]);

  // シート変更時のハンドラー（閉じた時）
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleClose();
    }
  }, [handleClose]);

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

  // ヘッダータイトルを取得
  const getHeaderTitle = useCallback(() => {
    switch (currentScreen) {
      case 'image':
        return '画像を挿入';
      case 'youtube':
        return 'YouTube動画を埋め込み';
      default:
        return '挿入';
    }
  }, [currentScreen]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
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
              {currentScreen !== 'main' ? (
                <Pressable
                  onPress={() => setCurrentScreen('main')}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                  />
                </Pressable>
              ) : (
                <View className="w-8 h-8" />
              )}
              <Text className="flex-1 text-center text-lg font-semibold text-on-surface">
                {getHeaderTitle()}
              </Text>
              <Pressable
                onPress={() => bottomSheetRef.current?.close()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                />
              </Pressable>
            </View>

            {/* アップロード中インジケーター */}
            {isUploading && (
              <View className="items-center justify-center py-4">
                <ActivityIndicator size="large" className="text-primary" />
                <Text className="mt-2 text-sm text-on-surface-variant">
                  アップロード中...
                </Text>
              </View>
            )}

            {!isUploading && (
              <BottomSheetScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
              >
                {/* メイン画面: メニュー一覧 */}
                {currentScreen === 'main' && (
                  <View className="gap-2">
                    {/* 画像を挿入 */}
                    <Pressable
                      onPress={() => setCurrentScreen('image')}
                      className="flex-row items-center gap-4 rounded-xl px-4 py-3 active:bg-secondary"
                    >
                      <View
                        className="h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: isDarkMode
                            ? colors.dark.secondary
                            : colors.light.secondary,
                        }}
                      >
                        <Ionicons
                          name="image-outline"
                          size={22}
                          color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-on-surface">画像を挿入</Text>
                        <Text className="text-sm text-on-surface-variant">
                          写真を追加
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                      />
                    </Pressable>

                    {/* YouTube動画を埋め込み */}
                    {onInsertYoutube && (
                      <Pressable
                        onPress={() => setCurrentScreen('youtube')}
                        className="flex-row items-center gap-4 rounded-xl px-4 py-3 active:bg-secondary"
                      >
                        <View
                          className="h-10 w-10 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: isDarkMode
                              ? colors.dark.secondary
                              : colors.light.secondary,
                          }}
                        >
                          <Ionicons
                            name="logo-youtube"
                            size={22}
                            color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base text-on-surface">YouTube動画</Text>
                          <Text className="text-sm text-on-surface-variant">
                            動画を埋め込み
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                        />
                      </Pressable>
                    )}
                  </View>
                )}

                {/* 画像挿入画面 */}
                {currentScreen === 'image' && (
                  <>
                    {/* 既存画像セクション */}
                    {spotImages.length > 0 && (
                      <View className="mb-4">
                        <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                          アップロード済みの画像
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 12, paddingLeft: 4, paddingTop: 4 }}
                        >
                          {spotImages.map((image) => (
                            <View key={image.id} className="relative" style={{ marginTop: 4 }}>
                              <Pressable
                                onPress={() => handleSelectExistingImage(image)}
                                className="rounded-lg overflow-hidden active:opacity-70"
                              >
                                <OptimizedImage
                                  url={image.cloud_path}
                                  width={72}
                                  height={72}
                                  borderRadius={6}
                                  quality={75}
                                />
                              </Pressable>
                              {/* 削除ボタン（onDeleteImageがある場合のみ表示） */}
                              {onDeleteImage && (
                                <Pressable
                                  onPress={() => handleDeleteImage(image)}
                                  className="absolute -top-1 -right-1 rounded-full items-center justify-center"
                                  style={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  }}
                                  hitSlop={4}
                                >
                                  <Ionicons name="close" size={12} color="white" />
                                </Pressable>
                              )}
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* 新規アップロードボタン */}
                    <View className="mb-2">
                      <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                        新しい画像を追加 {canUploadNew ? `(残り${remainingSlots}枚)` : '(上限に達しました)'}
                      </Text>
                      <Pressable
                        onPress={handleNewUpload}
                        disabled={!canUploadNew}
                        className={`flex-row items-center gap-4 rounded-xl px-4 py-3 ${
                          canUploadNew
                            ? 'active:bg-secondary'
                            : 'opacity-50'
                        }`}
                      >
                        <View
                          className="h-10 w-10 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: isDarkMode
                              ? colors.dark.secondary
                              : colors.light.secondary,
                          }}
                        >
                          <Ionicons
                            name="add-circle-outline"
                            size={22}
                            color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                          />
                        </View>
                        <Text className="text-base text-on-surface">
                          写真ライブラリから選択
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}

                {/* YouTube挿入画面 */}
                {currentScreen === 'youtube' && (
                  <View className="gap-4">
                    <Text className="text-sm text-on-surface-variant">
                      YouTubeの動画URLを入力してください
                    </Text>
                    <TextInput
                      value={youtubeUrl}
                      onChangeText={setYoutubeUrl}
                      placeholder="https://www.youtube.com/watch?v=..."
                      placeholderTextColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      className="rounded-lg px-4 py-3 text-base text-on-surface"
                      style={{
                        backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
                      }}
                    />
                    <Pressable
                      onPress={handleInsertYoutube}
                      disabled={!youtubeUrl.trim()}
                      className={`items-center rounded-lg py-3 ${
                        youtubeUrl.trim() ? 'bg-primary' : 'bg-secondary opacity-50'
                      }`}
                    >
                      <Text className={`text-base font-medium ${youtubeUrl.trim() ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        埋め込む
                      </Text>
                    </Pressable>
                  </View>
                )}
              </BottomSheetScrollView>
            )}
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
