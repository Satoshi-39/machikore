/**
 * 画像管理用のブリッジ（React Native側）
 *
 * React Native側から記事内の画像ノードを削除するためのブリッジ
 * editor-web/ImageManagementBridge.tsと対になる
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

/**
 * 画像管理用ブリッジ
 *
 * Web側のImageManagementBridgeと連携して、React Nativeから記事内の画像を削除する
 */
export const ImageManagementBridge = new BridgeExtension<
  ImageManagementEditorState,
  ImageManagementEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
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
});
