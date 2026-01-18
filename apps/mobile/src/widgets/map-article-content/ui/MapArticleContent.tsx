/**
 * マップ記事コンテンツ Widget
 *
 * マップ記事の本文を表示するメインWidget
 * 複数のコンポーネントを組み合わせて記事全体を構成
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert, shareMap } from '@/shared/lib';
import { ImageViewerModal, useImageViewer, RichTextRenderer, LocationPinIcon } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useToggleMapLike } from '@/entities/like';
import { useMapComments } from '@/entities/comment';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { useUserMaps } from '@/entities/map';
import { useMapTags } from '@/entities/tag';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import type { MapArticleData } from '@/shared/types';
import { ArticleSpotSection } from './ArticleSpotSection';
import { ArticleTableOfContents } from './ArticleTableOfContents';
import { ArticleAuthorSection } from './ArticleAuthorSection';
import { ArticleFooterActions } from './ArticleFooterActions';
import { AuthorOtherMaps } from './AuthorOtherMaps';
import { ArticleCommentPreview } from './ArticleCommentPreview';

interface MapArticleContentProps {
  articleData: MapArticleData;
  currentUserId: string | null;
  onUserPress: (userId: string) => void;
  onSpotPress: (spotId: string) => void;
  /** コメントモーダルを開く */
  onOpenCommentModal: (options?: { focusCommentId?: string; autoFocus?: boolean }) => void;
  onMapPress: (mapId: string) => void;
}

export function MapArticleContent({
  articleData,
  currentUserId,
  onUserPress,
  onSpotPress,
  onOpenCommentModal,
  onMapPress,
}: MapArticleContentProps) {
  const { t, locale } = useI18n();
  const { map, spots } = articleData;

  // 画像ビューアー
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImage, openImages, closeImage } = useImageViewer();

  // いいね状態（mapオブジェクトに含まれるis_likedを使用）
  const isLiked = map.is_liked ?? false;
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, map.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  // コメント取得（プレビュー用）
  const { data: commentsData } = useMapComments(map.id, currentUserId);
  // 最初のページの最初の3件のみを表示
  const comments = (commentsData?.pages[0] ?? []).slice(0, 3);

  // タグを中間テーブルから取得
  const { data: mapTags = [] } = useMapTags(map.id);

  // 記事投稿者の他のマップ（現在のマップ以外を最大4件）
  const { data: authorMaps = [] } = useUserMaps(map.user_id);
  const otherMaps = useMemo(
    () => authorMaps.filter((m) => m.id !== map.id).slice(0, 4),
    [authorMaps, map.id]
  );

  // スクロール用のref
  const scrollViewRef = useRef<ScrollView>(null);
  const spotPositions = useRef<Record<string, number>>({});
  const heroImageHeight = useRef<number>(0);
  const spotsContainerY = useRef<number>(0);

  // 目次タップでスポットにスクロール
  const handleTocPress = useCallback((spotId: string) => {
    const y = spotPositions.current[spotId];
    if (y !== undefined && scrollViewRef.current) {
      const totalY = heroImageHeight.current + spotsContainerY.current + y;
      scrollViewRef.current.scrollTo({ y: totalY, animated: true });
    }
  }, []);

  // いいね処理
  const handleLikePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, mapId: map.id });
  }, [currentUserId, map.id, isTogglingLike, toggleLike]);

  // ブックマーク処理
  const handleBookmarkPress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    setIsFolderModalVisible(true);
  }, [currentUserId]);

  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    addBookmark({ userId: currentUserId, mapId: map.id, folderId });
  }, [currentUserId, map.id, addBookmark]);

  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    removeFromFolder({ userId: currentUserId, mapId: map.id, folderId });
  }, [currentUserId, map.id, removeFromFolder]);

  // 共有処理
  const handleSharePress = useCallback(async () => {
    await shareMap(map.id);
  }, [map.id]);

  return (
    <>
      <ScrollView ref={scrollViewRef} className="flex-1">
        {/* ヒーロー画像 */}
        {map.thumbnail_url ? (
          <Pressable
            onPress={() => openImage(map.thumbnail_url!)}
            onLayout={(e) => {
              heroImageHeight.current = e.nativeEvent.layout.height;
            }}
          >
            <Image
              source={{ uri: map.thumbnail_url }}
              className="w-full h-56"
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <View
            className="w-full h-56 items-center justify-center bg-muted dark:bg-dark-muted"
            onLayout={(e) => {
              heroImageHeight.current = e.nativeEvent.layout.height;
            }}
          >
            <Ionicons name="map" size={64} color={colors.primary.DEFAULT} />
          </View>
        )}

        <View className="px-4 py-4">
          {/* マップタイトル */}
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
            {map.name}
          </Text>

          {/* 作成者情報 + フォローボタン */}
          <View className="mb-3">
            <ArticleAuthorSection
              user={map.user}
              userId={map.user_id}
              size="small"
              createdAt={formatRelativeTime(map.created_at, locale)}
              onUserPress={onUserPress}
            />
          </View>

          {/* スポット数 + いいね */}
          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center">
              <LocationPinIcon size={18} color={colors.text.secondary} />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {t('article.spotsCount', { count: map.spots_count })}
              </Text>
            </View>

            <Pressable
              onPress={handleLikePress}
              disabled={isTogglingLike}
              className="flex-row items-center"
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={isLiked ? '#EF4444' : colors.text.secondary}
              />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                {map.likes_count}
              </Text>
            </Pressable>
          </View>

          {/* マップ説明（導入文） */}
          {map.description && (
            <View className="mb-6 py-4">
              <Text className="text-base text-foreground dark:text-dark-foreground leading-6">
                {map.description}
              </Text>
            </View>
          )}

          {/* 目次 */}
          <ArticleTableOfContents
            spots={spots}
            onSpotPress={handleTocPress}
          />

          {/* まえがき */}
          {map.article_intro && (
            <View className="mb-6">
              <RichTextRenderer
                content={map.article_intro}
                textClassName="text-base text-foreground dark:text-dark-foreground leading-6"
              />
            </View>
          )}

          {/* スポット一覧 */}
          {spots.length > 0 ? (
            <View
              onLayout={(e) => {
                spotsContainerY.current = e.nativeEvent.layout.y;
              }}
            >
              {spots.map((spot, index) => (
                <View
                  key={spot.id}
                  onLayout={(e) => {
                    spotPositions.current[spot.id] = e.nativeEvent.layout.y;
                  }}
                >
                  <ArticleSpotSection
                    spot={spot}
                    index={index + 1}
                    onPress={() => onSpotPress(spot.id)}
                    onImagePress={openImages}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="location-outline" size={48} color={colors.gray[300]} />
              <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">{t('article.noSpots')}</Text>
            </View>
          )}

          {/* あとがき */}
          {map.article_outro && (
            <View className="mt-6 mb-4">
              <RichTextRenderer
                content={map.article_outro}
                textClassName="text-base text-foreground dark:text-dark-foreground leading-6"
              />
            </View>
          )}

          {/* タグ */}
          {mapTags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-4">
              {mapTags.map((tag) => (
                <View
                  key={tag.id}
                  className="bg-muted dark:bg-dark-muted rounded-full px-3 py-1.5"
                >
                  <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                    #{tag.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* フッターアクション（note風） */}
          <View className="py-6 mt-6">
            {/* アクションボタン */}
            <View className="mb-6">
              <ArticleFooterActions
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likesCount={map.likes_count}
                commentsCount={map.comments_count}
                isTogglingLike={isTogglingLike}
                onLikePress={handleLikePress}
                onCommentPress={() => onOpenCommentModal()}
                onBookmarkPress={handleBookmarkPress}
                onSharePress={handleSharePress}
              />
            </View>

            {/* 著者情報 + フォローボタン */}
            <ArticleAuthorSection
              user={map.user}
              userId={map.user_id}
              size="medium"
              onUserPress={onUserPress}
            />

            {/* この著者の他のマップ */}
            <AuthorOtherMaps
              maps={otherMaps}
              onMapPress={onMapPress}
            />

            {/* コメントセクション */}
            <ArticleCommentPreview
              comments={comments}
              totalCount={map.comments_count}
              onUserPress={onUserPress}
              onOpenCommentModal={onOpenCommentModal}
            />
          </View>
        </View>
      </ScrollView>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="maps"
          mapId={map.id}
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}

      {/* 画像ビューアーモーダル */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        images={viewerImages}
        initialIndex={initialIndex}
        onClose={closeImage}
      />
    </>
  );
}
