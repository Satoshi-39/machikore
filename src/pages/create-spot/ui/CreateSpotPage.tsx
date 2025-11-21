/**
 * スポット作成ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { CreateSpotForm } from '@/features/create-spot';
import { useSpotForm } from '../model';

export function CreateSpotPage() {
  const { placeData, handleSubmit, isLoading } = useSpotForm();

  // データが存在しない場合はnull（エラーハンドリングはhook内で実施済み）
  if (!placeData) return null;

  return <CreateSpotForm placeData={placeData} onSubmit={handleSubmit} isLoading={isLoading} />;
}
