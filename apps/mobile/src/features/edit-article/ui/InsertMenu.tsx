/**
 * 挿入メニュー
 *
 * エディタに画像やその他のコンテンツを挿入するためのメニュー
 * プラスボタンをタップすると表示される
 *
 * メニュー項目:
 * 1. 画像を挿入 - スポットに紐づく既存画像から選択
 * 2. 埋め込み - YouTube, X, Instagram等のURLを入力
 *
 * 注意: 画像のアップロード・削除はスポット作成/編集ページの責務。
 * 記事ページでは既存画像プールからの挿入のみを担当する。
 */

import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { isEmbeddableUrl } from '@/shared/lib/embed';
import { OptimizedImage } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';

/** メニュー画面の種類 */
type MenuScreen = 'main' | 'image' | 'embed';

/** スポットに紐づく画像の型 */
export interface SpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
  /** 画像の幅（クロップ用、オプショナル） */
  width?: number | null;
  /** 画像の高さ（クロップ用、オプショナル） */
  height?: number | null;
}

interface InsertMenuProps {
  /** メニューの表示状態 */
  visible: boolean;
  /** メニューを閉じる */
  onClose: () => void;
  /** 画像挿入（URLを渡す） */
  onInsertImage: (imageUrl: string) => void | Promise<void>;
  /** 埋め込みコンテンツ挿入（URLを渡す） */
  onInsertEmbed?: (url: string) => void;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
}

export function InsertMenu({
  visible,
  onClose,
  onInsertImage,
  onInsertEmbed,
  spotImages = [],
}: InsertMenuProps) {
  const isDarkMode = useIsDarkMode();
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('main');
  const [embedUrl, setEmbedUrl] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント
  const snapPoints = useMemo(() => ['50%'], []);

  // メニューを閉じてリセット
  const handleClose = useCallback(() => {
    setCurrentScreen('main');
    setEmbedUrl('');
    onClose();
  }, [onClose]);

  // 既存画像を選択
  const handleSelectExistingImage = useCallback(async (image: SpotImage) => {
    if (image.cloud_path) {
      await onInsertImage(image.cloud_path);
      bottomSheetRef.current?.close();
    }
  }, [onInsertImage]);

  // 埋め込みコンテンツを挿入
  const handleInsertEmbed = useCallback(() => {
    if (!isEmbeddableUrl(embedUrl)) {
      Alert.alert('無効なURL', 'YouTube、X、InstagramのURLを入力してください');
      return;
    }

    onInsertEmbed?.(embedUrl);
    setEmbedUrl('');
    bottomSheetRef.current?.close();
  }, [embedUrl, onInsertEmbed]);

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
      case 'embed':
        return '埋め込み';
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
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
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

                  {/* 埋め込み */}
                  {onInsertEmbed && (
                    <Pressable
                      onPress={() => setCurrentScreen('embed')}
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
                          name="code-slash-outline"
                          size={22}
                          color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-on-surface">埋め込み</Text>
                        <Text className="text-sm text-on-surface-variant">
                          YouTube, X, Instagram
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
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* 画像がない場合 */}
                  {spotImages.length === 0 && (
                    <View className="py-6 items-center">
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
                </>
              )}

              {/* 埋め込み画面 */}
              {currentScreen === 'embed' && (
                <View className="gap-4">
                  <Text className="text-sm text-on-surface-variant">
                    埋め込むURLを入力してください
                  </Text>
                  <Text className="text-xs text-on-surface-variant">
                    対応: YouTube, X(Twitter), Instagram
                  </Text>
                  <BottomSheetTextInput
                    value={embedUrl}
                    onChangeText={setEmbedUrl}
                    placeholder="https://..."
                    placeholderTextColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    style={{
                      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
                    }}
                  />
                  <Pressable
                    onPress={handleInsertEmbed}
                    disabled={!embedUrl.trim()}
                    className={`items-center rounded-lg py-3 ${
                      embedUrl.trim() ? 'bg-primary' : 'bg-secondary opacity-50'
                    }`}
                  >
                    <Text className={`text-base font-medium ${embedUrl.trim() ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                      埋め込む
                    </Text>
                  </Pressable>
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
