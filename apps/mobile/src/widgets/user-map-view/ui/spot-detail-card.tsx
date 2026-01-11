/**
 * カスタムマップ上で選択されたスポットの詳細情報カード
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, LOCATION_ICONS } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PopupMenu, type PopupMenuItem, ImageViewerModal, useImageViewer, LocationPinIcon, AddressPinIcon, RichTextRenderer, LikeButton, BookmarkButton, ShareButton, DirectionsButton } from '@/shared/ui';
import { useSearchBarSync, useLocationButtonSync, useSpotColor } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotImages, useDeleteSpot } from '@/entities/user-spot/api';
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { useSpotComments } from '@/entities/comment';
import { CommentPreview, CommentModal } from '@/widgets/comment';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import type { SpotWithDetails, UUID } from '@/shared/types';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';

interface SpotDetailCardProps {
  spot: SpotWithDetails;
  currentUserId?: UUID | null;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  /** 拡大状態（ヘッダー非表示）への遷移通知 - snapIndex=2で拡大状態 */
  onExpandedChange?: (isExpanded: boolean) => void;
  onEdit?: (spotId: string) => void;
  onUserPress?: (userId: string) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** カメラをスポットに移動（目のアイコンタップ時） */
  onCameraMove?: () => void;
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

export function SpotDetailCard({ spot, currentUserId, onClose, onSnapChange, onExpandedChange, onEdit, onUserPress, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange, onCameraMove }: SpotDetailCardProps) {
  const { t, locale } = useI18n();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();
  const { data: bookmarkInfo = [] } = useSpotBookmarkInfo(currentUserId, spot.id);
  const isBookmarked = bookmarkInfo.length > 0;
  // ブックマーク済みフォルダIDのSetを作成
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );
  const { mutate: addBookmark, isPending: isAddingBookmark } = useBookmarkSpot();
  const { mutate: removeFromFolder, isPending: isRemovingFromFolder } = useUnbookmarkSpotFromFolder();
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // コメント関連（プレビュー用に最初の1件だけ取得）
  const { data: comments = [], isLoading: isLoadingComments } = useSpotComments(spot.id, 1, 0, currentUserId);

  // いいね状態と数は spot から直接取得（キャッシュの楽観的更新で自動反映）
  const isLiked = spot.is_liked ?? false;

  // スポット名（JSONB型を現在のlocaleで抽出）
  // master_spotがある場合はその名前、ない場合（ピン刺し・現在地登録）はspot.nameを使用
  const masterSpotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('spot.unknownSpot')
    : (spot.name ? extractName(spot.name, locale) : null) || t('spot.unknownSpot');
  // 住所（JSONB型を現在のlocaleで抽出）
  const spotAddress = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);

  // スポットのカラーを取得（ラベル色を優先、なければspot_color、それもなければデフォルト）
  const { colorValue: spotColorValue, strokeColor: spotColorStroke } = useSpotColor(spot, isDarkMode);

  // スポットの画像を取得
  const { data: images = [] } = useSpotImages(spot.id);

  // 画像ビューアー
  const imageViewer = useImageViewer();

  // 画像タップハンドラー
  const handleImagePress = useCallback((index: number) => {
    const imageUrls = images.map((img) => img.cloud_path || '').filter(Boolean);
    if (imageUrls.length > 0) {
      imageViewer.openImages(imageUrls, index);
    }
  }, [images, imageViewer]);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

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
    onUserPress?.(userId);
  }, [onUserPress]);

  // ブックマーク: フォルダ選択モーダルを開く
  const openFolderModal = useCallback(() => {
    setIsFolderModalVisible(true);
  }, []);

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

  // 削除確認ダイアログ
  const handleDeleteSpot = useCallback(() => {
    Alert.alert(
      t('spot.deleteSpot'),
      t('spot.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteSpot(spot.id);
            onClose();
          },
        },
      ]
    );
  }, [spot.id, deleteSpot, onClose, t]);

  // 三点リーダーメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => [
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
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary }}
    >
      {/* 検索バー・現在地ボタン同期用の内部コンポーネント */}
      <SpotDetailCardContent
        searchBarBottomY={SEARCH_BAR_BOTTOM_Y}
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            {/* マスタースポット正式名称（メイン） */}
            <View className="flex-row items-center mb-1">
              <LocationPinIcon size={24} color={spotColorValue} strokeColor={spotColorStroke} />
              <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground ml-2 flex-1">
                {masterSpotName}
              </Text>
            </View>
            {/* ユーザーの一言（サブ） */}
            {spot.description && (
              <Text className="text-lg text-foreground-secondary dark:text-dark-foreground-secondary">
                {spot.description}
              </Text>
            )}
          </View>
          <View className="flex-row items-center mt-0.5">
            {/* カメラ移動ボタン（目のアイコン） */}
            <Pressable
              onPress={onCameraMove}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-8 h-8 items-center justify-center rounded-full mr-2 active:bg-gray-100 dark:active:bg-gray-700"
            >
              <Ionicons name="eye-outline" size={22} color={colors.text.secondary} />
            </Pressable>
            {/* 三点リーダーメニュー（自分のスポットのみ） */}
            {isOwner && !isDeleting && (
              <View className="mr-2">
                <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
              </View>
            )}
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* 画像（画像がある場合のみ表示） */}
        {images.length > 0 ? (
          <View className="mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {images.map((image, index) => (
                <Pressable
                  key={image.id}
                  onPress={() => handleImagePress(index)}
                  className="active:opacity-80"
                >
                  <Image
                    source={{ uri: image.cloud_path || '' }}
                    className="w-32 h-32 rounded-lg mr-2"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* 住所 */}
        {spotAddress && (
          <View className="flex-row items-center mb-3">
            <AddressPinIcon size={14} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">{spotAddress}</Text>
          </View>
        )}

        {/* アクションボタン */}
        <View className="flex-row items-center justify-around pt-4 pb-1 border-t border-border dark:border-dark-border">
          <LikeButton
            spotId={spot.id}
            currentUserId={currentUserId}
            isLiked={isLiked}
            likesCount={spot.likes_count}
            onCountPress={() => setIsLikersModalVisible(true)}
          />
          <BookmarkButton
            isBookmarked={isBookmarked}
            currentUserId={currentUserId}
            onPress={openFolderModal}
            isPending={isAddingBookmark || isRemovingFromFolder}
          />
          <DirectionsButton
            latitude={spot.master_spot?.latitude ?? spot.latitude ?? 0}
            longitude={spot.master_spot?.longitude ?? spot.longitude ?? 0}
          />
          <ShareButton type="spot" id={spot.id} />
        </View>

        {/* 記事セクション */}
        <View className="mt-4 pt-3 border-t border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="document-text-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              {t('spot.article')}
            </Text>
          </View>
          {spot.article_content ? (
            <RichTextRenderer content={spot.article_content} />
          ) : (
            <View className="py-4 items-center">
              <Ionicons name="document-text-outline" size={24} color={colors.gray[400]} />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
                {t('spot.noArticle')}
              </Text>
            </View>
          )}
        </View>

        {/* コメントセクション */}
        <View className="mt-4 pt-3 border-t border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              {t('common.comment')}
            </Text>
          </View>

          {/* コメント追加ボタン（タップでモーダル表示） */}
          <Pressable
            onPress={() => setIsCommentModalVisible(true)}
            className="mb-4 bg-muted dark:bg-dark-muted rounded-xl px-4 py-3"
          >
            <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
              {t('comment.addPlaceholder')}
            </Text>
          </Pressable>

          {/* コメントプレビュー */}
          {isLoadingComments ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : (
            <CommentPreview
              comments={comments}
              totalCount={spot.comments_count}
              currentUserId={currentUserId}
              onUserPress={handleUserPressInternal}
              onViewAll={() => setIsCommentModalVisible(true)}
            />
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>

    {/* フォルダ選択モーダル（BottomSheetの外に配置） */}
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

    {/* コメントモーダル */}
    <CommentModal
      visible={isCommentModalVisible}
      onClose={() => setIsCommentModalVisible(false)}
      type="spot"
      targetId={spot.id}
      currentUserId={currentUserId}
      onUserPress={handleUserPressInternal}
    />

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
    </>
  );
}
