/**
 * 街詳細ページ
 *
 * Expo Router: /machi/[id]
 * 特定の街の詳細情報を表示
 */

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { MachiDetailPage } from '@/pages/machi-detail';

export default function MachiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <MachiDetailPage machiId={id} />;
}
