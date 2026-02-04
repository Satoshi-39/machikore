/**
 * カスタムマップ上で選択されたスポットの詳細情報カード
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { colors, LOCATION_ICONS, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PopupMenu, type PopupMenuItem, ImageViewerModal, useImageViewer, LocationPinIcon, AddressPinIcon, RichTextRenderer, ShareButton, DirectionsButton, PhotoGrid, PrivateBadge } from '@/shared/ui';
import { useSearchBarSync, useLocationButtonSync, useSpotColor, useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotComments } from '@/entities/comment';
import { SpotLikeButton } from '@/features/spot-like';
import { SpotBookmarkButton } from '@/features/spot-bookmark';
import { SpotCommentPreview } from './SpotCommentPreview';
import { LikersModal } from '@/features/view-likers';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import type { SpotWithDetails, UUID } from '@/shared/types';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

interface DeleteSpotContext {
  isPublic?: boolean;
  publicSpotsCount?: number;
}

interface SpotDetailCardProps {
  spot: SpotWithDetails;
  currentUserId?: UUID | null;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  /** 拡大状態（ヘッダー非表示）への遷移通知 - snapIndex=2で拡大状態 */
  onExpandedChange?: (isExpanded: boolean) => void;
  onEdit?: (spotId: string) => void;
  onDelete?: (spotId: string, context?: DeleteSpotContext) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** カメラをスポットに移動（目のアイコンタップ時） */
  onCameraMove?: () => void;
  /** マップの公開スポット数（最後のスポット削除時の警告用） */
  publicSpotsCount?: number;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function SpotDetailCardContent({
  searchBarBottomY,
  onSearchBarVisibilityChange,
  onLocationButtonVisibilityChange,
}: {
  searchBarBottomY: number;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
}) {
  useSearchBarSync({
    searchBarBottomY,
    onVisibilityChange: onSearchBarVisibilityChange ?? (() => {}),
  });

  useLocationButtonSync({
    onVisibilityChange: onLocationButtonVisibilityChange ?? (() => {}),
  });

  return null;
}

// ヘッダー・ラベルチップ・拡大ボタン領域の下端Y座標（固定値）
// カードがこの位置より上に来たらヘッダー・ラベルチップ・拡大ボタンを非表示にする
// 拡大ボタンの追加に伴い、180→240に調整
const SEARCH_BAR_BOTTOM_Y = 240;

export function SpotDetailCard({ spot, currentUserId, onClose, onSnapChange, onExpandedChange, onEdit, onDelete, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange, onCameraMove, publicSpotsCount = 0 }: SpotDetailCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // コメントモーダル
  const {
    isVisible: isCommentModalVisible,
    target: commentTarget,
    openSpotCommentModal,
    closeCommentModal,
  } = useCommentModal();

  // コメント関連（プレビュー用）
  const { data: commentsData, isLoading: isLoadingComments } = useSpotComments(spot.id, { currentUserId, authorId: spot.user_id, author: spot.user });
  const comments = commentsData?.pages.flat() ?? [];

  // タグ情報（JOINで取得済みのspot.tagsを使用 - N+1問題回避）
  const tags = spot.tags || [];

  // いいね状態と数は spot から直接取得（キャッシュの楽観的更新で自動反映）
  const isLiked = spot.is_liked ?? false;

  // スポット名（spot.languageで抽出）
  // master_spotがある場合はその名前（JSONB）、ない場合（ピン刺し・現在地登録）はspot.name（TEXT）を使用
  const spotLanguage = spot.language || 'ja';
  const masterSpotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, spotLanguage) || t('spot.unknownSpot')
    : (spot.name ? spot.name : null) || t('spot.unknownSpot');
  // 住所（spot.languageで抽出）
  const spotAddress = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
    || extractAddress(spot.google_short_address, spotLanguage);

  // スポットのカラーを取得（ラベル色を優先、なければspot_color、それもなければデフォルト）
  const { colorValue: spotColorValue, strokeColor: spotColorStroke } = useSpotColor(spot, isDarkMode);

  // スポットの画像（JOINで取得済みのimage_urlsを使用 - N+1問題回避）
  const images = spot.image_urls || [];

  // 画像ビューアー
  const imageViewer = useImageViewer();

  // 画像タップハンドラー
  const handleImagePress = useCallback((index: number) => {
    if (images.length > 0) {
      imageViewer.openImages(images, index);
    }
  }, [images, imageViewer]);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 12%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['12%', '45%', '90%'], []);

  // 初回マウント時に初期状態（デフォルト状態）を通知
  // Bottom Sheetの初期index=1の場合、onChangeは呼ばれないため手動で通知
  useEffect(() => {
    onSnapChange?.(1);
    onExpandedChange?.(false); // 初期状態は拡大ではない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー（スナップ確定時のみ呼ばれる）
  const handleSheetChanges = useCallback((index: number) => {
    // index -1 = 閉じた状態 → デフォルト状態(1)にリセットして親に通知
    if (index === -1) {
      onSnapChange?.(1);
      onExpandedChange?.(false); // 閉じた時は拡大ではない
      onClose();
    } else {
      onSnapChange?.(index);
      onExpandedChange?.(index === 2); // index=2の時のみ拡大状態
    }
  }, [onSnapChange, onExpandedChange, onClose]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // まず現在地ボタンを非表示にしてから、BottomSheetを閉じる
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // ユーザープレスハンドラー
  const handleUserPressInternal = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}`);
  }, [router, currentTab]);

  // タグプレスハンドラー
  const handleTagPress = useCallback((tagName: string) => {
    router.push(`/(tabs)/${currentTab}/search?tag=${encodeURIComponent(tagName)}`);
  }, [router, currentTab]);

  // 削除ハンドラ（ロジックはuseSpotDelete側で処理）
  const handleDeleteSpot = useCallback(() => {
    onDelete?.(spot.id, { isPublic: spot.is_public, publicSpotsCount });
  }, [spot.id, spot.is_public, publicSpotsCount, onDelete]);

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
      onPress: handleDeleteSpot,
    },
  ], [spot.id, onEdit, handleDeleteSpot, t]);

  // 三点リーダーメニュー項目（オーナー以外用）
  const guestMenuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'report',
      label: t('common.report'),
      icon: 'flag-outline',
      onPress: () => router.push(`/report?targetType=spot&targetId=${spot.id}`),
    },
  ], [spot.id, router, t]);

  return (
    <>
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={false}
      backgroundStyle={{ backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"] }}
    >
      {/* 検索バー・現在地ボタン同期用の内部コンポーネント */}
      <SpotDetailCardContent
        searchBarBottomY={SEARCH_BAR_BOTTOM_Y}
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      {/* 固定ヘッダー（スクロールしても固定） */}
      <View className="px-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            {/* マスタースポット正式名称（メイン） */}
            <View className="flex-row mb-1">
              <View className="mt-1">
                {/* 非公開スポットは鍵アイコン、公開スポットはピンアイコン */}
                {isOwner && spot.is_public === false ? (
                  <PrivateBadge size="lg" />
                ) : (
                  <LocationPinIcon size={iconSizeNum.md} color={spotColorValue} strokeColor={spotColorStroke} />
                )}
              </View>
              <View className="ml-2 flex-1">
                <Text className="text-xl font-bold text-on-surface">
                  {masterSpotName}
                </Text>
              </View>
            </View>
            {/* 住所 */}
            {spotAddress && (
              <View className="flex-row items-center mt-1">
                <AddressPinIcon size={iconSizeNum.xs} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
                <Text className="text-sm text-on-surface-variant ml-1">{spotAddress}</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-3">
            {/* カメラ移動ボタン（目のアイコン） */}
            <Pressable
              onPress={onCameraMove}
              hitSlop={4}
              className="w-8 h-8 items-center justify-center rounded-full active:bg-secondary"
            >
              <Ionicons name="eye-outline" size={iconSizeNum.lg} className="text-on-surface-variant" />
            </Pressable>
            {/* 三点リーダーメニュー */}
            {isOwner ? (
              <PopupMenu items={ownerMenuItems} />
            ) : currentUserId && !isOwner ? (
              <PopupMenu items={guestMenuItems} />
            ) : null}
            <Pressable
              onPress={handleClose}
              hitSlop={4}
              className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
            >
              <Ionicons name="close" size={iconSizeNum.md} className="text-on-surface-variant" />
            </Pressable>
          </View>
        </View>

      </View>

      {/* スクロール可能なコンテンツ */}
      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* 画像（Google Maps風 横スクロール：大→小小→大→小小...） */}
        {images.length > 0 && (
          <View className="mb-3 -mx-4 px-4">
            <PhotoGrid
              images={images}
              onImagePress={handleImagePress}
            />
          </View>
        )}

        {/* ユーザーの一言 */}
        {spot.description && (
          <Text className="text-lg font-bold text-on-surface mb-3">
            {spot.description}
          </Text>
        )}

        {/* タグ */}
        {tags.length > 0 && (
          <View className="flex-row flex-wrap mb-3">
            {tags.map((tag) => (
              <Pressable
                key={tag.id}
                onPress={() => handleTagPress(tag.name)}
                className="mr-2 mb-1"
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Text className="text-sm text-tag">
                  #{tag.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* アクションボタン */}
        <View className="flex-row items-center justify-around pt-4 pb-1">
          <SpotLikeButton
            spotId={spot.id}
            currentUserId={currentUserId}
            isLiked={isLiked}
            likesCount={spot.likes_count}
            onCountPress={() => setIsLikersModalVisible(true)}
          />
          <SpotBookmarkButton
            spotId={spot.id}
            currentUserId={currentUserId}
            isBookmarked={spot.is_bookmarked}
          />
          <DirectionsButton
            latitude={spot.master_spot?.latitude ?? spot.latitude ?? 0}
            longitude={spot.master_spot?.longitude ?? spot.longitude ?? 0}
          />
          <ShareButton type="spot" username={spot.user?.username || ''} mapId={spot.map_id} id={spot.id} />
        </View>

        {/* 記事セクション */}
        <View className="mt-4 pt-3 border-t-thin border-outline">
          <View className="flex-row items-center mb-3">
            <Ionicons name="document-text-outline" size={iconSizeNum.sm} className="text-on-surface-variant" />
            <Text className="text-base font-semibold text-on-surface ml-2">
              {t('spot.article')}
            </Text>
          </View>
          {spot.article_content ? (
            <RichTextRenderer content={spot.article_content} textClassName="text-base text-on-surface leading-loose" />
          ) : (
            <View className="py-4 items-center">
              <Ionicons name="document-text-outline" size={iconSizeNum.lg} className="text-gray-400" />
              <Text className="text-sm text-on-surface-variant mt-1">
                {t('spot.noArticle')}
              </Text>
            </View>
          )}
        </View>

        {/* コメントセクション */}
        <SpotCommentPreview
          spotId={spot.id}
          commentsCount={spot.comments_count}
          comments={comments}
          isLoading={isLoadingComments}
          onUserPress={handleUserPressInternal}
          onOpenCommentModal={(options) => {
            openSpotCommentModal(spot.id, options);
          }}
        />
      </BottomSheetScrollView>
    </BottomSheet>

    {/* 画像拡大表示モーダル */}
    <ImageViewerModal
      visible={imageViewer.isOpen}
      images={imageViewer.images}
      initialIndex={imageViewer.initialIndex}
      onClose={imageViewer.closeImage}
    />

    {/* いいねユーザー一覧モーダル */}
    <LikersModal
      visible={isLikersModalVisible}
      spotId={spot.id}
      onClose={() => setIsLikersModalVisible(false)}
      onUserPress={handleUserPressInternal}
    />

    {/* コメントモーダル */}
    {commentTarget && (
      <CommentModalSheet
        visible={isCommentModalVisible}
        type={commentTarget.type}
        targetId={commentTarget.id}
        onClose={closeCommentModal}
        onUserPress={handleUserPressInternal}
        autoFocus={commentTarget.options?.autoFocus}
        focusCommentId={commentTarget.options?.focusCommentId}
      />
    )}
    </>
  );
}
