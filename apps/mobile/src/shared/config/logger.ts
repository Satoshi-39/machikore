/**
 * ロガー設定
 *
 * FSD: shared/config
 *
 * 役割:
 * - ログレベルによる出力制御
 * - 開発環境: すべてのログを表示
 * - 本番環境: warn/errorのみ表示
 *
 * 使用例:
 * import { log } from '@/shared/config/logger';
 * log.debug('詳細なデバッグ情報');
 * log.info('処理が完了');
 * log.warn('注意が必要');
 * log.error('エラー発生', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 環境に応じたログレベルを設定
// 開発環境: すべてのログを表示
// 本番環境: warn/errorのみ表示
const currentLevel: LogLevel = __DEV__ ? 'debug' : 'warn';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export const log = {
  debug: (...args: unknown[]) => shouldLog('debug') && console.log('[DEBUG]', ...args),
  info: (...args: unknown[]) => shouldLog('info') && console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => shouldLog('warn') && console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => shouldLog('error') && console.error('[ERROR]', ...args),
};
