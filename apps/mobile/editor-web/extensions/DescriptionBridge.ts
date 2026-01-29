/**
 * Description（一言）用のブリッジ（Web側）
 *
 * React Native側からdescriptionを操作するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { DescriptionExtension } from './DescriptionExtension';

type DescriptionEditorState = {
  /** 現在のdescriptionテキスト */
  descriptionText: string;
  /** カーソルがdescriptionノード内にあるかどうか */
  isInDescription: boolean;
};

type DescriptionEditorInstance = {
  /** descriptionテキストを設定 */
  setDescription: (text: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends DescriptionEditorState {}
  interface EditorBridge extends DescriptionEditorInstance {}
}

export const DescriptionBridge = new BridgeExtension<
  DescriptionEditorState,
  DescriptionEditorInstance,
  unknown
>({
  tiptapExtension: DescriptionExtension,
  extendEditorState: (editor) => {
    // ドキュメント内のdescriptionノードのテキストを取得
    let descriptionText = '';
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'description') {
        descriptionText = node.textContent;
        return false;
      }
      return true;
    });

    // カーソルがdescriptionノード内にあるかチェック
    let isInDescription = false;
    const { $from } = editor.state.selection;
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === 'description') {
        isInDescription = true;
        break;
      }
    }

    return {
      descriptionText,
      isInDescription,
    };
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setDescription: (text: string) => {
        sendBridgeMessage({
          type: 'set-description',
          payload: { text },
        });
      },
    };
  },
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-description') {
      const { text } = message.payload as { text: string };
      editor.commands.setDescription(text);
      return true;
    }
    return false;
  },
});
