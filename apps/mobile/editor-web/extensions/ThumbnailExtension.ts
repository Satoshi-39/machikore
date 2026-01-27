/**
 * サムネイル画像用のTipTap拡張
 *
 * エディタ上部にサムネイル画像を表示するカスタムノード
 * - isolating: true で境界を作り、backspaceが越えられないようにする
 * - defining: true で削除されないようにする
 * - selectable: false で選択不可にする
 */

import { Node, mergeAttributes } from '@tiptap/core';

/** サムネイル画像を識別するためのalt属性値 */
export const THUMBNAIL_ALT = '__THUMBNAIL__';

/** プレースホルダー画像のdata URI */
export const THUMBNAIL_PLACEHOLDER_URI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='190' height='32' viewBox='0 0 190 32'%3E%3Crect fill='%23F9FAFB' width='190' height='32' rx='6'/%3E%3Cg fill='none' stroke='%239CA3AF' stroke-width='1.5'%3E%3Crect x='8' y='6' width='20' height='20' rx='3'/%3E%3Ccircle cx='14' cy='12' r='2' fill='%239CA3AF' stroke='none'/%3E%3Cpath d='M8 22l5-5 3 3 5-6 7 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='34' y='21' fill='%239CA3AF' font-family='sans-serif' font-size='13'%3Eサムネイルを追加%3C/text%3E%3C/svg%3E`;

export interface ThumbnailOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    thumbnail: {
      /**
       * サムネイル画像を設定
       */
      setThumbnail: (src: string) => ReturnType;
      /**
       * サムネイルをプレースホルダーにリセット
       */
      resetThumbnail: () => ReturnType;
    };
  }
}

/**
 * サムネイル画像拡張
 */
export const ThumbnailExtension = Node.create<ThumbnailOptions>({
  name: 'thumbnail',

  group: 'block',

  // 内部構造を持たない（編集不可）
  atom: true,

  // 境界を作り、backspaceが越えられないようにする
  isolating: true,

  // 削除されないようにする
  defining: true,

  // 選択不可
  selectable: false,

  // ドラッグ不可
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: THUMBNAIL_PLACEHOLDER_URI,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `img[alt="${THUMBNAIL_ALT}"]`,
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          return {
            src: element.getAttribute('src'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          alt: THUMBNAIL_ALT,
          class: 'thumbnail-image',
        }
      ),
    ];
  },

  addCommands() {
    return {
      setThumbnail:
        (src: string) =>
        ({ tr, state, dispatch }) => {
          // ドキュメント内のthumbnailノードを探して更新
          let found = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'thumbnail') {
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, { src });
              }
              found = true;
              return false; // 最初のみ更新
            }
            return true;
          });

          if (found && dispatch) {
            dispatch(tr);
          }
          return found;
        },

      resetThumbnail:
        () =>
        ({ commands }) => {
          return commands.setThumbnail(THUMBNAIL_PLACEHOLDER_URI);
        },
    };
  },

  addNodeView() {
    return ({ node }) => {
      const { src } = node.attrs as { src: string };
      const isPlaceholder = src === THUMBNAIL_PLACEHOLDER_URI;

      const dom = document.createElement('div');
      dom.className = 'thumbnail-container';
      dom.contentEditable = 'false';

      const img = document.createElement('img');
      img.src = src;
      img.alt = THUMBNAIL_ALT;
      img.className = isPlaceholder ? 'thumbnail-placeholder' : 'thumbnail-image';

      // タップでReact Native側に通知
      dom.addEventListener('click', () => {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: 'thumbnail-tap' })
        );
      });

      dom.appendChild(img);

      return { dom };
    };
  },
});
