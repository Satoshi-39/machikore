/**
 * マップ作成ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React from 'react';
import { CreateMapForm } from '@/features/create-map';
import { useMapForm } from '../model';

export function CreateMapPage() {
  const { handleSubmit, isLoading } = useMapForm();

  return <CreateMapForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
