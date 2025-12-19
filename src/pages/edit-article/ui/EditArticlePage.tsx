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
import { PageHeader, PublicToggle } from '@/shared/ui';
import { useMapArticle, useUpdateMap } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { extractPlainText } from '@/shared/types';

interface EditArticlePageProps {
  mapId: string;
}

export function EditArticlePage({ mapId }: EditArticlePageProps) {
  const router = useRouter();
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
          Alert.alert('エラー', '公開設定の変更に失敗しました');
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
        <PageHeader title="記事を編集" onBack={handleBack} />
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
        <PageHeader title="記事を編集" onBack={handleBack} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {!articleData ? '記事が見つかりません' : '編集権限がありません'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title="記事を編集" onBack={handleBack} />

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
                まえがき
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
                  タップしてまえがきを書く
                </Text>
              </View>
            )}
          </Pressable>

          {/* スポット一覧 */}
          {articleData.spots.length > 0 ? (
            <View>
              {articleData.spots.map((spot, index) => {
                const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
                const firstImage = spot.images?.[0]?.cloud_path;
                const articleText = extractPlainText(spot.article_content);
                const hasArticle = articleText.length > 0;
                const address = spot.master_spot?.google_short_address || spot.google_short_address;

                return (
                  <Pressable
                    key={spot.id}
                    onPress={() => handleEditSpot(spot.id)}
                    className="mb-6 pb-6 border-b border-border-light dark:border-dark-border-light active:opacity-70"
                  >
                    {/* セクション番号とスポット名 */}
                    <View className="flex-row items-center mb-2">
                      <Text className="text-foreground dark:text-dark-foreground font-bold text-base mr-2">
                        {index + 1}.
                      </Text>
                      <Text className="text-lg font-bold text-foreground dark:text-dark-foreground flex-1">
                        {spotName}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                    </View>

                    {/* 一言メモ */}
                    {spot.description && (
                      <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
                        {spot.description}
                      </Text>
                    )}

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
                        <Ionicons name="location-outline" size={14} color={colors.gray[400]} />
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
                          タップして紹介文を書く
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
                まだスポットがありません
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
                あとがき
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
                  タップしてあとがきを書く
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
