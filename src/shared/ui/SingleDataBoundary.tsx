/**
 * SingleDataBoundary - 単一データの状態を処理する境界コンポーネント
 *
 * 詳細画面や編集画面など、単一オブジェクトを取得する場面で使用。
 * ローディング/エラー/未発見状態を一元管理し、
 * データ存在時のみ子コンポーネントをレンダリングする。
 *
 * ※ 配列データ（フィード、リスト）には AsyncBoundary を使用してください。
 */

import React from 'react';
import { Loading } from './Loading';
import { ErrorView } from './ErrorView';
import { EmptyState } from './EmptyState';

interface SingleDataBoundaryProps<T> {
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: Error | null;
  /** データ（null/undefined で未発見扱い） */
  data: T | null | undefined;
  /** カスタムローディングメッセージ */
  loadingMessage?: string;
  /** データが見つからない場合のメッセージ */
  notFoundMessage?: string;
  /** データが見つからない場合のアイコン（Ionicons） */
  notFoundIcon?: string;
  /** データが存在する場合にレンダリングする関数 */
  children: (data: T) => React.ReactNode;
}

export function SingleDataBoundary<T>({
  isLoading,
  error,
  data,
  loadingMessage = '読み込み中...',
  notFoundMessage = 'データが見つかりません',
  notFoundIcon = 'alert-circle-outline',
  children,
}: SingleDataBoundaryProps<T>): React.ReactElement {
  // ローディング中
  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }

  // エラー
  if (error) {
    return <ErrorView error={error} />;
  }

  // データなし（null または undefined）
  if (data == null) {
    return <EmptyState message={notFoundMessage} ionIcon={notFoundIcon as any} />;
  }

  // データ存在：子コンポーネントをレンダリング
  return children(data) as React.ReactElement;
}
