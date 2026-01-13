/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 * SpotWithDetails（詳細画面用）とUserSpotSearchResult（検索/フィード用）に対応
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, Dimensions } from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, SPOT_COLOR_LIST, getSpotColorStroke, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import { PopupMenu, type PopupMenuItem, ImageViewerModal, useImageViewer, LocationPinIcon, AddressPinIcon, RichTextRenderer } from '@/shared/ui';
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
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { ImageGrid } from '@/widgets/image-grid';
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

interface SpotCardProps {
  // Supabase SpotWithDetails（詳細用）またはUserSpotSearchResult（検索/フィード用）
  spot: SpotWithDetails | UserSpotSearchResult;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のスポットか判定用、いいね機能にも使用）
  machiName?: string;
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onMapPress?: (mapId: string) => void;
  onEdit?: (spotId: string) => void;
  onDelete?: (spotId: string) => void;
  onReport?: (spotId: string) => void;
  onCommentPress?: (spotId: string) => void;
  onTagPress?: (tagName: string) => void;
  // Supabase JOINで既に取得済みのデータ（あれば個別fetchをスキップ）
  embeddedUser?: EmbeddedUser | null;
  embeddedMasterSpot?: EmbeddedMasterSpot | null;
  /** 下部ボーダーを非表示にする */
  noBorder?: boolean;
}

export function SpotCard({
  spot,
  currentUserId,
  machiName,
  onPress,
  onUserPress,
  onMapPress,
  onEdit,
  onDelete,
  onReport,
  onCommentPress,
  onTagPress,
  embeddedUser,
  embeddedMasterSpot,
  noBorder = false,
}: SpotCardProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();

  // embeddedUserがあればuseUserをスキップ
  const { data: fetchedUser } = useUser(embeddedUser ? null : spot.user_id);
  const user = embeddedUser || fetchedUser;

  // いいね状態は spot.is_liked を使用（SpotWithDetails の場合）
  const isLiked = 'is_liked' in spot ? (spot.is_liked ?? false) : false;

  // タグ情報を取得（UserSpotSearchResult の場合のみ）
  const tags: TagBasicInfo[] | undefined = 'tags' in spot ? spot.tags : undefined;

  // 記事コンテンツを取得（SpotWithDetails または UserSpotSearchResult の場合）
  const articleContent = 'article_content' in spot ? spot.article_content : undefined;
  const hasArticle = !isEmptyArticle(articleContent ?? null);
  const articlePreview = hasArticle ? extractPlainText(articleContent ?? null) : '';

  // スポットのカラーを取得（ラベル色を優先、なければspot_color、それもなければデフォルト）
  const spotColor = useMemo((): SpotColor => {
    // ラベルが設定されている場合はラベル色を優先
    if ('map_label' in spot && spot.map_label?.color) {
      const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
      if (labelColorKey) return labelColorKey;
    }
    // スポット色が設定されている場合
    if ('spot_color' in spot && spot.spot_color) {
      return spot.spot_color as SpotColor;
    }
    return DEFAULT_SPOT_COLOR;
  }, [spot]);
  const spotColorValue = SPOT_COLORS[spotColor]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
  const spotColorStroke = getSpotColorStroke(spotColor, isDarkMode);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleSpotLike();
  const { data: images = [], isLoading: imagesLoading } = useSpotImages(spot.id);

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;
  // ブックマーク済みフォルダIDのSetを作成
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  // 記事展開状態
  const [isArticleExpanded, setIsArticleExpanded] = useState(false);


  // 画像拡大表示用
  const { images: viewerImages, initialIndex, isOpen: isImageViewerOpen, openImages, closeImage } = useImageViewer();
  const screenWidth = Dimensions.get('window').width;

  const avatarUri = user?.avatar_url ?? undefined;
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // スポット名の取得
  // 優先順位:
  // 1. master_spot_idがnullの場合 → user_spots.name（ピン刺し・現在地登録用）
  // 2. master_spot_idがある場合 → master_spot.name（Google Places）
  const getSpotName = (): string => {
    // master_spot_idがnull = ピン刺し・現在地登録の場合
    const hasMasterSpotId = 'master_spot_id' in spot && spot.master_spot_id != null;
    if (!hasMasterSpotId && 'name' in spot && spot.name) {
      const name = extractName(spot.name as Json, locale);
      if (name) return name;
    }
    // master_spot_idがある場合はmaster_spot.nameを使用
    if ('master_spot' in spot && spot.master_spot?.name) {
      const name = extractName(spot.master_spot.name, locale);
      if (name) return name;
    }
    // embeddedMasterSpotがある場合（nameはJSONB）
    if (embeddedMasterSpot?.name) {
      const name = extractName(embeddedMasterSpot.name, locale);
      if (name) return name;
    }
    return t('spotCard.unknownSpot');
  };

  // 住所の取得（表示用は短縮住所）
  const getAddress = (): string | null => {
    // SpotWithDetailsやUserSpotSearchResultはmaster_spotを持つ
    if ('master_spot' in spot && spot.master_spot?.google_short_address) {
      // UserSpotSearchResultはJSONB、SpotWithDetailsは変換済みstring
      const addr = spot.master_spot.google_short_address;
      if (typeof addr === 'string') {
        return addr;
      }
      // JSONB型の場合はlocaleで抽出
      return extractAddress(addr, locale);
    }
    // embeddedMasterSpotはJSONB型
    if (embeddedMasterSpot?.google_short_address) {
      return extractAddress(embeddedMasterSpot.google_short_address, locale);
    }
    // ピン刺し・現在地登録の場合はuser_spotの住所を使用
    if ('google_short_address' in spot && spot.google_short_address) {
      const addr = spot.google_short_address;
      if (typeof addr === 'string') {
        return addr;
      }
      return extractAddress(addr, locale);
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

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, spotId: spot.id });
  };

  // ブックマーク処理（フォルダ選択モーダルを開く）
  const handleBookmarkPress = useCallback((e: any) => {
    e.stopPropagation();
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
  const handleSharePress = useCallback(async (e: any) => {
    e.stopPropagation();
    await shareSpot(spot.id);
  }, [spot.id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('spotCard.deleteTitle'),
      t('spotCard.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => onDelete?.(spot.id),
        },
      ]
    );
  }, [spot.id, onDelete, t]);

  // 三点リーダーメニュー項目（オーナー用）
  const ownerMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: t('common.edit'),
      icon: 'create-outline',
      onPress: () => onEdit?.(spot.id),
    },
    {
      id: 'delete',
      label: t('common.delete'),
      icon: 'trash-outline',
      destructive: true,
      onPress: handleDelete,
    },
  ], [spot.id, onEdit, handleDelete, t]);

  // 三点リーダーメニュー項目（オーナー以外用）
  const guestMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'report',
      label: t('common.report'),
      icon: 'flag-outline',
      onPress: () => onReport?.(spot.id),
    },
  ], [spot.id, onReport, t]);

  return (
    <Pressable
      onPress={onPress}
      className={`bg-surface dark:bg-dark-surface p-4 ${noBorder ? '' : 'border-b border-border dark:border-dark-border'}`}
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコン（タップでプロフィールへ） */}
        <Pressable onPress={() => onUserPress?.(spot.user_id)}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted justify-center items-center mr-3">
              <Ionicons name="person" size={20} color={colors.gray[500]} />
            </View>
          )}
        </Pressable>

        {/* ユーザー名と時間 */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(spot.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-foreground dark:text-dark-foreground">
              {user?.display_name || user?.username || t('spotCard.defaultUser')}
            </Text>
          </Pressable>
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
            {formatRelativeTime(spot.created_at, locale)}
          </Text>
        </View>

        {/* 三点リーダーメニュー */}
        {isOwner ? (
          <PopupMenu items={ownerMenuItems} triggerColor={colors.text.secondary} />
        ) : currentUserId && !isOwner ? (
          <PopupMenu items={guestMenuItems} triggerColor={colors.text.secondary} />
        ) : null}
      </View>

      {/* スポット名 */}
      <View className="flex-row items-center mb-1">
        <LocationPinIcon size={18} color={spotColorValue} strokeColor={spotColorStroke} />
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-1">
          {spotName}
        </Text>
      </View>

      {/* 説明 */}
      {spot.description && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
          {spot.description}
        </Text>
      )}

      {/* 画像グリッド（X風2x2グリッド、最大4枚表示） */}
      {(images.length > 0 || imagesLoading) && (
        <View className="mb-2">
          {imagesLoading ? (
            // ローディング中はプレースホルダーを表示
            <View
              className="bg-muted dark:bg-dark-muted rounded-lg"
              style={{ width: screenWidth - 32, height: (screenWidth - 32) * 0.6 }}
            />
          ) : (
            <ImageGrid
              images={images.map(img => img.cloud_path || img.local_path || '').filter(Boolean)}
              containerWidth={screenWidth - 32}
              onImagePress={(index) => {
                const imageUrls = images.map(img => img.cloud_path || img.local_path || '').filter(Boolean);
                openImages(imageUrls, index);
              }}
            />
          )}
        </View>
      )}

      {/* 画像拡大モーダル */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        images={viewerImages}
        initialIndex={initialIndex}
        onClose={closeImage}
      />

      {/* 住所または街情報 */}
      {(address || machiName) && (
        <View className="flex-row items-center mb-2">
          <AddressPinIcon
            size={14}
            color={LOCATION_ICONS.ADDRESS.color}
            holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight}
          />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1" numberOfLines={1}>
            {address || machiName}
          </Text>
        </View>
      )}

      {/* 記事プレビュー / 展開表示 */}
      {hasArticle && articleContent && (
        <View className="mb-2">
          {isArticleExpanded ? (
            // 展開時: RichTextRendererでフォーマット付き表示
            <>
              <RichTextRenderer content={articleContent} />
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setIsArticleExpanded(false);
                }}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Text
                  className="text-sm"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  {t('common.less')}
                </Text>
              </Pressable>
            </>
          ) : (
            // 折りたたみ時: ReadMoreで2行表示
            <ReadMore
              numberOfLines={2}
              seeMoreText={t('common.more')}
              seeLessText=""
              seeMoreStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              style={{ color: isDarkMode ? '#F3F4F6' : '#1F2937', fontSize: 14 }}
              allowFontScaling={false}
              onSeeMore={() => setIsArticleExpanded(true)}
            >
              {articlePreview}
            </ReadMore>
          )}
        </View>
      )}

      {/* タグ */}
      {tags && tags.length > 0 && (
        <View className="flex-row flex-wrap mb-2">
          {tags.slice(0, 5).map((tag) => (
            <Pressable
              key={tag.id}
              onPress={(e) => {
                e.stopPropagation();
                onTagPress?.(tag.name);
              }}
              className="mr-2 mb-1"
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Text className="text-sm text-primary">
                #{tag.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* マップ名 */}
      {mapName && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onMapPress?.(spot.map_id);
          }}
          className="flex-row items-center mb-2 self-start"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Ionicons name="map-outline" size={14} color={colors.text.secondary} />
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {mapName}
          </Text>
        </Pressable>
      )}

      {/* フッター情報 - 均等配置 */}
      <View className="flex-row items-center justify-around mt-2">
        {/* コメント */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onCommentPress?.(spot.id);
          }}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {spot.comments_count}
          </Text>
        </Pressable>

        {/* いいね */}
        <Pressable
          onPress={handleLikePress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={isTogglingLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#EF4444' : colors.text.secondary}
          />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
            {spot.likes_count}
          </Text>
        </Pressable>

        {/* ブックマーク */}
        <Pressable
          onPress={handleBookmarkPress}
          className="flex-row items-center py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isBookmarked ? colors.primary.DEFAULT : colors.text.secondary}
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
            size={18}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}
    </Pressable>
  );
}
