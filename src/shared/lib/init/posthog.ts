/**
 * PostHog初期化
 *
 * ユーザー行動分析のためのPostHog設定
 */

import { PostHog } from 'posthog-react-native';

const POSTHOG_API_KEY = 'phc_HEjH12PbSk7JpnbZAD0ErH9NKhg4UAc8JSOKvvvhAcx';
const POSTHOG_HOST = 'https://us.i.posthog.com';

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

// PostHogProvider用のエクスポート
export { POSTHOG_API_KEY, POSTHOG_HOST };
