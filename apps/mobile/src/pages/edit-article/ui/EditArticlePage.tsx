/**
 * 記事編集ページ
 *
 * マップ内の各スポットの一覧を表示し、
 * 各スポットをタップするとEditSpotArticlePageに遷移する
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PageHeader, PublicToggle, AddressPinIcon } from '@/shared/ui';
import { useMapArticle, useUpdateMap } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { extractPlainText } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress } from '@/shared/lib/utils/multilang.utils';

interface EditArticlePageProps {
  mapId: string;
}

export function EditArticlePage({ mapId }: EditArticlePageProps) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: articleData, isLoading } = useMapArticle(mapId, currentUserId);
  const { mutate: updateMap, isPending: isUpdatingMap } = useUpdateMap();

  // 記事の公開状態
  const [isArticlePublic, setIsArticlePublic] = useState(false);

  // 初期データをセット
  useEffect(() => {
    if (articleData?.map) {
      setIsArticlePublic(articleData.map.is_article_public ?? false);
    }
  }, [articleData?.map]);

  // 自分のマップかどうか
  const isOwner = currentUserId === articleData?.map.user_id;

  // 記事公開設定の変更ハンドラー
  const handleToggleArticlePublic = useCallback((value: boolean) => {
    setIsArticlePublic(value);
    updateMap(
      { id: mapId, is_article_public: value },
      {
        onSuccess: () => {
          // 成功時は何もしない（UIは既に更新されている）
        },
        onError: () => {
          // エラー時は元に戻す
          setIsArticlePublic(!value);
          Alert.alert(t('common.error'), t('editArticle.publicToggleError'));
        },
      }
    );
  }, [mapId, updateMap]);

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

  // 戻るボタン
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.title')} onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // データなし or 権限なし
  if (!articleData || !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('editArticle.title')} onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!articleData ? t('editArticle.notFound') : t('editArticle.noPermission')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title={t('editArticle.title')} onBack={handleBack} />

      <ScrollView className="flex-1">
        {/* ヒーロー画像 */}
        {articleData.map.thumbnail_url ? (
          <Image
            source={{ uri: articleData.map.thumbnail_url }}
            className="w-full h-40"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-40 items-center justify-center bg-muted dark:bg-dark-muted">
            <Ionicons name="map" size={48} color={colors.primary.DEFAULT} />
          </View>
        )}

        <View className="px-4 py-4">
          {/* マップタイトル */}
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
            {articleData.map.name}
          </Text>

          {/* 記事公開設定 */}
          <View className="mb-4">
            <PublicToggle
              value={isArticlePublic}
              onValueChange={handleToggleArticlePublic}
              disabled={isUpdatingMap}
              variant="compact"
            />
          </View>

          {/* マップ概要 */}
          {articleData.map.description && (
            <View className="mb-6">
              <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-6">
                {articleData.map.description}
              </Text>
            </View>
          )}

          {/* まえがきセクション */}
          <Pressable
            onPress={handleEditIntro}
            className="mb-6 pb-6 border-b border-border-light dark:border-dark-border-light active:opacity-70"
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text-outline" size={18} color={colors.primary.DEFAULT} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-2 flex-1">
                {t('editArticle.intro')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            </View>
            {extractPlainText(articleData.map.article_intro) ? (
              <Text
                className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-6"
                numberOfLines={3}
              >
                {extractPlainText(articleData.map.article_intro)}
              </Text>
            ) : (
              <View className="py-3 px-3 bg-muted dark:bg-dark-muted rounded-lg border border-dashed border-border dark:border-dark-border">
                <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
                  {t('editArticle.writeIntro')}
                </Text>
              </View>
            )}
          </Pressable>

          {/* スポット一覧 */}
          {articleData.spots.length > 0 ? (
            <View>
              {articleData.spots.map((spot, index) => {
                const firstImage = spot.images?.[0]?.cloud_path;
                const articleText = extractPlainText(spot.article_content);
                const hasArticle = articleText.length > 0;
                // JSONB型の住所を現在のlocaleで抽出
                const address = extractAddress(spot.master_spot?.google_short_address, locale)
                  || extractAddress(spot.google_short_address, locale);

                return (
                  <Pressable
                    key={spot.id}
                    onPress={() => handleEditSpot(spot.id)}
                    className="mb-6 pb-6 border-b border-border-light dark:border-dark-border-light active:opacity-70"
                  >
                    {/* セクション番号と一言メモ */}
                    <View className="flex-row items-center mb-2">
                      <Text className="text-foreground dark:text-dark-foreground font-bold text-base mr-2">
                        {index + 1}.
                      </Text>
                      <Text className="text-lg font-bold text-foreground dark:text-dark-foreground flex-1">
                        {spot.description}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                    </View>

                    {/* スポット画像 */}
                    {firstImage && (
                      <View className="mb-2 -mx-4 px-4">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {spot.images.map((image) => (
                            <Image
                              key={image.id}
                              source={{ uri: image.cloud_path || '' }}
                              className="w-48 h-36 rounded-lg mr-2"
                              resizeMode="cover"
                            />
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* 住所 */}
                    {address && (
                      <View className="flex-row items-center mb-3">
                        <AddressPinIcon size={14} color={colors.gray[400]} />
                        <Text
                          className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1"
                          numberOfLines={1}
                        >
                          {address}
                        </Text>
                      </View>
                    )}

                    {/* 記事プレビュー */}
                    {hasArticle ? (
                      <Text
                        className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-6"
                        numberOfLines={3}
                      >
                        {articleText}
                      </Text>
                    ) : (
                      <View className="py-3 px-3 bg-muted dark:bg-dark-muted rounded-lg border border-dashed border-border dark:border-dark-border">
                        <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
                          {t('editArticle.writeDescription')}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="location-outline" size={48} color={colors.gray[300]} />
              <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
                {t('editArticle.noSpots')}
              </Text>
            </View>
          )}

          {/* あとがきセクション */}
          <Pressable
            onPress={handleEditOutro}
            className="mt-2 mb-6 active:opacity-70"
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="chatbox-ellipses-outline" size={18} color={colors.primary.DEFAULT} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-2 flex-1">
                {t('editArticle.outro')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            </View>
            {extractPlainText(articleData.map.article_outro) ? (
              <Text
                className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-6"
                numberOfLines={3}
              >
                {extractPlainText(articleData.map.article_outro)}
              </Text>
            ) : (
              <View className="py-3 px-3 bg-muted dark:bg-dark-muted rounded-lg border border-dashed border-border dark:border-dark-border">
                <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
                  {t('editArticle.writeOutro')}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* 下部余白 */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
