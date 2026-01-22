/**
 * コメントモーダルを開くためのhook
 *
 * 各ページでコメントモーダルのvisible状態を管理
 */

import { useState, useCallback } from 'react';

interface CommentModalOptions {
  focusCommentId?: string;
  autoFocus?: boolean;
}

interface CommentModalTarget {
  type: 'spot' | 'map';
  id: string;
  options?: CommentModalOptions;
}

export function useCommentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [target, setTarget] = useState<CommentModalTarget | null>(null);

  const openSpotCommentModal = useCallback((spotId: string, options?: CommentModalOptions) => {
    setTarget({ type: 'spot', id: spotId, options });
    setIsVisible(true);
  }, []);

  const openMapCommentModal = useCallback((mapId: string, options?: CommentModalOptions) => {
    setTarget({ type: 'map', id: mapId, options });
    setIsVisible(true);
  }, []);

  const closeCommentModal = useCallback(() => {
    setIsVisible(false);
    // targetはモーダルが完全に閉じてからリセット（アニメーション中にnullにしない）
    setTimeout(() => {
      setTarget(null);
    }, 300);
  }, []);

  return {
    isVisible,
    target,
    openSpotCommentModal,
    openMapCommentModal,
    closeCommentModal,
  };
}
