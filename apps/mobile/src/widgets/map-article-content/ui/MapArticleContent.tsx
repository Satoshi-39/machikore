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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThumbnailHeight, colors, iconSizeNum } from '@/shared/config';
import { formatRelativeTime } from '@/shared/lib';
import { ImageViewerModal, useImageViewer, RichTextRenderer, LocationPinIcon, Button, buttonTextVariants, TagChip, MapThumbnail, AdBanner } from '@/shared/ui';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useI18n } from '@/shared/lib/i18n';
import { useMapComments } from '@/entities/comment';
import { useMapBookmarkInfo } from '@/entities/bookmark';
import { useUserMaps } from '@/entities/map';
import { useMapTags } from '@/entities/tag';
import { LikersModal } from '@/features/view-likers';
import { MapLikeButton } from '@/features/map-like';
import type { MapArticleData } from '@/shared/types';
import { ArticleSpotSectionWithMenu } from './ArticleSpotSectionWithMenu';
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
  onMapPress: (mapId: string, spotId?: string) => void;
  /** タグタップ時のコールバック */
  onTagPress?: (tagName: string) => void;
  /** スポット作成ボタンを押した時のコールバック（オーナーの場合のみ表示） */
  onCreateSpotPress?: () => void;
  /** スポット編集ボタンを押した時のコールバック（オーナーの場合のみ表示） */
  onEditSpotPress?: (spotId: string) => void;
}

export function MapArticleContent({
  articleData,
  currentUserId,
  onUserPress,
  onSpotPress,
  onOpenCommentModal,
  onMapPress,
  onTagPress,
  onCreateSpotPress,
  onEditSpotPress,
}: MapArticleContentProps) {
  const { t, locale } = useI18n();
  const [heroWidth, setHeroWidth] = useState(0);
  const { map, spots } = articleData;

  // オーナーかどうか（非公開スポットの鍵マーク表示に使用）
  const isOwner = currentUserId === map.user_id;

  // 画像ビューアー
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImage, openImages, closeImage } = useImageViewer();

  // いいね状態（mapオブジェクトに含まれるis_likedを使用）
  const isLiked = map.is_liked ?? false;
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, map.id);
  const isBookmarked = bookmarkInfo.length > 0;

  // コメント取得（プレビュー用）
  const { data: commentsData } = useMapComments(map.id, { currentUserId, authorId: map.user_id, author: map.user });
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

  return (
    <>
      <ScrollView ref={scrollViewRef} className="flex-1">
        {/* ヒーロー画像 */}
        <Pressable
          onPress={() => map.thumbnail_url && openImage(map.thumbnail_url)}
          onLayout={(e) => {
            heroImageHeight.current = e.nativeEvent.layout.height;
            const width = e.nativeEvent.layout.width;
            if (width > 0) setHeroWidth(width);
          }}
          disabled={!map.thumbnail_url}
        >
          {heroWidth > 0 && (
            <MapThumbnail
              url={map.thumbnail_url}
              crop={map.thumbnail_crop}
              width={heroWidth}
              height={getThumbnailHeight(heroWidth)}
              borderRadius={0}
              defaultIconSize={64}
            />
          )}
        </Pressable>

        <View className="px-4 py-4">
          {/* マップタイトル */}
          <View className="flex-row items-center mb-3">
            {!map.is_public && (
              <View className="mr-2">
                <Ionicons name="lock-closed" size={iconSizeNum.sm} className="text-on-surface-variant" />
              </View>
            )}
            <Text className="text-2xl font-bold text-on-surface flex-shrink">
              {map.name}
            </Text>
          </View>

          {/* スポット数 + いいね */}
          <View className="flex-row items-center gap-4 mb-5">
            <View className="flex-row items-center">
              <LocationPinIcon size={iconSizeNum.sm} color={colors.light['on-surface-variant']} />
              <Text className="text-sm text-on-surface-variant ml-1">
                {t('article.spotsCount', { count: map.spots_count })}
              </Text>
            </View>

            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={iconSizeNum.sm}
              isLiked={isLiked}
              onCountPress={() => setIsLikersModalVisible(true)}
              textClassName="text-sm text-on-surface-variant"
              textMarginClassName="ml-1"
            />
          </View>

          {/* 作成者情報 + フォローボタン（ユーザー名と日付は縦並び） */}
          <View className="mb-4">
            <ArticleAuthorSection
              user={map.user}
              userId={map.user_id}
              size="small"
              createdAt={formatRelativeTime(map.created_at, locale)}
              onUserPress={onUserPress}
            />
          </View>

          {/* マップ説明（導入文） */}
          {map.description && (
            <View className="mb-6 py-4">
              <Text className="text-base text-on-surface leading-6">
                {map.description}
              </Text>
            </View>
          )}

          {/* 目次 */}
          <ArticleTableOfContents
            spots={spots}
            isOwner={isOwner}
            onSpotPress={handleTocPress}
          />

          {/* まえがき */}
          {map.article_intro && (
            <View className="mt-6 mb-12">
              <Text className="text-2xl font-bold text-on-surface mb-3">
                {t('article.intro')}
              </Text>
              <RichTextRenderer
                content={map.article_intro}
                textClassName="text-base text-on-surface leading-loose"
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
                <ArticleSpotSectionWithMenu
                  key={spot.id}
                  spot={spot}
                  index={index}
                  isOwner={isOwner}
                  currentUserId={currentUserId}
                  mapOwnerUsername={map.user?.username}
                  onSpotPress={onSpotPress}
                  onMapPress={() => onMapPress(map.id, spot.id)}
                  onImagePress={openImages}
                  onEditSpotPress={onEditSpotPress}
                  onLayout={(spotId, y) => {
                    spotPositions.current[spotId] = y;
                  }}
                />
              ))}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="location-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
              <Text className="text-on-surface-variant mt-4">{t('article.noSpots')}</Text>
              {onCreateSpotPress && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={onCreateSpotPress}
                  className="mt-4"
                >
                  <View className="flex-row items-center">
                    <Ionicons name="add" size={iconSizeNum.sm} className="text-gray-500" />
                    <Text className={`${buttonTextVariants({ size: 'sm', variant: 'outline' })} ml-1`}>{t('article.createSpot')}</Text>
                  </View>
                </Button>
              )}
            </View>
          )}

          {/* あとがき */}
          {map.article_outro && (
            <View className="mt-8 mb-4">
              <Text className="text-2xl font-bold text-on-surface mb-3">
                {t('article.outro')}
              </Text>
              <RichTextRenderer
                content={map.article_outro}
                textClassName="text-base text-on-surface leading-loose"
              />
            </View>
          )}

          {/* タグ */}
          {mapTags.length > 0 && (
            <View className="flex-row flex-wrap mt-8">
              {mapTags.map((tag) => (
                <TagChip key={tag.id} name={tag.name} onPress={onTagPress} />
              ))}
            </View>
          )}

          {/* フッターアクション（note風） */}
          <View className="py-4">
            {/* アクションボタン */}
            <View className="mb-6">
              <ArticleFooterActions
                mapId={map.id}
                mapOwnerUsername={map.user?.username}
                currentUserId={currentUserId}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likesCount={map.likes_count}
                commentsCount={map.comments_count}
                onLikersPress={() => setIsLikersModalVisible(true)}
                onCommentPress={() => onOpenCommentModal()}
              />
            </View>
          </View>
        </View>

        <View className="px-4">
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
        </View>

        {/* バナー広告（プレミアムユーザーには自動的に非表示） */}
        <View className="mt-16 mb-6 items-center">
          <AdBanner size={BannerAdSize.MEDIUM_RECTANGLE} scale={1.22} />
        </View>

        {/* コメントセクション */}
        <View className="px-4">
          <ArticleCommentPreview
            comments={comments}
            totalCount={map.comments_count}
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
        mapId={map.id}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={onUserPress}
      />
    </>
  );
}
