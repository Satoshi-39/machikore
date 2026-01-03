/**
 * MSW サーバー設定
 * 結合テスト用のモックサーバー
 *
 * Jest テスト（Node.js 環境）では msw/node を使用
 * 実際の React Native アプリでは msw/native を使用
 *
 * @see https://mswjs.io/docs/integrations/node/
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers/index';

/**
 * MSW テストサーバー
 * Jest テストで API リクエストをインターセプト
 */
export const server = setupServer(...handlers);
