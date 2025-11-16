/**
 * AsyncBoundary - 非同期データの状態を処理する境界コンポーネント
 *
 * ローディング/エラー/空状態を一元管理し、
 * 成功時のみ子コンポーネントをレンダリングする
 */

import React from 'react';
import { Loading } from './loading';
import { ErrorView } from './error-view';
import { EmptyState } from './empty-state';

interface AsyncBoundaryProps<T> {
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: Error | null;
  /** データ */
  data: T | undefined;
  /** カスタムローディングメッセージ */
  loadingMessage?: string;
  /** カスタム空状態メッセージ */
  emptyMessage?: string;
  /** カスタム空状態アイコン */
  emptyIcon?: string;
  /** データが空かどうかを判定する関数（デフォルト: 配列の長さチェック） */
  isEmpty?: (data: T) => boolean;
  /** データが存在する場合にレンダリングする関数 */
  children: (data: T) => React.ReactNode;
}

export function AsyncBoundary<T>({
  isLoading,
  error,
  data,
  loadingMessage = '読み込み中...',
  emptyMessage = 'データがありません',
  emptyIcon = '📭',
  isEmpty,
  children,
}: AsyncBoundaryProps<T>) {
  // ローディング中
  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }

  // エラー
  if (error) {
    return <ErrorView error={error} />;
  }

  // データなし
  if (!data) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  // カスタム空判定またはデフォルト（配列の長さチェック）
  const isDataEmpty = isEmpty
    ? isEmpty(data)
    : Array.isArray(data) && data.length === 0;

  if (isDataEmpty) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  // データ存在：子コンポーネントをレンダリング
  return children(data) as React.ReactElement;
}
