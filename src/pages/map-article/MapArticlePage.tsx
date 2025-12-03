/**
 * マップ記事ページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせのみ
 * マップの説明と各スポットをブログ形式で紹介
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PageHeader, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import { useMapArticle } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { MapArticleContent } from '@/widgets/map-article-content';

interface MapArticlePageProps {
  mapId: string;
}

export function MapArticlePage({ mapId }: MapArticlePageProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: articleData, isLoading } = useMapArticle(mapId, currentUserId);

  // 自分のマップかどうか
  const isOwner = currentUserId === articleData?.map.user_id;

  // マップ編集へ遷移
  const handleEditMapPress = useCallback(() => {
    router.push(`/edit-map?id=${mapId}`);
  }, [router, mapId]);

  // 記事編集へ遷移
  const handleEditArticlePress = useCallback(() => {
    router.push(`/edit-article?id=${mapId}`);
  }, [router, mapId]);

  // このマップのマップ画面へ遷移
  const handleGoToMapPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}`);
  }, [router, currentTab, mapId]);

  // ユーザープロフィールへ遷移
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // スポット詳細へ遷移
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}`);
  }, [router, currentTab]);

  // コメントページへ遷移
  const handleCommentsPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/comments/maps/${mapId}`);
  }, [router, currentTab, mapId]);

  // 他のマップ詳細へ遷移
  const handleMapPress = useCallback((targetMapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${targetMapId}`);
  }, [router, currentTab]);

  // ヘッダーメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [
      {
        id: 'map',
        label: 'マップを見る',
        icon: 'map-outline',
        onPress: handleGoToMapPress,
      },
    ];

    if (isOwner) {
      items.push(
        {
          id: 'edit-article',
          label: '記事を編集',
          icon: 'document-text-outline',
          onPress: handleEditArticlePress,
        },
        {
          id: 'edit-map',
          label: 'マップを編集',
          icon: 'create-outline',
          onPress: handleEditMapPress,
        }
      );
    }

    return items;
  }, [isOwner, handleGoToMapPress, handleEditArticlePress, handleEditMapPress]);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <PageHeader title="記事" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // データなし
  if (!articleData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <PageHeader title="記事" />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="document-text-outline" size={48} color={colors.gray[300]} />
          <Text className="text-gray-400 mt-4">記事が見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 記事が非公開で、オーナーでもない場合はアクセス拒否
  const isArticlePublic = articleData.map.is_article_public ?? false;
  if (!isArticlePublic && !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <PageHeader title="記事" />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={48} color={colors.gray[300]} />
          <Text className="text-gray-400 mt-4">この記事は非公開です</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <PageHeader
        title="記事"
        rightComponent={
          <PopupMenu items={menuItems} triggerSize={22} triggerColor={colors.gray[600]} />
        }
      />

      <MapArticleContent
        articleData={articleData}
        currentUserId={currentUserId}
        onUserPress={handleUserPress}
        onSpotPress={handleSpotPress}
        onCommentsPress={handleCommentsPress}
        onMapPress={handleMapPress}
      />
    </SafeAreaView>
  );
}
