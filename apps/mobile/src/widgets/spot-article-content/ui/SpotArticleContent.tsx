/**
 * スポット記事コンテンツ Widget
 *
 * Instagram風のレイアウトでスポット記事を表示
 * - ヘッダー（アバター、ユーザー名、スポット名、概要）
 * - 画像カルーセル
 * - アクションバー（いいね、コメント、共有、保存）
 * - 住所・所属マップ
 * - 記事本文
 * - コメントプレビュー
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  iconSizeNum,
  SPOT_COLORS,
  SPOT_COLOR_LIST,
  getSpotColorStroke,
  DEFAULT_SPOT_COLOR,
  type SpotColor,
} from '@/shared/config';
import { formatRelativeTime } from '@/shared/lib';
import {
  ImageViewerModal,
  useImageViewer,
  RichTextRenderer,
  LocationPinIcon,
  AddressPinIcon,
  UserAvatar,
  ShareButton,
  TagChip,
  SpotThumbnail,
} from '@/shared/ui';
import { LOCATION_ICONS } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSpotComments } from '@/entities/comment';
import { useSpotBookmarkInfo } from '@/entities/bookmark';
import { useSpotImages } from '@/entities/user-spot/api';
import { SpotLikeButton } from '@/features/spot-like';
import { SpotBookmarkButton } from '@/features/spot-bookmark';
import { FollowButton } from '@/features/follow-user';
import { LikersModal } from '@/features/view-likers';
import type { SpotWithDetails, Json } from '@/shared/types';
import { extractName, extractAddress } from '@/shared/lib/utils/multilang.utils';
import { ImageCarousel } from '@/widgets/image-carousel';
import { ArticleCommentPreview } from '@/widgets/map-article-content/ui/ArticleCommentPreview';

interface SpotArticleContentProps {
  spot: SpotWithDetails;
  currentUserId: string | null;
  onUserPress: (userId: string) => void;
  onMapPress: (mapId: string) => void;
  onOpenCommentModal: (options?: { focusCommentId?: string; autoFocus?: boolean }) => void;
  onTagPress?: (tagName: string) => void;
  onEditSpotPress?: () => void;
}

export function SpotArticleContent({
  spot,
  currentUserId,
  onUserPress,
  onMapPress,
  onOpenCommentModal,
  onTagPress,
  onEditSpotPress,
}: SpotArticleContentProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const { width: screenWidth } = useWindowDimensions();

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

  // 画像取得
  const embeddedImageUrls = spot.image_urls;
  const { data: fetchedImages = [] } = useSpotImages(embeddedImageUrls ? null : spot.id);
  const images = embeddedImageUrls
    ? embeddedImageUrls.map((url, idx) => ({ id: `embedded-${idx}`, cloud_path: url, local_path: null }))
    : fetchedImages;
  const imageUrls = images.map(img => img.cloud_path || img.local_path || '').filter(Boolean);

  // コメント取得（プレビュー用）
  const { data: commentsData } = useSpotComments(spot.id, { currentUserId, authorId: spot.user_id, author: spot.user });
  const comments = (commentsData?.pages[0] ?? []).slice(0, 3);

  // スポットのカラーを取得
  const spotColor = (() => {
    if (spot.map_label?.color) {
      const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
      if (labelColorKey) return labelColorKey as SpotColor;
    }
    if (spot.spot_color) {
      return spot.spot_color as SpotColor;
    }
    return DEFAULT_SPOT_COLOR;
  })();
  const spotColorValue = SPOT_COLORS[spotColor]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
  const spotColorStroke = getSpotColorStroke(spotColor, isDarkMode);

  // スポット名の取得
  const getSpotName = useCallback((): string => {
    const hasMasterSpotId = spot.master_spot_id != null;
    if (!hasMasterSpotId && spot.name) {
      const name = extractName(spot.name as Json, locale);
      if (name) return name;
    }
    if (spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, locale);
      if (name) return name;
    }
    return t('spotCard.unknownSpot');
  }, [spot, locale, t]);

  // 住所の取得
  const getAddress = useCallback((): string | null => {
    if (spot.master_spot?.google_short_address) {
      const addr = spot.master_spot.google_short_address;
      if (typeof addr === 'string') return addr;
      return extractAddress(addr, locale);
    }
    if (spot.google_short_address) {
      const addr = spot.google_short_address;
      if (typeof addr === 'string') return addr;
      return extractAddress(addr, locale);
    }
    return null;
  }, [spot, locale]);

  const spotName = getSpotName();
  const address = getAddress();
  const user = spot.user;
  const mapName = spot.map?.name;

  // 画像カルーセルのサイズ（1:1）
  const carouselSize = screenWidth;

  return (
    <>
      <ScrollView className="flex-1 bg-surface">
        {/* ヘッダー（Instagram風） */}
        <View className="px-4 py-3 flex-row items-center">
          {/* アバター */}
          <Pressable onPress={() => onUserPress(spot.user_id)}>
            <UserAvatar
              url={user?.avatar_url}
              alt={user?.display_name || user?.username || 'User'}
              className="w-10 h-10 mr-3"
              iconSize={20}
            />
          </Pressable>

          {/* ユーザー名・スポット名・概要 */}
          <View className="flex-1">
            <Pressable onPress={() => onUserPress(spot.user_id)}>
              <Text className="text-sm font-semibold text-on-surface">
                {user?.display_name || user?.username || t('spotCard.defaultUser')}
              </Text>
            </Pressable>
            <View className="flex-row items-center">
              <LocationPinIcon size={iconSizeNum.xs} color={spotColorValue} strokeColor={spotColorStroke} />
              <Text className="text-xs text-on-surface-variant ml-1" numberOfLines={1}>
                {spotName}
              </Text>
            </View>
          </View>

          {/* フォローボタン（自分以外の場合） */}
          {!isOwner && (
            <FollowButton targetUserId={spot.user_id} />
          )}

          {/* 編集ボタン（オーナーの場合） */}
          {isOwner && onEditSpotPress && (
            <Pressable
              onPress={onEditSpotPress}
              className="p-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={iconSizeNum.md} className="text-on-surface-variant" />
            </Pressable>
          )}
        </View>

        {/* 概要（description） */}
        {spot.description && (
          <View className="px-4 pb-2">
            <Text className="text-sm text-on-surface">{spot.description}</Text>
          </View>
        )}

        {/* 画像カルーセル（フルブリード） */}
        <View>
          {imageUrls.length > 0 ? (
            <ImageCarousel
              images={imageUrls}
              width={carouselSize}
              height={carouselSize}
              borderRadius={0}
              onImagePress={(index) => openImages(imageUrls, index)}
            />
          ) : (
            <SpotThumbnail
              url={null}
              width={carouselSize}
              height={carouselSize * 0.75}
              borderRadius={0}
              defaultIconSize={96}
            />
          )}
        </View>

        {/* アクションバー（Instagram風） */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-5">
            {/* いいね */}
            <SpotLikeButton
              spotId={spot.id}
              currentUserId={currentUserId}
              isLiked={isLiked}
              likesCount={spot.likes_count}
              variant="icon-only"
              iconSize={iconSizeNum.lg}
              onCountPress={() => setIsLikersModalVisible(true)}
            />

            {/* コメント */}
            <Pressable onPress={() => onOpenCommentModal()}>
              <Ionicons name="chatbubble-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
            </Pressable>

            {/* 共有 */}
            <ShareButton
              type="spot"
              id={spot.id}
              variant="icon-only"
              iconSize={iconSizeNum.lg}
              iconColor={colors.light["on-surface-variant"]}
            />
          </View>

          {/* 保存 */}
          <SpotBookmarkButton
            spotId={spot.id}
            currentUserId={currentUserId}
            isBookmarked={isBookmarked}
            variant="icon-only"
            size={iconSizeNum.lg}
          />
        </View>

        {/* いいね数 */}
        {spot.likes_count > 0 && (
          <Pressable onPress={() => setIsLikersModalVisible(true)} className="px-4 pb-2">
            <Text className="text-sm font-semibold text-on-surface">
              {t('article.likesCount', { count: spot.likes_count })}
            </Text>
          </Pressable>
        )}

        {/* コンテンツエリア */}
        <View className="px-4 py-2">
          {/* 住所 */}
          {address && (
            <View className="flex-row items-center mb-3">
              <AddressPinIcon
                size={iconSizeNum.sm}
                color={LOCATION_ICONS.ADDRESS.color}
                holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight}
              />
              <Text className="text-sm text-on-surface-variant ml-2 flex-1">{address}</Text>
            </View>
          )}

          {/* 所属マップ */}
          {spot.map_id && mapName && (
            <Pressable
              onPress={() => onMapPress(spot.map_id)}
              className="flex-row items-center mb-3 bg-secondary rounded-lg px-3 py-2"
            >
              <Ionicons name="map-outline" size={iconSizeNum.sm} className="text-on-surface-variant" />
              <Text className="text-sm text-on-surface ml-2 flex-1" numberOfLines={1}>
                {mapName}
              </Text>
              <Ionicons name="chevron-forward" size={iconSizeNum.sm} className="text-on-surface-variant" />
            </Pressable>
          )}

          {/* 投稿日時 */}
          <Text className="text-xs text-on-surface-variant mb-4">
            {formatRelativeTime(spot.created_at, locale)}
          </Text>

          {/* 記事本文 */}
          {spot.article_content && (
            <View className="mb-4">
              <RichTextRenderer
                content={spot.article_content}
                textClassName="text-base text-on-surface leading-6"
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

          {/* コメントセクション */}
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
