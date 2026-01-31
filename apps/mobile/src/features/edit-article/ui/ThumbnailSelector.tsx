/**
 * サムネイル選択モーダル
 *
 * スポットのサムネイル画像を選択するためのボトムシート
 * - 既存の画像から選択
 * - 「なし」で解除
 *
 * 注意: 画像のアップロード・削除はスポット作成/編集ページの責務。
 * 記事ページでは既存画像プールからの選択のみを担当する。
 */

import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { OptimizedImage } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { SpotImage } from './InsertMenu';

interface ThumbnailSelectorProps {
  /** モーダルの表示状態 */
  visible: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** サムネイル選択時のコールバック（画像IDを渡す、nullでサムネイルなし） */
  onSelectThumbnail: (imageId: string | null) => void;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
  /** 現在選択中のサムネイル画像ID */
  currentThumbnailId?: string | null;
}

export function ThumbnailSelector({
  visible,
  onClose,
  onSelectThumbnail,
  spotImages = [],
  currentThumbnailId,
}: ThumbnailSelectorProps) {
  const isDarkMode = useIsDarkMode();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント: 60%
  const snapPoints = useMemo(() => ['60%'], []);

  // 現在のサムネイル画像を取得
  // currentThumbnailIdが設定されていればその画像、なければnull（自動選択しない）
  const currentThumbnailImage = useMemo(() => {
    if (spotImages.length === 0) return null;
    if (currentThumbnailId) {
      return spotImages.find((img) => img.id === currentThumbnailId) || null;
    }
    return null;
  }, [spotImages, currentThumbnailId]);

  // サムネイルを解除（モーダルは閉じない）
  const handleClearThumbnail = useCallback(() => {
    onSelectThumbnail(null);
  }, [onSelectThumbnail]);

  // 既存画像を選択（モーダルは閉じない）
  const handleSelectExistingImage = useCallback((image: SpotImage) => {
    onSelectThumbnail(image.id);
  }, [onSelectThumbnail]);

  // シート変更時のハンドラー（閉じた時）
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

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

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
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
              <View className="w-8 h-8" />
              <Text className="flex-1 text-center text-lg font-semibold text-on-surface">
                サムネイル画像を選択
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

            <BottomSheetScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {/* 現在のサムネイルセクション（表示のみ） */}
              {currentThumbnailImage && (
                <View className="mb-5">
                  <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                    現在のサムネイル
                  </Text>
                  <View className="items-center">
                    <View
                      className="rounded-xl overflow-hidden"
                      style={{
                        borderWidth: 3,
                        borderColor: colors.light.primary,
                      }}
                    >
                      <OptimizedImage
                        url={currentThumbnailImage.cloud_path}
                        width={200}
                        height={105}
                        borderRadius={8}
                        quality={80}
                      />
                    </View>
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="checkmark-circle" size={16} className="text-primary" />
                      <Text className="ml-1 text-xs text-primary font-medium">
                        選択中
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* サムネイルがない場合の表示 */}
              {!currentThumbnailImage && spotImages.length > 0 && (
                <View className="mb-5">
                  <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                    現在のサムネイル
                  </Text>
                  <View className="items-center py-4">
                    <Ionicons
                      name="image-outline"
                      size={32}
                      color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                    />
                    <Text className="text-sm text-on-surface-variant mt-2">
                      サムネイルなし
                    </Text>
                    <Text className="text-xs text-on-surface-variant mt-1">
                      下の画像をタップして選択
                    </Text>
                  </View>
                </View>
              )}

              {/* アップロードした画像セクション（横スクロール） */}
              {spotImages.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-on-surface-variant">
                    アップロードした画像
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingLeft: 4, paddingTop: 4 }}
                  >
                    {/* 「なし」の選択肢 */}
                    <View className="relative" style={{ marginTop: 4 }}>
                      <Pressable
                        onPress={handleClearThumbnail}
                        className="rounded-lg overflow-hidden active:opacity-70 items-center justify-center"
                        style={{
                          width: 72,
                          height: 72,
                          borderWidth: !currentThumbnailImage ? 2 : 1,
                          borderColor: !currentThumbnailImage ? colors.light.primary : (isDarkMode ? colors.primitive.gray[600] : colors.primitive.gray[300]),
                          backgroundColor: isDarkMode ? colors.dark.secondary : colors.light.secondary,
                        }}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={24}
                          color={isDarkMode ? colors.primitive.gray[400] : colors.primitive.gray[500]}
                        />
                        <Text className="text-xs text-on-surface-variant mt-1">なし</Text>
                      </Pressable>
                      {/* 選択中マーク */}
                      {!currentThumbnailImage && (
                        <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                          <Ionicons name="checkmark" size={10} color="white" />
                        </View>
                      )}
                    </View>
                    {spotImages.map((image) => {
                      const isCurrentThumbnail = currentThumbnailImage?.id === image.id;
                      return (
                        <View key={image.id} className="relative" style={{ marginTop: 4 }}>
                          <Pressable
                            onPress={() => handleSelectExistingImage(image)}
                            className="rounded-lg overflow-hidden active:opacity-70"
                            style={{
                              borderWidth: isCurrentThumbnail ? 2 : 0,
                              borderColor: colors.light.primary,
                            }}
                          >
                            <OptimizedImage
                              url={image.cloud_path}
                              width={72}
                              height={72}
                              borderRadius={6}
                              quality={75}
                            />
                          </Pressable>
                          {/* 選択中マーク */}
                          {isCurrentThumbnail && (
                            <View className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5">
                              <Ionicons name="checkmark" size={10} color="white" />
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* 画像がない場合 */}
              {spotImages.length === 0 && (
                <View className="mb-4 py-6 items-center">
                  <Ionicons
                    name="images-outline"
                    size={48}
                    color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                  />
                  <Text className="mt-2 text-sm text-on-surface-variant">
                    画像がありません
                  </Text>
                  <Text className="mt-1 text-xs text-on-surface-variant">
                    スポット編集ページから画像を追加してください
                  </Text>
                </View>
              )}
            </BottomSheetScrollView>
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
