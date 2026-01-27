import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import { EmbedBridge, ThumbnailBridge, DescriptionBridge } from './extensions';

// TenTapStartKitにカスタムBridgeを追加
const allBridges = [...TenTapStartKit, EmbedBridge, ThumbnailBridge, DescriptionBridge];

// React Native側で設定されたwhiteListBridgeExtensionsでフィルタリング
const tenTapExtensions = allBridges.filter(
  (e) =>
    !window.whiteListBridgeExtensions ||
    window.whiteListBridgeExtensions.includes(e.name)
);

export default function Tiptap() {
  const editor = useTenTap({ bridges: tenTapExtensions });

  return (
    <EditorContent
      editor={editor}
      className={window.dynamicHeight ? 'dynamic-height' : undefined}
    />
  );
}
