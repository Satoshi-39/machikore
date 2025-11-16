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
import { useRouter } from 'expo-router';
import type { MachiRow } from '@/shared/types/database.types';
import { Machi } from '@/entities/machi';

interface MachiCardProps {
  machi: MachiRow;
  isVisited?: boolean;
  visitCount?: number;
}

export function MachiCard({ machi, isVisited = false, visitCount = 0 }: MachiCardProps) {
  const router = useRouter();

  const handlePress = () => {
    // 街詳細ページへ遷移
    router.push(`/machi/${machi.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`${machi.name}の詳細を表示`}
    >
      <Machi machi={machi} isVisited={isVisited} visitCount={visitCount} />
    </Pressable>
  );
}
