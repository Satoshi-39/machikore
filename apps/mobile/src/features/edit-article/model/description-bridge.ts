/**
 * Description（一言）用のブリッジ（React Native側）
 *
 * React Native側からdescriptionを操作するためのブリッジ
 * editor-web/DescriptionBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

type DescriptionEditorState = {
  /** 現在のdescriptionテキスト */
  descriptionText: string;
};

type DescriptionEditorInstance = {
  /** descriptionテキストを設定 */
  setDescription: (text: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends DescriptionEditorState {}
  interface EditorBridge extends DescriptionEditorInstance {}
}

/**
 * Description用ブリッジ
 *
 * Web側のDescriptionBridgeと連携して、React Nativeからdescriptionを操作する
 */
export const DescriptionBridge = new BridgeExtension<
  DescriptionEditorState,
  DescriptionEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'description',
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
});
