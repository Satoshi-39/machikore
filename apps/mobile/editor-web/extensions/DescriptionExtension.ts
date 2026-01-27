/**
 * Description（一言）用のTipTap拡張
 *
 * サムネイルの直下に配置されるテキスト入力エリア
 * - isolating: true で本文からのbackspaceが越えられないようにする
 * - defining: true で削除されないようにする
 * - content: 'inline*' でテキスト入力可能
 */

import { Node, mergeAttributes } from '@tiptap/core';

export interface DescriptionOptions {
  HTMLAttributes: Record<string, unknown>;
  placeholder: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    description: {
      /**
       * descriptionのテキストを設定
       */
      setDescription: (text: string) => ReturnType;
    };
  }
}

/**
 * Description拡張
 */
export const DescriptionExtension = Node.create<DescriptionOptions>({
  name: 'description',

  group: 'block',

  // テキスト入力可能
  content: 'inline*',

  // 境界を作り、本文からのbackspaceが越えられないようにする
  isolating: true,

  // 削除されないようにする
  defining: true,

  // 選択は可能（テキスト入力のため）
  selectable: true,

  // ドラッグ不可
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      placeholder: 'スポットの一言を入力',
    };
  },

  addAttributes() {
    return {
      placeholder: {
        default: this.options.placeholder,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p[data-description]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-description': '',
          class: 'description-text',
        }
      ),
      0, // content hole
    ];
  },

  addCommands() {
    return {
      setDescription:
        (text: string) =>
        ({ tr, state, dispatch }) => {
          let found = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'description') {
              if (dispatch) {
                // descriptionノードのコンテンツを置換
                const from = pos + 1; // ノードの開始位置の次
                const to = pos + node.nodeSize - 1; // ノードの終了位置の前

                if (text) {
                  const textNode = state.schema.text(text);
                  tr.replaceWith(from, to, textNode);
                } else {
                  tr.delete(from, to);
                }
              }
              found = true;
              return false;
            }
            return true;
          });

          if (found && dispatch) {
            dispatch(tr);
          }
          return found;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Enterキーで本文の最初に移動（description内でEnterを押したとき）
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // 現在descriptionノード内にいるか確認
        let inDescription = false;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'description') {
            inDescription = true;
            break;
          }
        }

        if (inDescription) {
          // descriptionの次のノード（本文の最初）に移動
          const descPos = $from.before($from.depth);
          const descNode = editor.state.doc.nodeAt(descPos);
          if (descNode) {
            const nextPos = descPos + descNode.nodeSize;
            editor.commands.setTextSelection(nextPos + 1);
            return true;
          }
        }

        return false;
      },
    };
  },
});
