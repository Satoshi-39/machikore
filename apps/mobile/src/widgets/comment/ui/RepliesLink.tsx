/**
 * RepliesLink Widget
 *
 * 「◯件の返信を表示」リンク
 * タップで返信詳細モードへ遷移
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';
import type { CommentWithUser } from '@/shared/api/supabase/comments';

interface RepliesLinkProps {
  /** コメント */
  comment: CommentWithUser;
  /** 返信表示タップ時 */
  onShowReplies: (comment: CommentWithUser) => void;
}

export function RepliesLink({ comment, onShowReplies }: RepliesLinkProps) {
  const { t } = useI18n();

  if (comment.replies_count === 0) return null;

  return (
    <View className="pl-12">
      <Pressable onPress={() => onShowReplies(comment)} className="py-2">
        <Text className="text-sm text-primary font-medium">
          {t('comment.showReplies', { count: comment.replies_count })}
        </Text>
      </Pressable>
    </View>
  );
}
