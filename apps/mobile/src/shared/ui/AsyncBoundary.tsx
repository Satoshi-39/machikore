/**
 * AsyncBoundary - 非同期データの状態を処理する境界コンポーネント
 *
 * ローディング/エラー/空状態を一元管理し、
 * 成功時のみ子コンポーネントをレンダリングする
 */

import React from 'react';
import { Loading } from './Loading';
import { ErrorView } from './ErrorView';
import { EmptyState } from './EmptyState';
import { useI18n } from '@/shared/lib/i18n';

interface AsyncBoundaryProps<T> {
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: Error | null;
  /** データ */
  data: T | undefined | null;
  /** カスタムローディングメッセージ */
  loadingMessage?: string;
  /** カスタム空状態メッセージ */
  emptyMessage?: string;
  /** カスタム空状態アイコン（絵文字） */
  emptyIcon?: string;
  /** カスタム空状態アイコン（Ionicons） - emptyIconより優先 */
  emptyIonIcon?: string;
  /** データが空かどうかを判定する関数（デフォルト: 配列の長さチェック） */
  isEmpty?: (data: NonNullable<T>) => boolean;
  /** データが存在する場合にレンダリングする関数 */
  children: (data: NonNullable<T>) => React.ReactNode;
}

export function AsyncBoundary<T>({
  isLoading,
  error,
  data,
  loadingMessage,
  emptyMessage,
  emptyIcon,
  emptyIonIcon = 'search-outline',
  isEmpty,
  children,
}: AsyncBoundaryProps<T>) {
  const { t } = useI18n();
  const displayLoadingMessage = loadingMessage ?? t('common.loading');
  const displayEmptyMessage = emptyMessage ?? t('empty.noData');
  // ローディング中
  if (isLoading) {
    return <Loading message={displayLoadingMessage} />;
  }

  // エラー
  if (error) {
    return <ErrorView error={error} />;
  }

  // データなし
  if (!data) {
    return <EmptyState message={displayEmptyMessage} icon={emptyIcon} ionIcon={emptyIonIcon as any} />;
  }

  // カスタム空判定またはデフォルト（配列の長さチェック）
  const isDataEmpty = isEmpty
    ? isEmpty(data)
    : Array.isArray(data) && data.length === 0;

  if (isDataEmpty) {
    return <EmptyState message={displayEmptyMessage} icon={emptyIcon} ionIcon={emptyIonIcon as any} />;
  }

  // データ存在：子コンポーネントをレンダリング
  return children(data) as React.ReactElement;
}
