/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 * SpotWithDetails（詳細画面用）とUserSpotSearchResult（検索/フィード用）に対応
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import ReadMore from '@fawazahmed/react-native-read-more';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizeNum, avatarSizeNum, iconSizeNum } from '@/shared/config';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { PopupMenu, type PopupMenuItem, ImageViewerModal, useImageViewer, AddressPinIcon, SpotThumbnail, TagChip } from '@/shared/ui';
import { LOCATION_ICONS } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { showLoginRequiredAlert, shareSpot } from '@/shared/lib';
import type { SpotWithDetails, UUID, Json, TagBasicInfo } from '@/shared/types';
import { extractPlainText } from '@/shared/types';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import { formatRelativeTime } from '@/shared/lib/utils';
import { isEmptyArticle } from '@/shared/lib/utils/article.utils';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import { useSpotImages } from '@/entities/user-spot/api';
import { useToggleSpotLike } from '@/entities/like';
import { useUser } from '@/entities/user';
import { useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import { ImageGrid } from '@/widgets/image-grid';
import { ImageCarousel } from '@/widgets/image-carousel';
import { useI18n } from '@/shared/lib/i18n';

// Supabase JOINで取得済みのユーザー情報
interface EmbeddedUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

// Supabase JOINで取得済みのmaster_spot情報
// name・住所フィールドはJSONB型（多言語対応）
interface EmbeddedMasterSpot {
  id: string;
  name: Json; // JSONB型（多言語対応）
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_short_address: Json | null; // JSONB型
  google_types: string[] | null;
}

/** 画像表示形式 */
type SpotCardVariant = 'grid' | 'carousel';

interface SpotCardProps {
  // Supabase SpotWithDetails（詳細用）またはUserSpotSearchResult（検索/フィード用）
  spot: SpotWithDetails | UserSpotSearchResult;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のスポットか判定用、いいね機能にも使用）
  /** 画像表示形式（grid: 2x2グリッド、carousel: 横スクロール） */
  variant?: SpotCardVariant;
  /** カード全体タップ時（スポット記事への遷移用） */
  onPress?: (spotId: string) => void;
  onUserPress?: (userId: string) => void;
  /** マップアイコンタップ時（マップ内スポットへの遷移用） */
  onMapPress?: (spotId: string, mapId: string) => void;
  onEdit?: (spotId: string) => void;
  onReport?: (spotId: string) => void;
  onBlock?: (userId: string) => void;
  onCommentPress?: (spotId: string) => void;
  onTagPress?: (tagName: string) => void;
  // Supabase JOINで既に取得済みのデータ（あれば個別fetchをスキップ）
  embeddedUser?: EmbeddedUser | null;
  embeddedMasterSpot?: EmbeddedMasterSpot | null;
  /** 下部ボーダーを非表示にする */
  noBorder?: boolean;
  /** カードの幅（カルーセル内で使用する場合に親から渡される） */
  cardWidth?: number;
}

export function SpotCard({
  spot,
  currentUserId,
  variant = 'grid',
  onPress,
  onUserPress,
  onMapPress,
  onEdit,
  onReport,
  onBlock,
  onCommentPress,
  onTagPress,
  embeddedUser,
  embeddedMasterSpot,
  noBorder = false,
  cardWidth: propCardWidth,
}: SpotCardProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();

  // embeddedUserがあればuseUserをスキップ
  const { data: fetchedUser } = useUser(embeddedUser ? null : spot.user_id);
  const user = embeddedUser || fetchedUser;

  // いいね状態（JOINで取得済みのデータを使用）
  const isLiked = spot.is_liked ?? false;

  // タグ情報を取得（SpotWithDetails または UserSpotSearchResult の場合）
  const tags: TagBasicInfo[] | undefined = 'tags' in spot ? spot.tags : undefined;

  // 記事コンテンツを取得（SpotWithDetails または UserSpotSearchResult の場合）
  const articleContent = 'article_content' in spot ? spot.article_content : undefined;
  const hasArticle = !isEmptyArticle(articleContent ?? null);
  const articlePreview = hasArticle ? extractPlainText(articleContent ?? null) : '';

  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleSpotLike();

  // image_urlsがJOINで取得済みならuseSpotImagesをスキップ（N+1クエリ回避）
  const embeddedImageUrls = 'image_urls' in spot ? spot.image_urls : undefined;
  const { data: fetchedImages = [], isLoading: imagesLoading } = useSpotImages(
    embeddedImageUrls ? null : spot.id // image_urlsがあればnullを渡してスキップ
  );
  // JOINで取得済みの場合はそれを使い、なければfetchした結果を使う
  const images = embeddedImageUrls
    ? embeddedImageUrls.map((url, idx) => ({ id: `embedded-${idx}`, cloud_path: url, local_path: null }))
    : fetchedImages;

  // ブックマーク状態（JOINで取得済みのデータを使用）
  const isBookmarked = spot.is_bookmarked ?? false;
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);


  // 画像拡大表示用
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImages, closeImage } = useImageViewer();
  const screenWidth = Dimensions.get('window').width;
  // カルーセル内では親から渡されたカード幅を使用し、それ以外は画面幅 - パディングを使用
  const contentWidth = propCardWidth ? propCardWidth - 32 : screenWidth - 32;

  const avatarUri = user?.avatar_url ?? undefined;
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // スポット名の取得
  // 優先順位:
  // 1. master_spot_idがnullの場合 → user_spots.name（ピン刺し・現在地登録用、TEXT型）
  // 2. master_spot_idがある場合 → master_spot.name（Google Places、JSONB型をspot.languageで抽出）
  const spotLanguage = 'language' in spot ? (spot.language || 'ja') : 'ja';
  const getSpotName = (): string => {
    // master_spot_idがnull = ピン刺し・現在地登録の場合（nameはTEXT）
    const hasMasterSpotId = 'master_spot_id' in spot && spot.master_spot_id != null;
    if (!hasMasterSpotId && 'name' in spot && spot.name) {
      return typeof spot.name === 'string' ? spot.name : t('spotCard.unknownSpot');
    }
    // master_spot_idがある場合はmaster_spot.nameを使用（spot.languageで抽出）
    if ('master_spot' in spot && spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, spotLanguage);
      if (name) return name;
    }
    // embeddedMasterSpotがある場合（nameはJSONB）
    if (embeddedMasterSpot?.name) {
      const name = extractName(embeddedMasterSpot.name, spotLanguage);
      if (name) return name;
    }
    return t('spotCard.unknownSpot');
  };

  // 住所の取得（表示用は短縮住所、spot.languageで抽出）
  const getAddress = (): string | null => {
    // SpotWithDetailsやUserSpotSearchResultはmaster_spotを持つ
    if ('master_spot' in spot && spot.master_spot?.google_short_address) {
      const addr = spot.master_spot.google_short_address;
      if (typeof addr === 'string') {
        return addr;
      }
      return extractAddress(addr, spotLanguage);
    }
    // embeddedMasterSpotはJSONB型
    if (embeddedMasterSpot?.google_short_address) {
      return extractAddress(embeddedMasterSpot.google_short_address, spotLanguage);
    }
    // ピン刺し・現在地登録の場合はuser_spotの住所を使用
    if ('google_short_address' in spot && spot.google_short_address) {
      const addr = spot.google_short_address;
      if (typeof addr === 'string') {
        return addr;
      }
      return extractAddress(addr, spotLanguage);
    }
    return null;
  };

  // マップ名の取得（SpotWithDetails型の場合のみ）
  const getMapName = (): string | null => {
    if ('map' in spot && spot.map?.name) {
      return spot.map.name;
    }
    return null;
  };

  const spotName = getSpotName();
  const address = getAddress();
  const mapName = getMapName();

  const handleLikePress = () => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, spotId: spot.id, isLiked: !!spot.is_liked });
  };

  const handleLikesCountPress = () => {
    setIsLikersModalVisible(true);
  };

  // ブックマーク処理（フォルダ選択モーダルを開く）
  const handleBookmarkPress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    setIsFolderModalVisible(true);
  }, [currentUserId]);

  // フォルダに追加
  const handleAddToFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    addBookmark({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, addBookmark]);

  // フォルダから削除
  const handleRemoveFromFolder = useCallback((folderId: string | null) => {
    if (!currentUserId) return;
    removeFromFolder({ userId: currentUserId, spotId: spot.id, folderId });
  }, [currentUserId, spot.id, removeFromFolder]);

  // 共有処理
  const handleSharePress = useCallback(async () => {
    await shareSpot(user?.username || '', spot.map_id, spot.id);
  }, [user?.username, spot.map_id, spot.id]);

  // 三点リーダーメニュー項目（オーナー用）
  const ownerMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: t('common.edit'),
      icon: 'create-outline',
      onPress: () => onEdit?.(spot.id),
    },
  ], [spot.id, onEdit, t]);

  // 三点リーダーメニュー項目（オーナー以外用）
  const guestMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'report',
      label: t('common.report'),
      icon: 'flag-outline',
      onPress: () => onReport?.(spot.id),
    },
    {
      id: 'block',
      label: t('menu.blockUser'),
      icon: 'ban-outline',
      destructive: true,
      onPress: () => onBlock?.(spot.user_id),
    },
  ], [spot.id, spot.user_id, onReport, onBlock, t]);

  // カード全体タップ（記事への遷移）
  const handleCardPress = useCallback(() => {
    onPress?.(spot.id);
  }, [onPress, spot.id]);

  // マップアイコンタップ（マップ内スポットへの遷移）
  const handleMapIconPress = useCallback(() => {
    onMapPress?.(spot.id, spot.map_id);
  }, [onMapPress, spot.id, spot.map_id]);

  // カルーセル版：ライトモードは枠線、ダークモードは背景色
  const cardStyle = variant === 'carousel'
    ? 'bg-surface p-4 rounded-2xl border-thin border-outline'
    : `bg-surface p-4 ${noBorder ? '' : 'border-b-thin border-outline'}`;

  return (
    <Pressable
      testID="spot-card"
      onPress={handleCardPress}
      className={cardStyle}
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコンとユーザー名（タップでプロフィールへ） */}
        <Pressable
          onPress={() => onUserPress?.(spot.user_id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="flex-row items-center"
        >
          {avatarUri ? (
            <Image
              source={{ uri: getOptimizedImageUrl(avatarUri, IMAGE_PRESETS.avatar) || avatarUri }}
              style={{ width: avatarSizeNum.lg, height: avatarSizeNum.lg, borderRadius: avatarSizeNum.lg / 2, marginRight: 12 }}
              contentFit="cover"
              transition={200}
              cachePolicy="disk"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-secondary justify-center items-center mr-3">
              <Ionicons name="person" size={iconSizeNum.md} className="text-gray-500" />
            </View>
          )}
          <View>
            <Text className="text-sm font-semibold text-on-surface">
              {user?.display_name || user?.username || t('spotCard.defaultUser')}
            </Text>
            <Text className="text-xs text-on-surface-variant">
              {formatRelativeTime(spot.created_at, locale)}
            </Text>
          </View>
        </Pressable>
        <View className="flex-1" />

        {/* マップアイコン + 三点リーダーメニュー */}
        <View className="flex-row items-center gap-4">
          {spot.map_id && (
            <Pressable
              onPress={handleMapIconPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
            >
              <Ionicons name="map-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
            </Pressable>
          )}
          {isOwner ? (
            <PopupMenu items={ownerMenuItems} hitSlop={4} />
          ) : currentUserId && !isOwner ? (
            <PopupMenu items={guestMenuItems} hitSlop={4} />
          ) : null}
        </View>
      </View>

      {/* スポット名 */}
      <View className="flex-row items-center mb-1">
        <Text className="text-base font-semibold text-on-surface">
          {spotName}
        </Text>
        {/* 非公開アイコン（自分のスポットで非公開の場合のみ表示） */}
        {isOwner && 'is_public' in spot && spot.is_public === false && (
          <View className="ml-2 flex-row items-center bg-secondary px-2 py-0.5 rounded">
            <Ionicons name="lock-closed" size={iconSizeNum.xs} className="text-on-surface-variant" />
            <Text className="text-xs text-on-surface-variant ml-0.5">
              {t('publicToggle.privateStatus')}
            </Text>
          </View>
        )}
      </View>

      {/* 住所（スポット名の下） */}
      {address && (
        <View className="flex-row items-center mb-2">
          <AddressPinIcon
            size={iconSizeNum.xs}
            color={LOCATION_ICONS.ADDRESS.color}
            holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight}
          />
          <Text className="text-sm text-on-surface-variant ml-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      )}

      {/* 画像表示（variantで切り替え） */}
      <View className="mb-4">
        {imagesLoading ? (
          // ローディング中はプレースホルダーを表示
          <View
            className="bg-secondary rounded-lg"
            style={{ width: contentWidth, height: contentWidth * 0.6 }}
          />
        ) : images.length > 0 ? (
          variant === 'carousel' ? (
            // カルーセル形式: 横スクロール
            <ImageCarousel
              images={images.map(img => img.cloud_path || img.local_path || '').filter(Boolean)}
              width={contentWidth}
              height={contentWidth * 0.75}
              onImagePress={(index) => {
                const imageUrls = images.map(img => img.cloud_path || img.local_path || '').filter(Boolean);
                openImages(imageUrls, index);
              }}
            />
          ) : (
            // グリッド形式: 2x2グリッド（デフォルト）
            <ImageGrid
              images={images.map(img => img.cloud_path || img.local_path || '').filter(Boolean)}
              containerWidth={contentWidth}
              onImagePress={(index) => {
                const imageUrls = images.map(img => img.cloud_path || img.local_path || '').filter(Boolean);
                openImages(imageUrls, index);
              }}
            />
          )
        ) : (
          // 画像がない場合はデフォルトサムネイルを表示
          <SpotThumbnail
            url={null}
            width={contentWidth}
            height={contentWidth * 0.75}
            borderRadius={12}
            defaultIconSize={96}
            showBorderOnDefault={variant === 'carousel'}
          />
        )}
      </View>

      {/* 画像拡大モーダル */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        images={viewerImages}
        initialIndex={initialIndex}
        onClose={closeImage}
      />

      {/* 一言（description）- 画像の下、大きく太字 */}
      {spot.description && (
        <Text className="text-lg font-semibold text-on-surface mb-6">
          {spot.description}
        </Text>
      )}

      {/* 記事プレビュー */}
      {hasArticle && articleContent && (
        <View className="mb-2">
          <ReadMore
            numberOfLines={2}
            seeMoreText={t('common.more')}
            seeLessText=""
            seeMoreStyle={{ color: isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant'] }}
            style={{ color: isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'], fontSize: fontSizeNum.sm }}
            allowFontScaling={false}
            onSeeMore={() => onPress?.(spot.id)}
          >
            {articlePreview}
          </ReadMore>
        </View>
      )}

      {/* タグ */}
      {tags && tags.length > 0 && (
        <View className="flex-row flex-wrap mb-2">
          {tags.slice(0, 5).map((tag) => (
            <TagChip key={tag.id} name={tag.name} onPress={onTagPress} />
          ))}
        </View>
      )}

      {/* マップ名 */}
      {mapName && (
        <Pressable
          onPress={handleMapIconPress}
          className="flex-row items-center mb-2 self-start"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Ionicons name="map-outline" size={iconSizeNum.xs} className="text-on-surface-variant" />
          <Text className="text-xs text-on-surface-variant ml-1">
            {mapName}
          </Text>
        </Pressable>
      )}

      {/* フッター情報 - 均等配置 */}
      <View className="flex-row items-center justify-around mt-2">
        {/* コメント */}
        <Pressable
          onPress={() => onCommentPress?.(spot.id)}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-outline" size={iconSizeNum.sm} className="text-on-surface-variant" />
          <Text className="text-sm text-on-surface-variant ml-2">
            {spot.comments_count}
          </Text>
        </Pressable>

        {/* いいね */}
        <View className="flex-row items-center py-2 px-3">
          <Pressable
            onPress={handleLikePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 0 }}
            disabled={isTogglingLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={iconSizeNum.sm}
              color={isLiked ? colors.action['action-like'] : colors.light["on-surface-variant"]}
            />
          </Pressable>
          <Pressable
            onPress={handleLikesCountPress}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 16 }}
          >
            <Text className="text-sm text-on-surface-variant ml-2">
              {spot.likes_count}
            </Text>
          </Pressable>
        </View>

        {/* ブックマーク */}
        <Pressable
          onPress={handleBookmarkPress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={iconSizeNum.sm}
            className="text-on-surface-variant"
          />
        </Pressable>

        {/* 共有 */}
        <Pressable
          onPress={handleSharePress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="share-outline"
            size={iconSizeNum.sm}
            className="text-on-surface-variant"
          />
        </Pressable>
      </View>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          spotId={spot.id}
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        spotId={spot.id}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={onUserPress}
      />
    </Pressable>
  );
}
