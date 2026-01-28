/**
 * TrailingNodeブリッジ（Web側）
 *
 * ドキュメントの最後に常にパラグラフを確保する拡張機能
 * - 画像や埋め込みコンテンツの後に必ずパラグラフがある状態を維持
 * - バックスペースで最終パラグラフが削除されても自動的に復元
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { TrailingNode } from '@tiptap/extensions';

// TrailingNodeの設定
// notAfter: これらのノードの後にはTrailingNodeを挿入しない
// - paragraph: 既にテキスト入力可能なため
// - thumbnail, description: 強制構造のセクション（これらの後にTrailingNodeは不要）
const TrailingNodeExtension = TrailingNode.configure({
  node: 'paragraph',
  notAfter: ['paragraph', 'thumbnail', 'description'],
});

export const TrailingNodeBridge = new BridgeExtension({
  tiptapExtension: TrailingNodeExtension,
});
