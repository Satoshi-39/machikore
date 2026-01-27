/**
 * YouTube埋め込み用のカスタムブリッジ（React Native側）
 *
 * React Native側からYouTube動画をエディタに挿入するためのブリッジ
 * editor-web/YoutubeBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

type YoutubeEditorState = object;

type YoutubeEditorInstance = {
  setYoutubeVideo: (src: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends YoutubeEditorState {}
  interface EditorBridge extends YoutubeEditorInstance {}
}

/**
 * YouTube埋め込み用ブリッジ
 *
 * Web側のYoutubeBridgeと連携して、React NativeからYouTube動画を挿入する
 */
export const YoutubeBridge = new BridgeExtension<
  YoutubeEditorState,
  YoutubeEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'youtube',
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setYoutubeVideo: (src: string) => {
        sendBridgeMessage({
          type: 'set-youtube-video',
          payload: { src },
        });
      },
    };
  },
});
