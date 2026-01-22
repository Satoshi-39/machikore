/**
 * 作成メニューページ
 *
 * 作成できるコンテンツの選択肢を表示
 */

import React from 'react';
import { CreateMenuSheet } from '@/widgets/create-menu-sheet';

interface CreateMenuPageProps {
  onCreateMap: () => void;
  onCreateSpot: () => void;
  onCreateArticle: () => void;
  onClose: () => void;
}

export function CreateMenuPage({
  onCreateMap,
  onCreateSpot,
  onCreateArticle,
  onClose,
}: CreateMenuPageProps) {
  return (
    <CreateMenuSheet
      onCreateMap={onCreateMap}
      onCreateSpot={onCreateSpot}
      onCreateArticle={onCreateArticle}
      onClose={onClose}
    />
  );
}
