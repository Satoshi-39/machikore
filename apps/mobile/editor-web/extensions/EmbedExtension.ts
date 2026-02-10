/**
 * 汎用埋め込みコンテンツ用のTipTap拡張
 *
 * YouTube, X, Instagram等を統一的に扱う
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { parseUrl, createPreviewElement, getProvider, createOgpLinkCardPreview, createMapSpotCardPreview } from '../embed';
import type { EmbedProvider, EmbedNodeProvider } from '../embed';

export interface EmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      /**
       * 埋め込みコンテンツを挿入（YouTube/X/Instagram）
       */
      setEmbed: (options: { url: string }) => ReturnType;
      /**
       * OGPリンクカードを挿入（汎用URL）
       */
      setLinkCard: (options: {
        url: string;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImage: string | null;
      }) => ReturnType;
      /**
       * マップ/スポットカードを挿入（アプリ内リンク）
       */
      setMapSpotCard: (options: {
        provider: 'map_card' | 'spot_card';
        id: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        thumbnailCrop?: { originX: number; originY: number; width: number; height: number; imageWidth: number; imageHeight: number } | null;
        url: string;
      }) => ReturnType;
    };
  }
}

/**
 * 汎用埋め込みコンテンツ拡張
 */
export const EmbedExtension = Node.create<EmbedOptions>({
  name: 'embed',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  // ブロック要素の前後にGapCursorを表示可能にする
  allowGapCursor: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      provider: {
        default: null,
      },
      url: {
        default: null,
      },
      embedId: {
        default: null,
      },
      thumbnailUrl: {
        default: null,
      },
      ogTitle: {
        default: null,
      },
      ogDescription: {
        default: null,
      },
      thumbnailCrop: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-embed': '' }, this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setEmbed:
        (options) =>
        ({ commands }) => {
          const parsed = parseUrl(options.url);
          if (!parsed) {
            return false;
          }

          const { provider, embedId } = parsed;
          const config = getProvider(provider);
          const thumbnailUrl = config?.getThumbnailUrl(embedId) ?? null;

          // 埋め込みの後に空パラグラフを追加して、その後ろに文字を入力できるようにする
          return commands.insertContent([
            {
              type: this.name,
              attrs: {
                provider,
                url: options.url,
                embedId,
                thumbnailUrl,
              },
            },
            {
              type: 'paragraph',
            },
          ]);
        },
      setLinkCard:
        (options) =>
        ({ commands }) => {
          return commands.insertContent([
            {
              type: this.name,
              attrs: {
                provider: 'link_card',
                url: options.url,
                embedId: '',
                thumbnailUrl: options.ogImage,
                ogTitle: options.ogTitle,
                ogDescription: options.ogDescription,
              },
            },
            {
              type: 'paragraph',
            },
          ]);
        },
      setMapSpotCard:
        (options) =>
        ({ commands }) => {
          return commands.insertContent([
            {
              type: this.name,
              attrs: {
                provider: options.provider,
                url: options.url,
                embedId: options.id,
                thumbnailUrl: options.thumbnailUrl,
                thumbnailCrop: options.thumbnailCrop ?? null,
                ogTitle: options.title,
                ogDescription: options.description,
              },
            },
            {
              type: 'paragraph',
            },
          ]);
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const { provider, embedId, url, ogTitle, ogDescription, thumbnailUrl, thumbnailCrop } = node.attrs as {
        provider: EmbedNodeProvider;
        embedId: string;
        url: string;
        ogTitle: string | null;
        ogDescription: string | null;
        thumbnailUrl: string | null;
        thumbnailCrop: { originX: number; originY: number; width: number; height: number; imageWidth: number; imageHeight: number } | null;
      };

      let dom: HTMLElement;
      if (provider === 'link_card') {
        dom = createOgpLinkCardPreview(url, ogTitle, ogDescription, thumbnailUrl);
      } else if (provider === 'map_card' || provider === 'spot_card') {
        dom = createMapSpotCardPreview(provider, ogTitle || '', ogDescription, thumbnailUrl, thumbnailCrop);
      } else {
        dom = createPreviewElement(provider, embedId, url);
      }

      // ドラッグハンドルとして機能させる
      dom.setAttribute('data-drag-handle', '');

      // タップ時にノードを選択状態にする
      dom.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const pos = getPos();
        if (typeof pos !== 'number') return;

        // NodeSelectionでこのノードを選択
        const { tr } = editor.state;
        const selection = NodeSelection.create(editor.state.doc, pos);
        editor.view.dispatch(tr.setSelection(selection));
        editor.view.focus();
      });

      return { dom };
    };
  },
});
