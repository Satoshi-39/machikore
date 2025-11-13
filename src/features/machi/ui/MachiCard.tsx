/**
 * 街カード（クリック可能）
 *
 * FSDの原則：Features層はユーザーアクションを実現する機能
 * - クリックイベント
 * - 画面遷移ロジック
 * - インタラクション
 */

import React from 'react';
import { Pressable } from 'react-native';
import type { MachiRow } from '@/shared/types/database.types';
import { Machi } from '@/entities/machi';

interface MachiCardProps {
  station: MachiRow;
  isVisited?: boolean;
  visitCount?: number;
}

export function MachiCard({ station, isVisited = false, visitCount = 0 }: MachiCardProps) {
  const handlePress = () => {
    // TODO: 街詳細ページへ遷移（将来実装）
    console.log(`Machi selected: ${station.name}`);
    // router.push(`/machi/${station.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`${station.name}の詳細を表示`}
    >
      <Machi station={station} isVisited={isVisited} visitCount={visitCount} />
    </Pressable>
  );
}
