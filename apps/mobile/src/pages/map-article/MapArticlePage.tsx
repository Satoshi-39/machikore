/**
 * マップ記事ページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせのみ
 * マップの説明と各スポットをブログ形式で紹介
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { PageHeader, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useMapArticle } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { useRecordView } from '@/entities/view-history';
import { useMapReport } from '@/features/map-actions';
import { MapArticleContent } from '@/widgets/map-article-content';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';

interface MapArticlePageProps {
  mapId: string;
}

export function MapArticlePage({ mapId }: MapArticlePageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: articleData, isLoading } = useMapArticle(mapId, currentUserId);
  const { mutate: recordView } = useRecordView();

  // コメントモーダル
  const { isVisible: isCommentModalVisible, target: commentTarget, openMapCommentModal, closeCommentModal } = useCommentModal();

  // 自分のマップかどうか
  const isOwner = currentUserId === articleData?.map.user_id;

  // 記事を開いた時に閲覧履歴を記録（ログイン中かつ自分以外のマップかつ公開中の場合）
  useEffect(() => {
    if (
      currentUserId &&
      articleData?.map &&
      articleData.map.user_id !== currentUserId &&
      articleData.map.is_public
    ) {
      recordView({ mapId });
    }
  }, [currentUserId, articleData?.map, mapId, recordView]);

  // 通報
  const { handleReport } = useMapReport({ currentUserId });

  // 記事編集へ遷移
  const handleEditArticlePress = useCallback(() => {
    router.push(`/edit-article/${mapId}`);
  }, [router, mapId]);

  // このマップのマップ画面へ遷移
  const handleGoToMapPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}`);
  }, [router, currentTab, mapId]);

  // ユーザープロフィールへ遷移
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // スポット記事ページへ遷移
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/spots/${spotId}` as Href);
  }, [router, currentTab]);

  // コメントモーダルを開く
  const handleOpenCommentModal = useCallback((options?: { focusCommentId?: string; autoFocus?: boolean }) => {
    openMapCommentModal(mapId, options);
  }, [openMapCommentModal, mapId]);

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // 他のマップ詳細へ遷移（spotIdがある場合はスポット詳細カードを開く）
  const handleMapPress = useCallback((targetMapId: string, spotId?: string) => {
    const query = spotId ? `?spotId=${spotId}` : '';
    router.push(`/(tabs)/${currentTab}/maps/${targetMapId}${query}` as Href);
  }, [router, currentTab]);

  // スポット作成画面へ遷移（オーナーのみ）
  // マップ画面に遷移して検索モードを開く（クエリパラメータで制御）
  const handleCreateSpotPress = useCallback(() => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}?openSearch=true` as Href);
  }, [router, currentTab, mapId]);

  // タグタップ時（タグ検索ページへ遷移）
  const handleTagPress = useCallback((tagName: string) => {
    router.push(`/(tabs)/${currentTab}/search?tag=${encodeURIComponent(tagName)}` as Href);
  }, [router, currentTab]);

  // スポット編集へ遷移（オーナーのみ）
  const handleEditSpotPress = useCallback((spotId: string) => {
    router.push(`/edit-spot/${spotId}`);
  }, [router]);

  // ヘッダーメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (isOwner) {
      return [{
        id: 'edit-article',
        label: t('article.editArticle'),
        icon: 'document-text-outline',
        onPress: handleEditArticlePress,
      }];
    }
    // 非オーナー向けメニュー（通報）
    return [{
      id: 'report',
      label: t('menu.report'),
      icon: 'flag-outline',
      onPress: () => handleReport(mapId),
      destructive: true,
    }];
  }, [isOwner, handleEditArticlePress, handleReport, mapId, t]);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </SafeAreaView>
    );
  }

  // データなし
  if (!articleData) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="document-text-outline" size={iconSizeNum['3xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4">{t('article.notFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // マップが非公開で、オーナーでもない場合はアクセス拒否
  if (!articleData.map.is_public && !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={iconSizeNum['3xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4">{t('article.private')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
      <PageHeader
        title={t('article.article')}
        rightComponent={
          <View className="flex-row items-center gap-2">
            {/* マップを見るボタン */}
            <TouchableOpacity onPress={handleGoToMapPress} className="p-1">
              <Ionicons name="map-outline" size={iconSizeNum.lg} className="text-gray-600" />
            </TouchableOpacity>
            {/* 三点リーダメニュー（オーナー: 編集、非オーナー: 通報） */}
            {menuItems.length > 0 && (
              <PopupMenu items={menuItems} triggerSize={22} respectSafeArea />
            )}
          </View>
        }
      />

      <MapArticleContent
        articleData={articleData}
        currentUserId={currentUserId}
        onUserPress={handleUserPress}
        onSpotPress={handleSpotPress}
        onOpenCommentModal={handleOpenCommentModal}
        onMapPress={handleMapPress}
        onTagPress={handleTagPress}
        onCreateSpotPress={isOwner ? handleCreateSpotPress : undefined}
        onEditSpotPress={isOwner ? handleEditSpotPress : undefined}
      />

      {/* コメントモーダル */}
      {commentTarget && (
        <CommentModalSheet
          visible={isCommentModalVisible}
          type={commentTarget.type}
          targetId={commentTarget.id}
          onClose={closeCommentModal}
          onUserPress={handleCommentUserPress}
          autoFocus={commentTarget.options?.autoFocus}
          focusCommentId={commentTarget.options?.focusCommentId}
        />
      )}
    </SafeAreaView>
  );
}
