/**
 * カスタムマップ上で選択されたスポットの詳細情報カード
 *
 * いいね状態は spot.is_liked を使用（取得時にJOINで取得）
 */

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, Alert, Share, ActivityIndicator, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, LOCATION_ICONS, SPOT_COLORS, SPOT_COLOR_LIST, getSpotColorStroke, DEFAULT_SPOT_COLOR, type SpotColor } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { PopupMenu, type PopupMenuItem, CommentInputModal, ImageViewerModal, useImageViewer, LocationPinIcon, AddressPinIcon, RichTextRenderer } from '@/shared/ui';
import { showLoginRequiredAlert, useSearchBarSync, useLocationButtonSync } from '@/shared/lib';
import { useSpotImages, useDeleteSpot } from '@/entities/user-spot/api';
import { useToggleSpotLike } from '@/entities/like';
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { useSpotComments, useAddSpotComment, useAddReplyComment, CommentItem } from '@/entities/comment';
import { useUser } from '@/entities/user';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { LikersModal } from '@/features/view-likers';
import { useCommentActions } from '@/features/comment-actions';
import type { SpotWithDetails, UUID } from '@/shared/types';
import type { CommentWithUser } from '@/shared/api/supabase/comments';
import { log } from '@/shared/config/logger';

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

// 検索バー領域の下端Y座標（固定値）
const SEARCH_BAR_BOTTOM_Y = 140;

export function SpotDetailCard({ spot, currentUserId, onClose, onSnapChange, onExpandedChange, onEdit, onUserPress, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange, onCameraMove }: SpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleSpotLike();
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
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // コメント関連
  const { data: comments = [], isLoading: isLoadingComments } = useSpotComments(spot.id, 50, 0, currentUserId);
  const { data: currentUser } = useUser(currentUserId ?? null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);

  // コメント投稿
  const { mutate: addComment, isPending: isAddingComment } = useAddSpotComment();
  const { mutate: addReply, isPending: isAddingReply } = useAddReplyComment();
  const isSubmitting = isAddingComment || isAddingReply;

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
  } = useCommentActions({ spotId: spot.id, currentUserId });

  // コメントモーダルを開く
  const openCommentModal = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('コメント');
      return;
    }
    setIsCommentModalVisible(true);
  }, [currentUserId]);

  // コメントモーダルを閉じる
  const closeCommentModal = useCallback(() => {
    setIsCommentModalVisible(false);
    setReplyingTo(null);
  }, []);

  // 返信ハンドラー
  const handleReply = useCallback((comment: CommentWithUser) => {
    if (!currentUserId) {
      showLoginRequiredAlert('返信');
      return;
    }
    setReplyingTo(comment);
    setIsCommentModalVisible(true);
  }, [currentUserId]);

  // 返信キャンセル
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // コメント送信
  const handleCommentSubmit = useCallback(() => {
    if (!currentUserId || !inputText.trim() || isSubmitting) return;

    const content = inputText.trim();

    const onSuccess = () => {
      setInputText('');
      setReplyingTo(null);
      setIsCommentModalVisible(false);
      Keyboard.dismiss();
    };

    if (replyingTo) {
      addReply(
        { userId: currentUserId, parentComment: replyingTo, content },
        { onSuccess }
      );
    } else {
      addComment(
        { userId: currentUserId, spotId: spot.id, content },
        { onSuccess }
      );
    }
  }, [currentUserId, inputText, replyingTo, spot.id, addReply, addComment, isSubmitting]);

  // 返信先の表示名
  const replyTarget = replyingTo
    ? { displayName: replyingTo.user?.display_name || replyingTo.user?.username || '' }
    : null;

  // いいね状態と数は spot から直接取得（キャッシュの楽観的更新で自動反映）
  const isLiked = spot.is_liked ?? false;

  // SpotWithDetailsから表示用データを抽出
  // マスタースポットの正式名称（メイン表示）
  const masterSpotName = spot.master_spot?.name || '不明なスポット';
  // ユーザーの一言（サブ表示）
  const oneWord = spot.custom_name;
  const spotAddress = spot.master_spot?.google_short_address || spot.google_short_address;

  // スポットのカラーを取得（ラベル色を優先、なければspot_color、それもなければデフォルト）
  const spotColor = useMemo((): SpotColor => {
    // ラベルが設定されている場合はラベル色を優先
    if (spot.map_label?.color) {
      const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
      if (labelColorKey) return labelColorKey;
    }
    // スポット色が設定されている場合
    if (spot.spot_color) {
      return spot.spot_color as SpotColor;
    }
    return DEFAULT_SPOT_COLOR;
  }, [spot.map_label?.color, spot.spot_color]);
  const spotColorValue = SPOT_COLORS[spotColor]?.color ?? SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
  const spotColorStroke = getSpotColorStroke(spotColor, isDarkMode);

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

  // いいねトグル
  const handleLikePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, spotId: spot.id });
  }, [currentUserId, spot.id, toggleLike, isTogglingLike]);

  // ブックマークボタン押下 → フォルダ選択モーダルを開く
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
    try {
      const url = `machikore://spots/${spot.id}`;
      await Share.share(Platform.select({
        ios: { message: `${masterSpotName}をチェック！`, url },
        default: { message: `${masterSpotName}をチェック！\n${url}` },
      })!);
    } catch (error) {
      log.error('[SpotDetailCard] Share error:', error);
    }
  }, [masterSpotName, spot.id]);

  // 削除確認ダイアログ
  const handleDeleteSpot = useCallback(() => {
    Alert.alert(
      'スポットを削除',
      'このスポットを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteSpot(spot.id);
            onClose();
          },
        },
      ]
    );
  }, [spot.id, deleteSpot, onClose]);

  // 三点リーダーメニュー項目
  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit?.(spot.id),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: handleDeleteSpot,
    },
  ], [spot.id, onEdit, handleDeleteSpot]);

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
            {oneWord && (
              <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary">
                {oneWord}
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

        {/* 概要（ラベルなし） */}
        {spot.description && (
          <View className="mb-3">
            <Text className="text-sm text-foreground dark:text-dark-foreground">{spot.description}</Text>
          </View>
        )}

        {/* 統計情報とアクション */}
        <View className="flex-row items-center justify-around pt-3 border-t border-border dark:border-dark-border mb-2">
          {/* コメント - タップでシートを拡大 */}
          <Pressable
            className="items-center"
            onPress={() => bottomSheetRef.current?.snapToIndex(2)}
          >
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">
                {spot.comments_count}
              </Text>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">コメント</Text>
          </Pressable>

          {/* いいねボタン（アイコン：トグル、数字：ユーザー一覧） */}
          <View className="items-center">
            <View className="flex-row items-center">
              <Pressable
                onPress={handleLikePress}
                disabled={isTogglingLike}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isLiked ? '#EF4444' : colors.text.secondary}
                />
              </Pressable>
              <Pressable
                onPress={() => setIsLikersModalVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
              >
                <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">
                  {spot.likes_count}
                </Text>
              </Pressable>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">いいね</Text>
          </View>

          {/* ブックマークボタン */}
          <Pressable
            className="items-center"
            onPress={handleBookmarkPress}
            disabled={isAddingBookmark || isRemovingFromFolder}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primary.DEFAULT : colors.text.secondary}
              />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">保存</Text>
          </Pressable>

          {/* 共有ボタン */}
          <Pressable
            className="items-center"
            onPress={handleSharePress}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="share-outline"
                size={18}
                color={colors.text.secondary}
              />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">共有</Text>
          </Pressable>
        </View>

        {/* 記事セクション */}
        <View className="mt-4 pt-3 border-t border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="document-text-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              記事
            </Text>
          </View>
          {spot.article_content ? (
            <RichTextRenderer content={spot.article_content} />
          ) : (
            <View className="py-4 items-center">
              <Ionicons name="document-text-outline" size={24} color={colors.gray[400]} />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
                まだ記事がありません
              </Text>
            </View>
          )}
        </View>

        {/* コメントセクション */}
        <View className="mt-4 pt-3 border-t border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              コメント
            </Text>
          </View>

          {/* コメント追加ボタン（タップでモーダル表示） */}
          <Pressable
            onPress={openCommentModal}
            className="mb-4 bg-muted dark:bg-dark-muted rounded-xl px-4 py-3"
          >
            <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
              コメントを追加...
            </Text>
          </Pressable>

          {/* コメント一覧 */}
          {isLoadingComments ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : comments.length === 0 ? (
            <View className="py-4 items-center">
              <Ionicons name="chatbubble-outline" size={24} color={colors.gray[400]} />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
                まだコメントはありません
              </Text>
            </View>
          ) : (
            <View className="-mx-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onUserPress={handleUserPressInternal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleCommentLike}
                  onReply={handleReply}
                />
              ))}
            </View>
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

    {/* コメント入力モーダル */}
    <CommentInputModal
      visible={isCommentModalVisible}
      onClose={closeCommentModal}
      avatarUrl={currentUser?.avatar_url}
      inputText={inputText}
      onChangeText={setInputText}
      onSubmit={handleCommentSubmit}
      isSubmitting={isSubmitting}
      replyingTo={replyTarget}
      onCancelReply={cancelReply}
    />

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
