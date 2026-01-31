import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import Document from '@tiptap/extension-document';
import { EmbedBridge, ThumbnailBridge, DescriptionBridge, ImageManagementBridge, TrailingNodeBridge } from './extensions';

// Window型拡張（React Native側で設定される変数）
declare global {
  interface Window {
    whiteListBridgeExtensions?: string[];
    dynamicHeight?: boolean;
  }
}

/**
 * カスタムDocument拡張
 *
 * ドキュメント構造を強制: thumbnail → description → 1つ以上のblock
 * これによりスキーマレベルでセクションが保護され、Backspaceで削除できなくなる
 *
 * 参考: https://tiptap.dev/docs/examples/advanced/forced-content-structure
 */
const CustomDocument = Document.extend({
  content: 'thumbnail description block+',
});

// TenTapStartKitにカスタムBridgeを追加
const allBridges = [...TenTapStartKit, EmbedBridge, ThumbnailBridge, DescriptionBridge, ImageManagementBridge, TrailingNodeBridge];

// React Native側で設定されたwhiteListBridgeExtensionsでフィルタリング
const tenTapExtensions = allBridges.filter(
  (e) =>
    !window.whiteListBridgeExtensions ||
    window.whiteListBridgeExtensions.includes(e.name)
);

export default function Tiptap() {
  // whiteListにthumbnailとdescriptionが含まれる場合、カスタムDocumentを使用
  const useForcedStructure =
    window.whiteListBridgeExtensions?.includes('thumbnail') &&
    window.whiteListBridgeExtensions?.includes('description');

  const editor = useTenTap({
    bridges: tenTapExtensions,
    tiptapOptions: useForcedStructure
      ? {
          extensions: [CustomDocument],
        }
      : undefined,
  });

  return (
    <EditorContent
      editor={editor}
      className={window.dynamicHeight ? 'dynamic-height' : undefined}
    />
  );
}
