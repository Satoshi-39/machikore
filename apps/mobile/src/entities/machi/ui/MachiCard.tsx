/**
 * 街カード（クリック可能）
 *
 * FSDの原則：Entities層のUIコンポーネント
 * - ビジネスエンティティ（街）の表示
 * - クリックアクションは props で受け取る
 */

import React from 'react';
import { Pressable } from 'react-native';
import type { MachiRow } from '@/shared/types/database.types';
import { Machi } from './Machi';

interface MachiCardProps {
  machi: MachiRow;
  isVisited?: boolean;
  visitCount?: number;
  onPress?: () => void;
}

export function MachiCard({
  machi,
  isVisited = false,
  visitCount = 0,
  onPress,
}: MachiCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`${machi.name}の詳細を表示`}
      disabled={!onPress}
    >
      <Machi machi={machi} isVisited={isVisited} visitCount={visitCount} />
    </Pressable>
  );
}
