/**
 * 画像管理用のブリッジ（Web側）
 *
 * React Native側から記事内の画像ノードを削除するためのブリッジ
 * 既存のImageノードを操作するだけなので、tiptapExtensionは不要
 */

import { BridgeExtension } from '@10play/tentap-editor';

type ImageManagementEditorState = object;

type ImageManagementEditorInstance = {
  /** 指定されたsrcの画像ノードを記事から削除 */
  removeImageBySrc: (src: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends ImageManagementEditorState {}
  interface EditorBridge extends ImageManagementEditorInstance {}
}

export const ImageManagementBridge = new BridgeExtension<
  ImageManagementEditorState,
  ImageManagementEditorInstance,
  unknown
>({
  forceName: 'imageManagement',
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      removeImageBySrc: (src: string) => {
        sendBridgeMessage({
          type: 'remove-image-by-src',
          payload: { src },
        });
      },
    };
  },
  onBridgeMessage: (editor, message) => {
    if (message.type === 'remove-image-by-src') {
      const { src } = message.payload as { src: string };

      // ProseMirrorトランザクションで該当srcの画像ノードを削除
      const { tr } = editor.state;
      let deleted = false;

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === src) {
          // 既に削除済みの場合はposがずれるので、マッピングで調整
          const mappedPos = tr.mapping.map(pos);
          tr.delete(mappedPos, mappedPos + node.nodeSize);
          deleted = true;
        }
      });

      if (deleted) {
        editor.view.dispatch(tr);
      }

      return true;
    }
    return false;
  },
});
