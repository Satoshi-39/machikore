/**
 * 汎用埋め込みコンテンツ用のTipTap拡張
 *
 * YouTube, X, Instagram等を統一的に扱う
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { parseUrl, createPreviewElement, getProvider } from '../embed';
import type { EmbedProvider } from '../embed';

export interface EmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      /**
       * 埋め込みコンテンツを挿入
       */
      setEmbed: (options: { url: string }) => ReturnType;
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
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const { provider, embedId, url } = node.attrs as {
        provider: EmbedProvider;
        embedId: string;
        url: string;
      };

      const dom = createPreviewElement(provider, embedId, url);

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
