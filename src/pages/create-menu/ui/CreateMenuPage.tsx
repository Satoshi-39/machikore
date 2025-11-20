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
  onCreateBlog: () => void;
  onClose: () => void;
}

export function CreateMenuPage({
  onCreateMap,
  onCreateSpot,
  onCreateBlog,
  onClose,
}: CreateMenuPageProps) {
  return (
    <CreateMenuSheet
      onCreateMap={onCreateMap}
      onCreateSpot={onCreateSpot}
      onCreateBlog={onCreateBlog}
      onClose={onClose}
    />
  );
}
