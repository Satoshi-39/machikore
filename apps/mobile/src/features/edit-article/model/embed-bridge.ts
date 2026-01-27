/**
 * 汎用埋め込みコンテンツ用のブリッジ（React Native側）
 *
 * React Native側から埋め込みコンテンツをエディタに挿入するためのブリッジ
 * editor-web/EmbedBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

type EmbedEditorState = object;

type EmbedEditorInstance = {
  setEmbed: (url: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends EmbedEditorState {}
  interface EditorBridge extends EmbedEditorInstance {}
}

/**
 * 汎用埋め込みコンテンツ用ブリッジ
 *
 * Web側のEmbedBridgeと連携して、React Nativeから埋め込みコンテンツを挿入する
 */
export const EmbedBridge = new BridgeExtension<
  EmbedEditorState,
  EmbedEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'embed',
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setEmbed: (url: string) => {
        sendBridgeMessage({
          type: 'set-embed',
          payload: { url },
        });
      },
    };
  },
});
