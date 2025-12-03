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
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { formatRelativeTime, showLoginRequiredAlert } from '@/shared/lib';
import { ImageViewerModal, useImageViewer, CommentInputModal } from '@/shared/ui';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';
import { useMapComments } from '@/entities/comment';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { useUserMaps } from '@/entities/map';
import { useUser } from '@/entities/user';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { useCommentActions } from '@/features/comment-actions';
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
  onCommentsPress: () => void;
  onMapPress: (mapId: string) => void;
}

export function MapArticleContent({
  articleData,
  currentUserId,
  onUserPress,
  onSpotPress,
  onCommentsPress,
  onMapPress,
}: MapArticleContentProps) {
  const { map, spots } = articleData;

  // 画像ビューアー
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImage, openImages, closeImage } = useImageViewer();

  // いいね状態
  const { data: isLiked = false } = useCheckMapLiked(currentUserId, map.id);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, map.id);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  // コメント取得（プレビュー用に3件）
  const { data: comments = [] } = useMapComments(map.id, 3, 0, currentUserId);

  // 現在のユーザー情報（編集モーダル用）
  const { data: currentUser } = useUser(currentUserId ?? null);

  // コメント操作フック（編集・削除・いいね用）
  const {
    editingComment,
    editText,
    setEditText,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDelete,
    handleLike: handleCommentLike,
    isUpdatingComment,
  } = useCommentActions({ mapId: map.id, currentUserId });

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
    try {
      const url = `machikore://maps/${map.id}`;
      await Share.share(Platform.select({
        ios: { message: `${map.name || 'マップ'}をチェック！`, url },
        default: { message: `${map.name || 'マップ'}をチェック！\n${url}` },
      })!);
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [map.name, map.id]);

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
            className="w-full h-56 items-center justify-center bg-gray-100"
            onLayout={(e) => {
              heroImageHeight.current = e.nativeEvent.layout.height;
            }}
          >
            <Ionicons name="map" size={64} color={colors.primary.DEFAULT} />
          </View>
        )}

        <View className="px-4 py-4">
          {/* マップタイトル */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {map.name}
          </Text>

          {/* 作成者情報 + フォローボタン */}
          <View className="mb-3">
            <ArticleAuthorSection
              user={map.user}
              userId={map.user_id}
              size="small"
              createdAt={formatRelativeTime(map.created_at)}
              onUserPress={onUserPress}
            />
          </View>

          {/* スポット数 + いいね */}
          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color={colors.text.secondary} />
              <Text className="text-sm text-gray-500 ml-1">
                {map.spots_count}スポット
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
              <Text className="text-sm text-gray-500 ml-1">
                {map.likes_count}
              </Text>
            </Pressable>
          </View>

          {/* マップ説明（導入文） */}
          {map.description && (
            <View className="mb-6 py-4">
              <Text className="text-base text-gray-700 leading-6">
                {map.description}
              </Text>
            </View>
          )}

          {/* 目次 */}
          <ArticleTableOfContents
            spots={spots}
            onSpotPress={handleTocPress}
          />

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
              <Text className="text-gray-400 mt-4">まだスポットがありません</Text>
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
                onCommentPress={onCommentsPress}
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
              mapId={map.id}
              currentUserId={currentUserId}
              onViewAllPress={onCommentsPress}
              onUserPress={onUserPress}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleCommentLike}
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
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}

      {/* コメント編集モーダル */}
      <CommentInputModal
        visible={!!editingComment}
        onClose={handleEditCancel}
        avatarUrl={currentUser?.avatar_url}
        inputText={editText}
        onChangeText={setEditText}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdatingComment}
        isEditing
      />

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
