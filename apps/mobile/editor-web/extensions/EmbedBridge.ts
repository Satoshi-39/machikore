/**
 * 汎用埋め込みコンテンツ用のブリッジ（Web側）
 *
 * React Native側から埋め込みコンテンツをエディタに挿入するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { EmbedExtension } from './EmbedExtension';

type EmbedEditorState = object;

type EmbedEditorInstance = {
  setEmbed: (url: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends EmbedEditorState {}
  interface EditorBridge extends EmbedEditorInstance {}
}

export const EmbedBridge = new BridgeExtension<
  EmbedEditorState,
  EmbedEditorInstance,
  unknown
>({
  tiptapExtension: EmbedExtension,
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
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-embed') {
      const { url } = message.payload as { url: string };
      editor.commands.setEmbed({ url });
      return true;
    }
    return false;
  },
});
