/**
 * PostHog初期化
 *
 * ユーザー行動分析のためのPostHog設定
 */

import { PostHog } from 'posthog-react-native';
import { ENV } from '@/shared/config/env';

export const POSTHOG_API_KEY = ENV.POSTHOG_API_KEY;
export const POSTHOG_HOST = ENV.POSTHOG_HOST;

// PostHogクライアントインスタンス
let posthogClient: PostHog | null = null;

/**
 * PostHogを初期化
 */
export async function initPostHog(): Promise<PostHog> {
  if (posthogClient) {
    return posthogClient;
  }

  posthogClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
  });

  return posthogClient;
}

/**
 * PostHogクライアントを取得
 */
export function getPostHog(): PostHog | null {
  return posthogClient;
}

/**
 * ユーザーを識別
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, any>
): void {
  posthogClient?.identify(userId, properties);
}

/**
 * ユーザーをリセット（ログアウト時）
 */
export function resetUser(): void {
  posthogClient?.reset();
}

/**
 * カスタムイベントを送信
 */
export function captureEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  posthogClient?.capture(eventName, properties);
}

/**
 * 画面表示イベントを送信
 */
export function captureScreen(
  screenName: string,
  properties?: Record<string, any>
): void {
  posthogClient?.screen(screenName, properties);
}
