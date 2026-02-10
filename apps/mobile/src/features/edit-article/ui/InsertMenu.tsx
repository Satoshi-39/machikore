/**
 * 挿入メニュー
 *
 * エディタに画像やその他のコンテンツを挿入するためのメニュー
 * プラスボタンをタップすると表示される
 *
 * メニュー項目:
 * 1. 画像を挿入 - スポットに紐づく既存画像から選択
 * 2. 埋め込み - YouTube, X, Instagram等のURLを入力
 * 3. マップを挿入 - 自分のマップ一覧から選択
 * 4. スポットを挿入 - 自分のマップ → スポット一覧から選択
 *
 * 注意: 画像のアップロード・削除はスポット作成/編集ページの責務。
 * 記事ページでは既存画像プールからの挿入のみを担当する。
 */

import { colors, borderRadiusNum, fontSizeNum, spacingNum, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { isValidHttpUrl } from '@/shared/lib/utils/url.utils';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { OptimizedImage } from '@/shared/ui';
import { useUserMaps } from '@/entities/map';
import { useSpots } from '@/entities/user-spot';
import type { MapWithUser, SpotWithDetails } from '@/shared/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
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
type MenuScreen = 'main' | 'image' | 'embed' | 'select-map' | 'select-spot';

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
  onInsertEmbed?: (url: string) => void | Promise<void>;
  /** マップカード挿入 */
  onInsertMapCard?: (map: MapWithUser) => void;
  /** スポットカード挿入 */
  onInsertSpotCard?: (spot: SpotWithDetails) => void;
  /** 現在のユーザーID */
  currentUserId?: string | null;
  /** スポットに紐づく既存画像 */
  spotImages?: SpotImage[];
}

export function InsertMenu({
  visible,
  onClose,
  onInsertImage,
  onInsertEmbed,
  onInsertMapCard,
  onInsertSpotCard,
  currentUserId,
  spotImages = [],
}: InsertMenuProps) {
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('main');
  const [embedUrl, setEmbedUrl] = useState('');
  const [isEmbedLoading, setIsEmbedLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // マップ/スポット挿入用のstate
  const [insertMode, setInsertMode] = useState<'map' | 'spot' | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  // 自分のマップ一覧
  const { data: userMaps, isLoading: isMapsLoading } = useUserMaps(
    currentUserId ?? null,
    { currentUserId },
  );

  // 選択したマップ内のスポット一覧
  const { data: mapSpots, isLoading: isSpotsLoading } = useSpots(
    selectedMapId ?? '',
    currentUserId,
    true,
  );

  // スナップポイント
  const snapPoints = useMemo(() => ['50%'], []);

  // メニューを閉じてリセット
  const handleClose = useCallback(() => {
    setCurrentScreen('main');
    setEmbedUrl('');
    setIsEmbedLoading(false);
    setInsertMode(null);
    setSelectedMapId(null);
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
  const handleInsertEmbed = useCallback(async () => {
    if (!isValidHttpUrl(embedUrl)) {
      Alert.alert(t('insertMenu.invalidUrl'), t('insertMenu.invalidUrlMessage'));
      return;
    }

    setIsEmbedLoading(true);
    try {
      await onInsertEmbed?.(embedUrl);
      setEmbedUrl('');
      bottomSheetRef.current?.close();
    } finally {
      setIsEmbedLoading(false);
    }
  }, [embedUrl, onInsertEmbed, t]);

  // マップ選択画面を開く（マップ挿入モード）
  const handleOpenMapInsert = useCallback(() => {
    setInsertMode('map');
    setCurrentScreen('select-map');
  }, []);

  // マップ選択画面を開く（スポット挿入モード）
  const handleOpenSpotInsert = useCallback(() => {
    setInsertMode('spot');
    setCurrentScreen('select-map');
  }, []);

  // マップを選択
  const handleSelectMap = useCallback((map: MapWithUser) => {
    if (insertMode === 'map') {
      // マップ挿入モード: マップカードとして挿入
      onInsertMapCard?.(map);
      bottomSheetRef.current?.close();
    } else {
      // スポット挿入モード: スポット一覧に遷移
      setSelectedMapId(map.id);
      setCurrentScreen('select-spot');
    }
  }, [insertMode, onInsertMapCard]);

  // スポットを選択
  const handleSelectSpot = useCallback((spot: SpotWithDetails) => {
    onInsertSpotCard?.(spot);
    bottomSheetRef.current?.close();
  }, [onInsertSpotCard]);

  // 戻るボタン
  const handleBack = useCallback(() => {
    if (currentScreen === 'select-spot') {
      setSelectedMapId(null);
      setCurrentScreen('select-map');
    } else {
      setCurrentScreen('main');
      setInsertMode(null);
      setSelectedMapId(null);
    }
  }, [currentScreen]);

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
        return t('insertMenu.insertImage');
      case 'embed':
        return t('insertMenu.embed');
      case 'select-map':
        return insertMode === 'spot' ? t('insertMenu.selectMap') : t('insertMenu.insertMap');
      case 'select-spot':
        return t('insertMenu.selectSpot');
      default:
        return t('insertMenu.insert');
    }
  }, [currentScreen, insertMode, t]);

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
                  onPress={handleBack}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Ionicons
                    name="chevron-back"
                    size={iconSizeNum.lg}
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
                  size={iconSizeNum.md}
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
                        size={iconSizeNum.lg}
                        color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base text-on-surface">{t('insertMenu.insertImage')}</Text>
                      <Text className="text-sm text-on-surface-variant">
                        {t('insertMenu.addPhoto')}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={iconSizeNum.md}
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
                          size={iconSizeNum.lg}
                          color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-on-surface">{t('insertMenu.embed')}</Text>
                        <Text className="text-sm text-on-surface-variant">
                          {t('insertMenu.supportedServices')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={iconSizeNum.md}
                        color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                      />
                    </Pressable>
                  )}

                  {/* マップを挿入 */}
                  {onInsertMapCard && currentUserId && (
                    <Pressable
                      onPress={handleOpenMapInsert}
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
                          name="map-outline"
                          size={iconSizeNum.lg}
                          color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-on-surface">{t('insertMenu.insertMap')}</Text>
                        <Text className="text-sm text-on-surface-variant">
                          {t('insertMenu.insertMapDescription')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={iconSizeNum.md}
                        color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                      />
                    </Pressable>
                  )}

                  {/* スポットを挿入 */}
                  {onInsertSpotCard && currentUserId && (
                    <Pressable
                      onPress={handleOpenSpotInsert}
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
                          name="location-outline"
                          size={iconSizeNum.lg}
                          color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-on-surface">{t('insertMenu.insertSpot')}</Text>
                        <Text className="text-sm text-on-surface-variant">
                          {t('insertMenu.insertSpotDescription')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={iconSizeNum.md}
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
                        {t('insertMenu.uploadedImages')}
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: spacingNum[3], paddingLeft: spacingNum[1], paddingTop: spacingNum[1] }}
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
                        size={iconSizeNum['4xl']}
                        color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                      />
                      <Text className="mt-2 text-sm text-on-surface-variant">
                        {t('insertMenu.noImages')}
                      </Text>
                      <Text className="mt-1 text-xs text-on-surface-variant">
                        {t('insertMenu.noImagesHint')}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* 埋め込み画面 */}
              {currentScreen === 'embed' && (
                <View className="gap-4">
                  <Text className="text-sm text-on-surface-variant">
                    {t('insertMenu.enterEmbedUrl')}
                  </Text>
                  <Text className="text-xs text-on-surface-variant">
                    {t('insertMenu.supportedServices')}
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
                      borderRadius: borderRadiusNum.md,
                      paddingHorizontal: spacingNum[4],
                      paddingVertical: spacingNum[3],
                      fontSize: fontSizeNum.base,
                      color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'],
                    }}
                  />
                  <Pressable
                    onPress={handleInsertEmbed}
                    disabled={!embedUrl.trim() || isEmbedLoading}
                    className={`items-center rounded-lg py-3 ${
                      embedUrl.trim() && !isEmbedLoading ? 'bg-primary' : 'bg-secondary opacity-50'
                    }`}
                  >
                    {isEmbedLoading ? (
                      <ActivityIndicator size="small" color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']} />
                    ) : (
                      <Text className={`text-base font-medium ${embedUrl.trim() ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        {t('insertMenu.embedButton')}
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}

              {/* マップ選択画面 */}
              {currentScreen === 'select-map' && (
                <View>
                  {isMapsLoading && (
                    <View className="py-6 items-center">
                      <ActivityIndicator size="small" color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']} />
                    </View>
                  )}
                  {!isMapsLoading && (!userMaps || userMaps.length === 0) && (
                    <View className="py-6 items-center">
                      <Ionicons
                        name="map-outline"
                        size={iconSizeNum['4xl']}
                        color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                      />
                      <Text className="mt-2 text-sm text-on-surface-variant">
                        {t('insertMenu.noMaps')}
                      </Text>
                      <Text className="mt-1 text-xs text-on-surface-variant">
                        {t('insertMenu.noMapsHint')}
                      </Text>
                    </View>
                  )}
                  {!isMapsLoading && userMaps && userMaps.length > 0 && (
                    <View className="gap-2">
                      {userMaps.map((map) => (
                        <Pressable
                          key={map.id}
                          onPress={() => handleSelectMap(map)}
                          className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-secondary"
                        >
                          {map.thumbnail_url ? (
                            <View className="rounded-lg overflow-hidden">
                              <OptimizedImage
                                url={map.thumbnail_url}
                                width={48}
                                height={48}
                                borderRadius={8}
                                quality={75}
                              />
                            </View>
                          ) : (
                            <View
                              className="h-12 w-12 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: isDarkMode
                                  ? colors.dark.secondary
                                  : colors.light.secondary,
                              }}
                            >
                              <Ionicons
                                name="map"
                                size={iconSizeNum.lg}
                                color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                              />
                            </View>
                          )}
                          <View className="flex-1">
                            <Text className="text-base text-on-surface" numberOfLines={1}>
                              {map.name}
                            </Text>
                            <Text className="text-xs text-on-surface-variant">
                              {t('insertMenu.spotCount', { count: map.spots_count })}
                            </Text>
                          </View>
                          {insertMode === 'spot' && (
                            <Ionicons
                              name="chevron-forward"
                              size={iconSizeNum.md}
                              color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* スポット選択画面 */}
              {currentScreen === 'select-spot' && (
                <View>
                  {isSpotsLoading && (
                    <View className="py-6 items-center">
                      <ActivityIndicator size="small" color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']} />
                    </View>
                  )}
                  {!isSpotsLoading && (!mapSpots || mapSpots.length === 0) && (
                    <View className="py-6 items-center">
                      <Ionicons
                        name="location-outline"
                        size={iconSizeNum['4xl']}
                        color={isDarkMode ? colors.primitive.gray[500] : colors.primitive.gray[400]}
                      />
                      <Text className="mt-2 text-sm text-on-surface-variant">
                        {t('insertMenu.noSpots')}
                      </Text>
                      <Text className="mt-1 text-xs text-on-surface-variant">
                        {t('insertMenu.noSpotsHint')}
                      </Text>
                    </View>
                  )}
                  {!isSpotsLoading && mapSpots && mapSpots.length > 0 && (
                    <View className="gap-2">
                      {mapSpots.map((spot) => {
                        const spotName = extractName(spot.master_spot?.name, 'ja') || spot.name || '';
                        const spotImage = spot.image_urls?.[0];
                        return (
                          <Pressable
                            key={spot.id}
                            onPress={() => handleSelectSpot(spot)}
                            className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-secondary"
                          >
                            {spotImage ? (
                              <View className="rounded-lg overflow-hidden">
                                <OptimizedImage
                                  url={spotImage}
                                  width={48}
                                  height={48}
                                  borderRadius={8}
                                  quality={75}
                                />
                              </View>
                            ) : (
                              <View
                                className="h-12 w-12 items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: isDarkMode
                                    ? colors.dark.secondary
                                    : colors.light.secondary,
                                }}
                              >
                                <Ionicons
                                  name="location"
                                  size={iconSizeNum.lg}
                                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
                                />
                              </View>
                            )}
                            <View className="flex-1">
                              <Text className="text-base text-on-surface" numberOfLines={1}>
                                {spotName}
                              </Text>
                              {spot.description && (
                                <Text className="text-xs text-on-surface-variant" numberOfLines={1}>
                                  {spot.description}
                                </Text>
                              )}
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
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
