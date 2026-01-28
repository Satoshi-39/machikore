/**
 * TrailingNodeブリッジ（React Native側）
 *
 * ドキュメントの最後に常にパラグラフを確保する拡張機能
 * editor-web/TrailingNodeBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

/**
 * TrailingNodeブリッジ
 *
 * Web側のTrailingNodeBridgeと連携して、ドキュメント末尾のパラグラフを保証する
 * 特別なAPIは公開しない（エディタ内部で自動的に動作）
 */
export const TrailingNodeBridge = new BridgeExtension({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'trailingNode',
});
