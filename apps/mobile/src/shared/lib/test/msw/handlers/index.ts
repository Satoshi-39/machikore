/**
 * MSW ハンドラー - エントリーポイント
 */

import { mapHandlers } from './maps';
import { userHandlers } from './users';
import { spotHandlers } from './spots';
import { likeHandlers } from './likes';
import { bookmarkHandlers } from './bookmarks';
import { followHandlers } from './follows';
import { rpcHandlers } from './rpc';

/**
 * 全てのMSWハンドラー
 */
export const handlers = [
  ...mapHandlers,
  ...userHandlers,
  ...spotHandlers,
  ...likeHandlers,
  ...bookmarkHandlers,
  ...followHandlers,
  ...rpcHandlers,
];
