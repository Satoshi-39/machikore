/**
 * Sentry初期化
 *
 * エラー監視・クラッシュレポートのためのSentry設定
 */

import * as Sentry from '@sentry/react-native';
import { ENV } from '@/shared/config/env';

/**
 * Sentryを初期化
 * アプリ起動時の最初に呼び出す
 */
export function initSentry(): void {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,

    // 開発環境では無効化
    enabled: !__DEV__,

    // パフォーマンストレーシング（サンプルレート）
    tracesSampleRate: 1.0,

    // デバッグモード（開発時のみ）
    debug: __DEV__,

    // 環境設定
    environment: __DEV__ ? 'development' : 'production',
  });
}

/**
 * Sentryでルートコンポーネントをラップするための関数
 */
export const wrapWithSentry = Sentry.wrap;

/**
 * ユーザー情報をSentryに設定
 */
export function setSentryUser(user: { id: string; email?: string; username?: string } | null): void {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * カスタムエラーをSentryに送信
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * カスタムメッセージをSentryに送信
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  Sentry.captureMessage(message, level);
}
