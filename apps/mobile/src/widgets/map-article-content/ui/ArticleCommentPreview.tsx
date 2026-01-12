/**
 * 記事コメントプレビュー
 *
 * コメントを数件プレビュー表示し、全件表示へのリンクを提供
 * コメント追加・全件表示・編集・削除はすべてモーダルで行う
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ReadOnlyCommentList } from '@/widgets/comment';
import { useI18n } from '@/shared/lib/i18n';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface ArticleCommentPreviewProps {
  comments: CommentWithUser[];
  /** コメント総数 */
  totalCount: number;
  onUserPress: (userId: string) => void;
  /** コメントモーダルを開く（focusCommentId: 特定のコメントにフォーカス） */
  onOpenCommentModal: (focusCommentId?: string) => void;
}

export function ArticleCommentPreview({
  comments,
  totalCount,
  onUserPress,
  onOpenCommentModal,
}: ArticleCommentPreviewProps) {
  const { t } = useI18n();

  return (
    <View className="mt-6">
      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-3">
        {t('article.comment')}
      </Text>

      {/* コメント追加ボタン（タップでモーダル表示） */}
      <Pressable
        onPress={() => onOpenCommentModal()}
        className="mb-4 bg-muted dark:bg-dark-muted rounded-xl px-4 py-3"
      >
        <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
          {t('article.addComment')}
        </Text>
      </Pressable>

      {/* コメント一覧（読み取り専用） */}
      <View className="-mx-4">
        <ReadOnlyCommentList
          comments={comments}
          totalCount={totalCount}
          onUserPress={onUserPress}
          onOpenCommentModal={onOpenCommentModal}
        />
      </View>
    </View>
  );
}
