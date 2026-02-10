/**
 * サムネイル画像用のブリッジ（Web側）
 *
 * React Native側からサムネイル画像を操作するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { ThumbnailExtension } from './ThumbnailExtension';

type ThumbnailEditorState = {
  /** サムネイルノードが存在するかどうか */
  hasThumbnail: boolean;
};

type ThumbnailCropData = {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
} | null;

type ThumbnailEditorInstance = {
  /** サムネイル画像を設定 */
  setThumbnail: (src: string, crop?: ThumbnailCropData) => void;
  /** サムネイルを非表示にする（srcをnullにセット） */
  removeThumbnail: () => void;
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
    // サムネイル画像が設定されているか（src !== null）を取得
    let hasThumbnail = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'thumbnail') {
        hasThumbnail = !!node.attrs.src;
        return false;
      }
      return true;
    });

    return {
      hasThumbnail,
    };
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setThumbnail: (src: string, crop?: ThumbnailCropData) => {
        sendBridgeMessage({
          type: 'set-thumbnail',
          payload: { src, crop: crop ?? null },
        });
      },
      removeThumbnail: () => {
        sendBridgeMessage({
          type: 'remove-thumbnail',
          payload: {},
        });
      },
    };
  },
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-thumbnail') {
      const { src, crop } = message.payload as { src: string; crop?: ThumbnailCropData };
      editor.commands.setThumbnail(src, crop ?? null);
      return true;
    }
    if (message.type === 'remove-thumbnail') {
      editor.commands.removeThumbnail();
      return true;
    }
    return false;
  },
});
