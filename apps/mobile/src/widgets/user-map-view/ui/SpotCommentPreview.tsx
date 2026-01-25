/**
 * スポットコメントプレビュー
 *
 * コメントを数件プレビュー表示し、全件表示へのリンクを提供
 * コメント追加・全件表示・編集・削除はすべてモーダルで行う
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '@/shared/lib/i18n';
import { ReadOnlyCommentList } from '@/widgets/comment';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface SpotCommentPreviewProps {
  /** スポットID */
  spotId: string;
  /** コメント総数 */
  commentsCount: number;
  /** コメント一覧 */
  comments: CommentWithUser[];
  /** コメント読み込み中 */
  isLoading: boolean;
  /** ユーザータップ時 */
  onUserPress: (userId: string) => void;
  /** コメントモーダルを開く */
  onOpenCommentModal: (options?: { focusCommentId?: string; autoFocus?: boolean }) => void;
}

export function SpotCommentPreview({
  commentsCount,
  comments,
  isLoading,
  onUserPress,
  onOpenCommentModal,
}: SpotCommentPreviewProps) {
  const { t } = useI18n();

  return (
    <View className="mt-4 pt-3 border-t border-outline">
      <View className="flex-row items-center mb-3">
        <Ionicons name="chatbubble-outline" size={18} className="text-on-surface-variant" />
        <Text className="text-base font-semibold text-on-surface ml-2">
          {t('common.comment')} ({commentsCount})
        </Text>
      </View>

      {/* コメント追加ボタン（タップでモーダル表示 + キーボード自動表示） */}
      <Pressable
        onPress={() => onOpenCommentModal({ autoFocus: true })}
        className="mb-4 bg-secondary rounded-xl px-4 py-3"
      >
        <Text className="text-sm text-on-surface-variant">
          {t('comment.addPlaceholder')}
        </Text>
      </Pressable>

      {/* コメント一覧（読み取り専用） */}
      {isLoading ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" className="text-primary" />
        </View>
      ) : (
        <ReadOnlyCommentList
          comments={comments}
          totalCount={commentsCount}
          onUserPress={onUserPress}
          onOpenCommentModal={(focusCommentId) => {
            onOpenCommentModal(focusCommentId ? { focusCommentId } : undefined);
          }}
        />
      )}
    </View>
  );
}
