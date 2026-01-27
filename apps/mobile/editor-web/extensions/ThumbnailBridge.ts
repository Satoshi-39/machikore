/**
 * サムネイル画像用のブリッジ（Web側）
 *
 * React Native側からサムネイル画像を操作するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { ThumbnailExtension, THUMBNAIL_PLACEHOLDER_URI } from './ThumbnailExtension';

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

export const ThumbnailBridge = new BridgeExtension<
  ThumbnailEditorState,
  ThumbnailEditorInstance,
  unknown
>({
  tiptapExtension: ThumbnailExtension,
  extendEditorState: (editor) => {
    // ドキュメント内のthumbnailノードの状態を取得
    let isThumbnailPlaceholder = true;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'thumbnail') {
        isThumbnailPlaceholder = node.attrs.src === THUMBNAIL_PLACEHOLDER_URI;
        return false;
      }
      return true;
    });

    return {
      isThumbnailPlaceholder,
    };
  },
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
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-thumbnail') {
      const { src } = message.payload as { src: string };
      editor.commands.setThumbnail(src);
      return true;
    }
    if (message.type === 'reset-thumbnail') {
      editor.commands.resetThumbnail();
      return true;
    }
    return false;
  },
});
