/**
 * コメントモーダル画面
 *
 * Expo Routerのtransparent modal用のラッパー
 * 実際のロジックはCommentModalSheet Widgetに委譲
 */

import React from 'react';
import { CommentModalSheet } from '@/widgets/comment-modal';

interface CommentModalPageProps {
  type: 'spot' | 'map';
  targetId: string;
  onClose: () => void;
  /** 開いた時に自動でキーボードを表示 */
  autoFocus?: boolean;
  /** 特定のコメントの返信詳細を開く */
  focusCommentId?: string;
}

export function CommentModalPage(props: CommentModalPageProps) {
  return <CommentModalSheet {...props} />;
}
