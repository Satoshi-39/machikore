import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import { YoutubeBridge } from './YoutubeBridge';

// TenTapStartKitにYoutubeBridgeを追加
const allBridges = [...TenTapStartKit, YoutubeBridge];

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
