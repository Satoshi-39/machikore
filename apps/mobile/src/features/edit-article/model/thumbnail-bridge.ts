/**
 * サムネイル画像用のブリッジ（React Native側）
 *
 * React Native側からサムネイル画像を操作するためのブリッジ
 * editor-web/ThumbnailBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

type ThumbnailEditorState = {
  /** サムネイルがプレースホルダーかどうか */
  isThumbnailPlaceholder: boolean;
};

type ThumbnailEditorInstance = {
  /** サムネイル画像を設定 */
  setThumbnail: (src: string) => void;
  /** サムネイルをプレースホルダーにリセット */
  resetThumbnail: () => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends ThumbnailEditorState {}
  interface EditorBridge extends ThumbnailEditorInstance {}
}

/**
 * サムネイル画像用ブリッジ
 *
 * Web側のThumbnailBridgeと連携して、React Nativeからサムネイルを操作する
 */
export const ThumbnailBridge = new BridgeExtension<
  ThumbnailEditorState,
  ThumbnailEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'thumbnail',
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setThumbnail: (src: string) => {
        sendBridgeMessage({
          type: 'set-thumbnail',
          payload: { src },
        });
      },
      resetThumbnail: () => {
        sendBridgeMessage({
          type: 'reset-thumbnail',
          payload: {},
        });
      },
    };
  },
});
