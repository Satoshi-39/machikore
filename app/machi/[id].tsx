/**
 * 街詳細ページ
 *
 * Expo Router: /machi/[id]
 * 特定の街の詳細情報を表示
 */

import { MachiDetailPage } from '@/pages/machi-detail';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function MachiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MachiDetailPage machiId={id} />;
}
