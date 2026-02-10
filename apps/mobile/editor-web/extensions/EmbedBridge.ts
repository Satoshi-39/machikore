/**
 * 汎用埋め込みコンテンツ用のブリッジ（Web側）
 *
 * React Native側から埋め込みコンテンツをエディタに挿入するためのブリッジ
 */

import { BridgeExtension } from '@10play/tentap-editor';
import { EmbedExtension } from './EmbedExtension';

type EmbedEditorState = object;

type LinkCardData = {
  url: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
};

type MapSpotCardData = {
  provider: 'map_card' | 'spot_card';
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailCrop?: { originX: number; originY: number; width: number; height: number; imageWidth: number; imageHeight: number } | null;
  url: string;
};

type EmbedEditorInstance = {
  setEmbed: (url: string) => void;
  setLinkCard: (data: LinkCardData) => void;
  setMapSpotCard: (data: MapSpotCardData) => void;
};

declare module '@10play/tentap-editor' {
  interface BridgeState extends EmbedEditorState {}
  interface EditorBridge extends EmbedEditorInstance {}
}

export const EmbedBridge = new BridgeExtension<
  EmbedEditorState,
  EmbedEditorInstance,
  unknown
>({
  tiptapExtension: EmbedExtension,
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
  onBridgeMessage: (editor, message) => {
    if (message.type === 'set-embed') {
      const { url } = message.payload as { url: string };
      editor.commands.setEmbed({ url });
      return true;
    }
    if (message.type === 'set-link-card') {
      const data = message.payload as LinkCardData;
      editor.commands.setLinkCard(data);
      return true;
    }
    if (message.type === 'set-map-spot-card') {
      const data = message.payload as MapSpotCardData;
      editor.commands.setMapSpotCard(data);
      return true;
    }
    return false;
  },
});
