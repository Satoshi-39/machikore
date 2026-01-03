/**
 * MSW ハンドラー - エントリーポイント
 */

import { mapHandlers } from './maps';
import { userHandlers } from './users';
import { spotHandlers } from './spots';

/**
 * 全てのMSWハンドラー
 */
export const handlers = [...mapHandlers, ...userHandlers, ...spotHandlers];
