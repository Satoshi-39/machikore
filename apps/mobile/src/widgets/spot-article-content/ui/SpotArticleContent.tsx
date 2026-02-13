/**
 * スポット記事コンテンツ Widget
 *
 * スポット情報を前面に押し出すレイアウト
 * - スポット名・住所
 * - 著者情報（アバター、ユーザー名、日付）
 * - サムネイル画像（thumbnail_image_id優先、未設定ならorder_index最小の画像にフォールバック）
 * - 一言（description）
 * - アクションバー（いいね、コメント、共有、保存）
 * - 記事本文
 * - コメントプレビュー
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  type LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  iconSizeNum,
  getThumbnailHeight,
} from '@/shared/config';
import { formatRelativeTime } from '@/shared/lib';
import {
  ImageViewerModal,
  useImageViewer,
  RichTextRenderer,
  AddressPinIcon,
  UserAvatar,
  ShareButton,
  TagChip,
  OptimizedImage,
  CroppedThumbnail,
  AdBanner,
} from '@/shared/ui';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { LOCATION_ICONS } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSpotComments } from '@/entities/comment';
import { useSpotBookmarkInfo } from '@/entities/bookmark';
import { useSpotImages } from '@/entities/user-spot/api';
import { useUserMaps } from '@/entities/map';
import { SpotLikeButton } from '@/features/spot-like';
import { SpotBookmarkButton } from '@/features/spot-bookmark';
import { FollowButton } from '@/features/follow-user';
import { LikersModal } from '@/features/view-likers';
import type { SpotWithDetails, Json } from '@/shared/types';
import { extractName, extractAddress } from '@/shared/lib/utils/multilang.utils';
import { ArticleCommentPreview } from '@/widgets/map-article-content/ui/ArticleCommentPreview';
import { ArticleAuthorSection } from '@/widgets/map-article-content/ui/ArticleAuthorSection';
import { AuthorOtherMaps } from '@/widgets/map-article-content/ui/AuthorOtherMaps';

interface SpotArticleContentProps {
  spot: SpotWithDetails;
  currentUserId: string | null;
  onUserPress: (userId: string) => void;
  onMapPress: (mapId: string) => void;
  onOpenCommentModal: (options?: { focusCommentId?: string; autoFocus?: boolean }) => void;
  onTagPress?: (tagName: string) => void;
}

export function SpotArticleContent({
  spot,
  currentUserId,
  onUserPress,
  onMapPress,
  onOpenCommentModal,
  onTagPress,
}: SpotArticleContentProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const [contentAreaWidth, setContentAreaWidth] = useState(0);

  const handleContentAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) setContentAreaWidth(width);
  }, []);

  // オーナーかどうか
  const isOwner = currentUserId === spot.user_id;

  // 画像ビューアー
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImages, closeImage } = useImageViewer();

  // いいね状態
  const isLiked = spot.is_liked ?? false;
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;

  // サムネイル画像の取得（画像があれば常にフェッチ）
  const hasImages = (spot.images_count ?? 0) > 0;
  const { data: fetchedImages = [] } = useSpotImages(hasImages ? spot.id : null);
  const thumbnailUrl = useMemo(() => {
    // 1. thumbnail_image_idが指定されていればその画像を優先
    if (spot.thumbnail_image_id) {
      const thumbnailImage = fetchedImages.find(img => img.id === spot.thumbnail_image_id);
      if (thumbnailImage?.cloud_path) return thumbnailImage.cloud_path;
    }
    // 2. フォールバック: order_index最小の画像を選択（既存データ対応）
    if (fetchedImages.length > 0) {
      const firstImage = fetchedImages.reduce((min, img) =>
        (img.order_index ?? 0) < (min.order_index ?? 0) ? img : min
      );
      return firstImage.cloud_path || null;
    }
    return null;
  }, [spot.thumbnail_image_id, fetchedImages]);

  // コメント取得（プレビュー用）
  const { data: commentsData } = useSpotComments(spot.id, { currentUserId, authorId: spot.user_id, author: spot.user });
  const comments = (commentsData?.pages[0] ?? []).slice(0, 3);

  // 記事投稿者の他のマップ（現在のスポットが属するマップ以外を最大4件）
  const { data: authorMaps = [] } = useUserMaps(spot.user_id);
  const otherMaps = useMemo(
    () => authorMaps.filter((m) => m.id !== spot.map_id).slice(0, 4),
    [authorMaps, spot.map_id]
  );

  // スポット名の取得（spot.languageで抽出）
  const spotLanguage = spot.language || 'ja';
  const getSpotName = useCallback((): string => {
    const hasMasterSpotId = spot.master_spot_id != null;
    if (!hasMasterSpotId && spot.name) {
      return typeof spot.name === 'string' ? spot.name : t('spotCard.unknownSpot');
    }
    if (spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, spotLanguage);
      if (name) return name;
    }
    return t('spotCard.unknownSpot');
  }, [spot, spotLanguage, t]);

  // 住所の取得（spot.languageで抽出）
  const getAddress = useCallback((): string | null => {
    if (spot.master_spot?.google_short_address) {
      const addr = spot.master_spot.google_short_address;
      if (typeof addr === 'string') return addr;
      return extractAddress(addr, spotLanguage);
    }
    if (spot.google_short_address) {
      const addr = spot.google_short_address;
      if (typeof addr === 'string') return addr;
      return extractAddress(addr, spotLanguage);
    }
    return null;
  }, [spot, spotLanguage]);

  const spotName = getSpotName();
  const address = getAddress();
  const user = spot.user;
  const mapName = spot.map?.name;

  // サムネイル画像のサイズ（1.91:1アスペクト比、左右パディング16px × 2）
  const contentPadding = 32;
  const imageWidth = contentAreaWidth > 0 ? contentAreaWidth - contentPadding : 0;
  const imageHeight = getThumbnailHeight(imageWidth);

  return (
    <>
      <ScrollView className="flex-1 bg-surface">
        {/* スポット情報セクション */}
        <View className="px-4 pt-4 pb-3" onLayout={handleContentAreaLayout}>
          {/* スポット名の行 */}
          <View className="flex-row items-start mb-2">
            <Text className="text-2xl font-bold text-on-surface flex-1">
              {spotName}
            </Text>

            {/* 右側：いいねボタン */}
            <View className="ml-2 mr-2 mt-0.5">
              <SpotLikeButton
                spotId={spot.id}
                currentUserId={currentUserId}
                isLiked={isLiked}
                likesCount={spot.likes_count}
                variant="inline"
                iconSize={iconSizeNum.lg}
                onCountPress={() => setIsLikersModalVisible(true)}
                labelClassName="text-sm text-on-surface-variant"
              />
            </View>
          </View>

          {/* 住所 */}
          {address && (
            <View className="flex-row items-center">
              <AddressPinIcon
                size={iconSizeNum.sm}
                color={LOCATION_ICONS.ADDRESS.color}
                holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight}
              />
              <Text className="text-sm text-on-surface-variant ml-1 flex-1">{address}</Text>
            </View>
          )}
        </View>

        {/* サムネイル画像（1.91:1アスペクト比） */}
        {thumbnailUrl && imageWidth > 0 && (
          <Pressable onPress={() => openImages([thumbnailUrl], 0)} className="px-4">
            {spot.thumbnail_crop ? (
              <CroppedThumbnail
                url={thumbnailUrl}
                crop={spot.thumbnail_crop}
                width={imageWidth}
                borderRadius={0}
              />
            ) : (
              <OptimizedImage
                url={thumbnailUrl}
                width={imageWidth}
                height={imageHeight}
                borderRadius={0}
                quality={85}
              />
            )}
          </Pressable>
        )}

        {/* 一言（description） */}
        {spot.description && (
          <View className="px-4 pt-3 mb-5">
            <Text className="text-xl font-bold text-on-surface leading-snug">{spot.description}</Text>
          </View>
        )}

        {/* 著者情報セクション */}
        <View className="px-4 pb-8">
          <View className="flex-row items-center">
            {/* アバター・ユーザー名・日時 */}
            <Pressable
              onPress={() => onUserPress(spot.user_id)}
              className="flex-row items-center"
            >
              <UserAvatar
                url={user?.avatar_url}
                crop={user?.avatar_crop}
                alt={user?.display_name || user?.username || 'User'}
                className="w-8 h-8 mr-2"
                size={32}
                iconSize={16}
              />
              <View>
                <Text className="text-xs font-semibold text-on-surface">
                  {user?.display_name || user?.username || t('spotCard.defaultUser')}
                </Text>
                <Text className="text-xs text-on-surface-variant">
                  {formatRelativeTime(spot.created_at, locale)}
                </Text>
              </View>
            </Pressable>

            {/* スペーサー */}
            <View className="flex-1" />

            {/* フォローボタン（自分以外の場合） */}
            {!isOwner && (
              <FollowButton targetUserId={spot.user_id} />
            )}
          </View>
        </View>

        {/* コンテンツエリア */}
        <View className="px-4 py-2">
          {/* 記事本文 */}
          {spot.article_content && (
            <View className="mb-4">
              <RichTextRenderer
                content={spot.article_content}
                textClassName="text-base text-on-surface leading-loose"
                onImagePress={(imageUrl) => openImages([imageUrl], 0)}
              />
            </View>
          )}

          {/* タグ */}
          {spot.tags && spot.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {spot.tags.map((tag) => (
                <TagChip key={tag.id} name={tag.name} onPress={onTagPress} />
              ))}
            </View>
          )}

          {/* 所属マップ */}
          {spot.map_id && mapName && (
            <View className="flex-row items-center mb-4">
              <Pressable
                onPress={() => onMapPress(spot.map_id)}
                className="flex-row items-center"
              >
                <Ionicons name="map-outline" size={iconSizeNum.sm} className="text-primary" />
                <Text className="text-sm text-primary ml-1" numberOfLines={1}>
                  {mapName}
                </Text>
              </Pressable>
            </View>
          )}

          {/* アクションバー（いいね、コメント、保存、共有の順） */}
          <View className="flex-row items-center gap-5 py-4">
            {/* いいね */}
            <SpotLikeButton
              spotId={spot.id}
              currentUserId={currentUserId}
              isLiked={isLiked}
              likesCount={spot.likes_count}
              variant="inline"
              iconSize={iconSizeNum.lg}
              onCountPress={() => setIsLikersModalVisible(true)}
              labelClassName="text-sm text-on-surface-variant"
            />

            {/* コメント */}
            <Pressable
              onPress={() => onOpenCommentModal()}
              className="flex-row items-center"
            >
              <Ionicons name="chatbubble-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
              {spot.comments_count > 0 && (
                <Text className="text-sm text-on-surface-variant ml-1">
                  {spot.comments_count}
                </Text>
              )}
            </Pressable>

            {/* 保存 */}
            <SpotBookmarkButton
              spotId={spot.id}
              currentUserId={currentUserId}
              isBookmarked={isBookmarked}
              variant="icon-only"
              size={iconSizeNum.lg}
            />

            {/* 共有 */}
            <ShareButton
              type="spot"
              username={user?.username || ''}
              mapId={spot.map_id}
              id={spot.id}
              variant="icon-only"
              iconSize={iconSizeNum.lg}
              iconColor={colors.light["on-surface-variant"]}
            />
          </View>

        </View>

        {/* 著者情報 + フォローボタン */}
        <View className="px-4">
          <ArticleAuthorSection
            user={spot.user}
            userId={spot.user_id}
            size="medium"
            onUserPress={onUserPress}
          />

          {/* この著者の他のマップ */}
          <AuthorOtherMaps
            maps={otherMaps}
            onMapPress={onMapPress}
          />
        </View>

        {/* バナー広告（プレミアムユーザーには自動的に非表示） */}
        <AdBanner size={BannerAdSize.MEDIUM_RECTANGLE} scale={1.22} className="mt-16 mb-6 items-center" />

        {/* コメントセクション（一番下） */}
        <View className="px-4">
          <ArticleCommentPreview
            comments={comments}
            totalCount={spot.comments_count}
            onUserPress={onUserPress}
            onOpenCommentModal={onOpenCommentModal}
          />
        </View>
      </ScrollView>

      {/* 画像ビューアーモーダル */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        images={viewerImages}
        initialIndex={initialIndex}
        onClose={closeImage}
      />

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        spotId={spot.id}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={onUserPress}
      />
    </>
  );
}
