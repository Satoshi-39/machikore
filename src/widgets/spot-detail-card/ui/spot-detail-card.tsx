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
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem, CommentInputModal } from '@/shared/ui';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useSpotImages, useDeleteSpot } from '@/entities/user-spot/api';
import { useToggleSpotLike } from '@/entities/like';
import { useSpotBookmarkInfo, useBookmarkSpot, useUnbookmarkSpotFromFolder } from '@/entities/bookmark';
import { useSpotComments, useAddSpotComment, useAddReplyComment, CommentItem } from '@/entities/comment';
import { useUser } from '@/entities/user';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import { useCommentActions } from '@/features/comment-actions';
import type { SpotWithDetails, UUID } from '@/shared/types';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface SpotDetailCardProps {
  spot: SpotWithDetails;
  currentUserId?: UUID | null;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onEdit?: (spotId: string) => void;
  onUserPress?: (userId: string) => void;
}

export function SpotDetailCard({ spot, currentUserId, onClose, onSnapChange, onEdit, onUserPress }: SpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
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
  const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
  const spotAddress = spot.master_spot?.google_formatted_address;
  const latitude = spot.master_spot?.latitude ?? 0;
  const longitude = spot.master_spot?.longitude ?? 0;

  // スポットの画像を取得
  const { data: images = [] } = useSpotImages(spot.id);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 95%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '95%'], []);

  // 初回マウント時に初期状態（デフォルト状態）を通知
  // Bottom Sheetの初期index=1の場合、onChangeは呼ばれないため手動で通知
  useEffect(() => {
    onSnapChange?.(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    onSnapChange?.(index);
    // index -1 = 閉じた状態 → 親に通知してコンポーネント削除
    if (index === -1) {
      onClose();
    }
  }, [onSnapChange, onClose]);

  // アニメーション中のハンドラー（リアルタイムで状態を通知）
  const handleSheetAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    onSnapChange?.(toIndex);
  }, [onSnapChange]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // 直接onCloseを呼ぶのではなく、BottomSheetをアニメーションで閉じる
    bottomSheetRef.current?.close();
  }, []);

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
        ios: { message: `${spotName}をチェック！`, url },
        default: { message: `${spotName}をチェック！\n${url}` },
      })!);
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [spotName, spot.id]);

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
      onAnimate={handleSheetAnimate}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: colors.text.secondary }}
    >
      <BottomSheetScrollView className="px-4"  contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {spotName}
            </Text>
            {spotAddress && (
              <Text className="text-sm text-gray-600">{spotAddress}</Text>
            )}
          </View>
          <View className="flex-row items-center">
            {/* 三点リーダーメニュー（自分のスポットのみ） */}
            {isOwner && !isDeleting && (
              <View className="mr-2">
                <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
              </View>
            )}
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* 位置情報 */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-1">
            緯度: {latitude.toFixed(4)}, 経度: {longitude.toFixed(4)}
          </Text>
        </View>

        {/* 画像 */}
        {images.length > 0 && (
          <View className="mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.cloud_path || '' }}
                  className="w-32 h-32 rounded-lg mr-2"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 説明 */}
        {spot.description && (
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.text.secondary}
              />
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                説明
              </Text>
            </View>
            <Text className="text-sm text-gray-600 pl-5">{spot.description}</Text>
          </View>
        )}

        {/* 統計情報とアクション */}
        <View className="flex-row items-center justify-around pt-3 border-t border-gray-200 mb-2">
          {/* コメント - タップでシートを拡大 */}
          <Pressable
            className="items-center"
            onPress={() => bottomSheetRef.current?.snapToIndex(2)}
          >
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.comments_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">コメント</Text>
          </Pressable>

          {/* いいねボタン */}
          <Pressable
            className="items-center"
            onPress={handleLikePress}
            disabled={isTogglingLike}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={isLiked ? '#EF4444' : colors.text.secondary}
              />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.likes_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">いいね</Text>
          </Pressable>

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
            <Text className="text-xs text-gray-500">保存</Text>
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
            <Text className="text-xs text-gray-500">共有</Text>
          </Pressable>
        </View>

        {/* コメントセクション */}
        <View className="mt-4 pt-3 border-t border-gray-200">
          <View className="flex-row items-center mb-3">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-gray-800 ml-2">
              コメント
            </Text>
          </View>

          {/* コメント追加ボタン（タップでモーダル表示） */}
          <Pressable
            onPress={openCommentModal}
            className="mb-4 bg-gray-100 rounded-xl px-4 py-3"
          >
            <Text className="text-sm text-gray-400">
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
              <Text className="text-sm text-gray-500">まだコメントはありません</Text>
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
    </>
  );
}
