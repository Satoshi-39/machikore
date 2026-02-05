/**
 * 記事編集ページ
 *
 * マップ内の各スポットの一覧を表示し、
 * 各スポットをタップするとEditSpotArticlePageに遷移する
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getThumbnailHeight, colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PageHeader, AddressPinIcon, Button, buttonTextVariants, OptimizedImage, MapThumbnail } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import { useMapArticle, useMapStore } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { extractPlainText } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

interface EditArticlePageProps {
  mapId: string;
}

export function EditArticlePage({ mapId }: EditArticlePageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { width: screenWidth } = useWindowDimensions();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const { data: articleData, isLoading } = useMapArticle(mapId, currentUserId);

  // 自分のマップかどうか
  const isOwner = currentUserId === articleData?.map.user_id;

  // スポットの記事編集ページに遷移
  const handleEditSpot = useCallback((spotId: string) => {
    router.push(`/edit-spot-article/${spotId}`);
  }, [router]);

  // まえがき編集ページに遷移
  const handleEditIntro = useCallback(() => {
    router.push(`/edit-article-intro/${mapId}`);
  }, [router, mapId]);

  // あとがき編集ページに遷移
  const handleEditOutro = useCallback(() => {
    router.push(`/edit-article-outro/${mapId}`);
  }, [router, mapId]);

  // スポット追加方法選択モーダルを開く
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const setSourceTab = useMapStore((state) => state.setSourceTab);
  const handleCreateSpot = useCallback(() => {
    setSelectedMapId(mapId);
    setSourceTab(currentTab);
    router.push('/create-spot-method');
  }, [router, mapId, currentTab, setSelectedMapId, setSourceTab]);

  // 戻るボタン
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('editArticle.title')} onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </SafeAreaView>
    );
  }

  // データなし or 権限なし
  if (!articleData || !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <PageHeader title={t('editArticle.title')} onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4">
            {!articleData ? t('editArticle.notFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
      <PageHeader title={t('editArticle.title')} onBack={handleBack} />

      <ScrollView className="flex-1">
        {/* ヒーロー画像 */}
        <MapThumbnail
          url={articleData.map.thumbnail_url}
          crop={articleData.map.thumbnail_crop}
          width={screenWidth}
          height={getThumbnailHeight(screenWidth)}
          borderRadius={0}
          defaultIconSize={64}
        />

        <View className="px-4 py-4">
          {/* マップタイトル */}
          <Text className="text-2xl font-bold text-on-surface mb-4">
            {articleData.map.name}
          </Text>

          {/* マップ概要 */}
          {articleData.map.description && (
            <View className="mb-6">
              <Text className="text-base text-on-surface-variant leading-6">
                {articleData.map.description}
              </Text>
            </View>
          )}

          {/* セクション区切り線 */}
          <View className="border-b-thin border-outline-variant mb-6" />

          {/* まえがきセクション */}
          <Pressable
            onPress={handleEditIntro}
            className="mb-6 active:opacity-70"
          >
            <Text className="text-lg font-bold text-on-surface mb-2">
              {t('editArticle.intro')}
            </Text>
            {extractPlainText(articleData.map.article_intro) ? (
              <Text
                className="text-base text-on-surface-variant leading-6"
                numberOfLines={3}
              >
                {extractPlainText(articleData.map.article_intro)}
              </Text>
            ) : (
              <Text className="text-sm text-on-surface-variant text-center py-8">
                {t('editArticle.writeIntro')}
              </Text>
            )}
          </Pressable>

          {/* セクション区切り線 */}
          <View className="border-b-thin border-outline-variant mb-6" />

          {/* スポット一覧 */}
          {articleData.spots.length > 0 ? (
            <View>
              {articleData.spots.map((spot, index) => {
                const firstImage = spot.images?.[0]?.cloud_path;
                const articleText = extractPlainText(spot.article_content);
                const hasArticle = articleText.length > 0;
                // 住所（spot.languageで抽出）
                const spotLanguage = spot.language || 'ja';
                const address = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
                  || extractAddress(spot.google_short_address, spotLanguage);
                // スポット名を取得（master_spotがあればmaster_spot.name（JSONB）、なければspot.name（TEXT））
                const spotName = (spot.master_spot?.name ? extractName(spot.master_spot.name, spotLanguage) : null)
                  || spot.name
                  || spot.description;

                const isLast = index === articleData.spots.length - 1;

                return (
                  <Pressable
                    key={spot.id}
                    onPress={() => handleEditSpot(spot.id)}
                    className={`mb-6 active:opacity-70 ${isLast ? '' : 'pb-6 border-b-thin border-outline-variant'}`}
                  >
                    {/* セクション番号とスポット名 */}
                    <View className="flex-row mb-2">
                      <Text className="text-on-surface font-bold text-base mr-2">
                        {index + 1}.
                      </Text>
                      <Text className="text-lg font-bold text-on-surface flex-1 flex-shrink">
                        {spotName}
                      </Text>
                    </View>

                    {/* スポット画像 */}
                    {firstImage && (
                      <View className="mb-2 -mx-4 px-4">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {spot.images.map((image) => (
                            <View key={image.id} style={{ marginRight: 8 }}>
                              <OptimizedImage
                                url={image.cloud_path}
                                width={192}
                                height={144}
                                borderRadius={8}
                                quality={75}
                              />
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* 住所 */}
                    {address && (
                      <View className="flex-row items-center mb-3">
                        <AddressPinIcon size={iconSizeNum.xs} color={themeColors['on-surface-variant']} />
                        <Text
                          className="text-sm text-on-surface-variant ml-1"
                          numberOfLines={1}
                        >
                          {address}
                        </Text>
                      </View>
                    )}

                    {/* 記事プレビュー */}
                    {hasArticle ? (
                      <Text
                        className="text-base text-on-surface-variant leading-6"
                        numberOfLines={3}
                      >
                        {articleText}
                      </Text>
                    ) : (
                      <Text className="text-sm text-on-surface-variant text-center py-8">
                        {t('editArticle.writeDescription')}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="location-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
              <Text className="text-on-surface-variant mt-4">
                {t('editArticle.noSpots')}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={handleCreateSpot}
                className="mt-4"
              >
                <View className="flex-row items-center">
                  <Ionicons name="add" size={iconSizeNum.sm} className="text-primary" />
                  <Text className={`${buttonTextVariants({ size: 'sm', variant: 'outline' })} ml-1`}>
                    {t('article.createSpot')}
                  </Text>
                </View>
              </Button>
            </View>
          )}

          {/* セクション区切り線 */}
          <View className="border-b-thin border-outline-variant mb-6" />

          {/* あとがきセクション */}
          <Pressable
            onPress={handleEditOutro}
            className="mb-6 active:opacity-70"
          >
            <Text className="text-lg font-bold text-on-surface mb-2">
              {t('editArticle.outro')}
            </Text>
            {extractPlainText(articleData.map.article_outro) ? (
              <Text
                className="text-base text-on-surface-variant leading-6"
                numberOfLines={3}
              >
                {extractPlainText(articleData.map.article_outro)}
              </Text>
            ) : (
              <Text className="text-sm text-on-surface-variant text-center py-8">
                {t('editArticle.writeOutro')}
              </Text>
            )}
          </Pressable>

          {/* セクション区切り線 */}
          <View className="border-b-thin border-outline-variant" />
        </View>

        {/* 下部余白 */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
