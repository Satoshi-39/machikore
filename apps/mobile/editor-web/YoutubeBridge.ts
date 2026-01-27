/**
 * YouTube埋め込み用のカスタムブリッジ
 *
 * React Native側からYouTube動画をエディタに挿入するためのブリッジ
 * エディタ内ではサムネイル画像を表示（iframeの代わり）
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

/**
 * YouTubeのURLからvideo IDを抽出
 */
function extractYoutubeVideoId(url: string): string | null {
  const pattern =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);
  return match?.[1] ?? null;
}

/**
 * サムネイル表示用にカスタマイズしたYouTube拡張
 */
const CustomYoutube = Youtube.extend({
  addNodeView() {
    return ({ node }) => {
      const src = node.attrs.src as string;
      const videoId = extractYoutubeVideoId(src);

      // コンテナ
      const container = document.createElement('div');
      container.setAttribute('data-youtube-video', '');
      container.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 100%;
        margin: 16px auto;
        cursor: pointer;
      `;

      if (videoId) {
        // サムネイル画像
        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        thumbnail.alt = 'YouTube video thumbnail';
        thumbnail.style.cssText = `
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        `;

        // 再生ボタンオーバーレイ
        const playButton = document.createElement('div');
        playButton.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 68px;
          height: 48px;
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        // 再生アイコン（三角形）
        const playIcon = document.createElement('div');
        playIcon.style.cssText = `
          width: 0;
          height: 0;
          border-left: 18px solid white;
          border-top: 11px solid transparent;
          border-bottom: 11px solid transparent;
          margin-left: 4px;
        `;

        playButton.appendChild(playIcon);
        container.appendChild(thumbnail);
        container.appendChild(playButton);
      } else {
        // video IDが取得できない場合はエラー表示
        container.textContent = 'Invalid YouTube URL';
        container.style.cssText += `
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 8px;
          text-align: center;
          color: #666;
        `;
      }

      return {
        dom: container,
      };
    };
  },
}).configure({
  controls: true,
  nocookie: true,
  modestBranding: true,
  width: 640,
  height: 360,
  allowFullscreen: false,
});

export const YoutubeBridge = new BridgeExtension<
  YoutubeEditorState,
  YoutubeEditorInstance,
  unknown
>({
  tiptapExtension: CustomYoutube,
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
