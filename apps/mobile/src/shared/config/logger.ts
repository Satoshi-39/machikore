/**
 * ロガー設定
 *
 * FSD: shared/config
 *
 * 役割:
 * - 開発環境: すべてのログを表示
 * - 本番環境: すべて抑制（Sentryでエラー監視）
 *
 * 使用例:
 * import { log } from '@/shared/config/logger';
 * log.debug('詳細なデバッグ情報');
 * log.info('処理が完了');
 * log.warn('注意が必要');
 * log.error('エラー発生', error);
 */

// 本番環境ではすべてのコンソール出力を抑制
// エラー監視はSentryで行う
export const log = {
  debug: (...args: unknown[]) => __DEV__ && console.log('[DEBUG]', ...args),
  info: (...args: unknown[]) => __DEV__ && console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => __DEV__ && console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => __DEV__ && console.error('[ERROR]', ...args),
};
