/**
 * React Error Boundary
 *
 * FSD: shared/ui
 *
 * レンダー中のエラーをキャッチし、白画面クラッシュを防ぐ。
 * Sentryにエラーを送信し、ユーザーにはフォールバックUIを表示する。
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { captureException } from '@/shared/lib/init/sentry';
import { log } from '@/shared/config/logger';
import { t } from '@/shared/lib/i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log.error('[ErrorBoundary] Uncaught render error:', error, errorInfo.componentStack);
    captureException(error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View className="flex-1 justify-center items-center bg-surface p-8">
        <Text className="text-5xl mb-6">⚠️</Text>
        <Text className="text-xl font-bold text-on-surface mb-2 text-center">
          {t('error.unexpectedError')}
        </Text>
        <Text className="text-sm text-on-surface-variant text-center leading-5">
          {t('error.pleaseReopen')}
        </Text>

        {/* 開発環境のみエラー詳細を表示 */}
        {__DEV__ && this.state.error && (
          <Text className="text-xs text-error mt-6 font-mono px-4 text-center">
            {this.state.error.message}
          </Text>
        )}
      </View>
    );
  }
}
