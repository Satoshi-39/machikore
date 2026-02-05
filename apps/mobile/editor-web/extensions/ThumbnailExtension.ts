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


export interface ThumbnailOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    thumbnail: {
      /**
       * サムネイル画像を設定（nullで非表示）
       */
      setThumbnail: (src: string | null) => ReturnType;
      /**
       * サムネイルノードを削除
       */
      removeThumbnail: () => ReturnType;
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
        default: null,
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
        (src: string | null) =>
        ({ tr, state, dispatch }) => {
          // ドキュメント内のthumbnailノードを探してsrcを更新
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

      removeThumbnail:
        () =>
        ({ commands }) => {
          // ノードは削除せずsrcをnullにして非表示にする（スキーマ維持のため）
          return commands.setThumbnail(null as unknown as string);
        },
    };
  },

  addNodeView() {
    return ({ node }) => {
      const { src } = node.attrs as { src: string | null };

      const dom = document.createElement('div');
      dom.contentEditable = 'false';

      // srcがnullの場合は非表示（スキーマ維持のためノードは残す）
      if (!src) {
        dom.style.display = 'none';
        return { dom };
      }

      dom.className = 'thumbnail-container';

      const img = document.createElement('img');
      img.src = src;
      img.alt = THUMBNAIL_ALT;
      img.className = 'thumbnail-image';

      dom.appendChild(img);

      return { dom };
    };
  },
});
