/**
 * YouTube埋め込み用のカスタムブリッジ
 *
 * React Native側からYouTube動画をエディタに挿入するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import Youtube from '@tiptap/extension-youtube';

type YoutubeEditorState = {};

type YoutubeEditorInstance = {
  setYoutubeVideo: (src: string) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends YoutubeEditorState {}
  interface EditorBridge extends YoutubeEditorInstance {}
}

export const YoutubeBridge = new BridgeExtension<
  YoutubeEditorState,
  YoutubeEditorInstance,
  unknown
>({
  tiptapExtension: Youtube.configure({
    controls: true,
    nocookie: true, // プライバシー保護のためyoutube-nocookie.comを使用
    modestBranding: true,
  }),
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
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-youtube-video') {
      const { src } = message.payload as { src: string };
      editor.commands.setYoutubeVideo({ src });
      return true;
    }
    return false;
  },
});
