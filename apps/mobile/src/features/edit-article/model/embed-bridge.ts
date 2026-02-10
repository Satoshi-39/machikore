/**
 * 汎用埋め込みコンテンツ用のブリッジ（React Native側）
 *
 * React Native側から埋め込みコンテンツをエディタに挿入するためのブリッジ
 * editor-web/EmbedBridge.tsと対になる
 */

import { BridgeExtension } from '@10play/tentap-editor';

type LinkCardData = {
  url: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
};

export type MapSpotCardData = {
  provider: 'map_card' | 'spot_card';
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailCrop?: { originX: number; originY: number; width: number; height: number; imageWidth: number; imageHeight: number } | null;
  url: string;
};

type EmbedEditorState = object;

type EmbedEditorInstance = {
  setEmbed: (url: string) => void;
  setLinkCard: (data: LinkCardData) => void;
  setMapSpotCard: (data: MapSpotCardData) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends EmbedEditorState {}
  interface EditorBridge extends EmbedEditorInstance {}
}

/**
 * 汎用埋め込みコンテンツ用ブリッジ
 *
 * Web側のEmbedBridgeと連携して、React Nativeから埋め込みコンテンツを挿入する
 */
export const EmbedBridge = new BridgeExtension<
  EmbedEditorState,
  EmbedEditorInstance,
  unknown
>({
  // RN側ではtiptapExtensionは不要（Web側で定義）
  forceName: 'embed',
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setEmbed: (url: string) => {
        sendBridgeMessage({
          type: 'set-embed',
          payload: { url },
        });
      },
      setLinkCard: (data: LinkCardData) => {
        sendBridgeMessage({
          type: 'set-link-card',
          payload: data,
        });
      },
      setMapSpotCard: (data: MapSpotCardData) => {
        sendBridgeMessage({
          type: 'set-map-spot-card',
          payload: data,
        });
      },
    };
  },
});
