/**
 * スポット記事ページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせのみ
 * Instagram風のレイアウトでスポットの詳細をブログ形式で紹介
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentTab, shareSpot, createGoogleMapsMenuItem } from '@/shared/lib';
import { iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotWithDetails } from '@/entities/user-spot';
import { useCurrentUserId } from '@/entities/user';
import { useSpotBookmarkMenu } from '@/features/spot-bookmark';
import { useSpotReport, useSpotDelete } from '@/features/spot-actions';
import { useBlockAction } from '@/features/block-user';
import { SpotArticleContent } from '@/widgets/spot-article-content';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

interface SpotArticlePageProps {
  spotId: string;
}

export function SpotArticlePage({ spotId }: SpotArticlePageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: spot, isLoading } = useSpotWithDetails(spotId, currentUserId);

  // コメントモーダル
  const { isVisible: isCommentModalVisible, target: commentTarget, openSpotCommentModal, closeCommentModal } = useCommentModal();

  // 自分のスポットかどうか
  const isOwner = currentUserId === spot?.user_id;

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useSpotBookmarkMenu({
    spotId,
    currentUserId,
  });

  // 削除（オーナー向け）
  const { handleDelete } = useSpotDelete({ onSuccess: () => router.back() });

  // スポット編集へ遷移
  const handleEditSpotPress = useCallback(() => {
    router.push(`/edit-spot/${spotId}`);
  }, [router, spotId]);

  // 共有
  const handleShare = useCallback(async () => {
    await shareSpot(spot?.user?.username || '', spot?.map_id || '', spotId);
  }, [spot?.user?.username, spot?.map_id, spotId]);

  // 通報
  const { handleReport: reportSpot } = useSpotReport({ currentUserId });
  const handleReport = useCallback(() => {
    reportSpot(spotId);
  }, [reportSpot, spotId]);

  // ブロック
  const { handleBlock } = useBlockAction({ currentUserId, onSuccess: () => router.back() });
  const handleBlockUser = useCallback(() => {
    if (spot?.user_id) handleBlock(spot.user_id);
  }, [handleBlock, spot?.user_id]);

  // Google Mapsメニュー項目
  const googleMapsMenuItem = useMemo(() => {
    if (!spot) return null;
    const lat = spot.master_spot?.latitude ?? spot.latitude ?? 0;
    const lng = spot.master_spot?.longitude ?? spot.longitude ?? 0;
    if (!lat && !lng) return null;
    return createGoogleMapsMenuItem({
      latitude: lat,
      longitude: lng,
      googlePlaceId: spot.master_spot?.google_place_id,
      label: t('common.google'),
    });
  }, [spot, t]);

  // ポップアップメニューのアイテム
  const menuItems = useMemo((): PopupMenuItem[] => {
    if (isOwner) {
      // オーナー向けメニュー
      const items: PopupMenuItem[] = [
        {
          id: 'edit',
          label: t('common.edit'),
          icon: 'create-outline',
          onPress: handleEditSpotPress,
        },
        {
          id: 'delete',
          label: t('common.delete'),
          icon: 'trash-outline',
          destructive: true,
          onPress: () => handleDelete(spotId),
        },
      ];
      if (googleMapsMenuItem) items.push(googleMapsMenuItem);
      items.push({
        id: 'share',
        label: t('common.share'),
        icon: 'share-outline',
        onPress: handleShare,
      });
      return items;
    }
    // 非オーナー向けメニュー
    const items: PopupMenuItem[] = [bookmarkMenuItem];
    if (googleMapsMenuItem) items.push(googleMapsMenuItem);
    return [
      ...items,
      {
        id: 'share',
        label: t('common.share'),
        icon: 'share-outline',
        onPress: handleShare,
      },
      {
        id: 'report',
        label: t('common.report'),
        icon: 'flag-outline',
        onPress: handleReport,
      },
      {
        id: 'block',
        label: t('menu.blockUser'),
        icon: 'ban-outline',
        destructive: true,
        onPress: handleBlockUser,
      },
    ];
  }, [isOwner, t, handleEditSpotPress, handleDelete, googleMapsMenuItem, bookmarkMenuItem, handleShare, handleReport, handleBlockUser, spotId]);

  // マップ画面へ遷移
  const handleGoToMapPress = useCallback(() => {
    if (spot?.map_id) {
      router.push(`/(tabs)/${currentTab}/maps/${spot.map_id}/spots/${spotId}`);
    }
  }, [router, currentTab, spot?.map_id, spotId]);

  // ユーザープロフィールへ遷移
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // マップ記事へ遷移
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
  }, [router, currentTab]);

  // コメントモーダルを開く
  const handleOpenCommentModal = useCallback((options?: { focusCommentId?: string; autoFocus?: boolean }) => {
    openSpotCommentModal(spotId, options);
  }, [openSpotCommentModal, spotId]);

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // タグタップ時（タグ検索ページへ遷移）
  const handleTagPress = useCallback((tagName: string) => {
    router.push(`/(tabs)/${currentTab}/search?tag=${encodeURIComponent(tagName)}` as Href);
  }, [router, currentTab]);

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
  if (!spot) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="document-text-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4">
            {t('article.notFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // スポットが非公開で、オーナーでもない場合はアクセス拒否
  if (spot.is_public === false && !isOwner) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="lock-closed-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4">{t('article.private')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView testID="spot-article-screen" className="flex-1 bg-surface" edges={['bottom']}>
      <PageHeader
        title={t('article.article')}
        rightComponent={
          <View className="flex-row items-center gap-4">
            {/* マップを見るボタン（マップに所属している場合のみ） */}
            {spot.map_id && (
              <Pressable
                onPress={handleGoToMapPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="map-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
              </Pressable>
            )}
            {/* 三点リーダメニュー */}
            <PopupMenu
              items={menuItems}
              triggerSize={iconSizeNum.lg}
              respectSafeArea
            />
          </View>
        }
      />

      <SpotArticleContent
        spot={spot}
        currentUserId={currentUserId}
        onUserPress={handleUserPress}
        onMapPress={handleMapPress}
        onOpenCommentModal={handleOpenCommentModal}
        onTagPress={handleTagPress}
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

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
    </SafeAreaView>
  );
}
