/**
 * Description削除防止用カスタムフック
 *
 * WebView内のdescriptionノードに対して以下の機能を提供:
 * - Backspaceキーによる削除を防止（記事本文の先頭から）
 */

import { useEffect, useRef } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';
import { THUMBNAIL_ALT } from './editor-nodes';

interface UseDescriptionProtectionParams {
  editor: EditorBridge;
  editorState: BridgeState;
  /** description機能が有効かどうか */
  isEnabled: boolean;
}

/**
 * descriptionノードの削除防止フック
 *
 * - 記事本文の先頭でBackspaceを押してもdescriptionノードが削除されないようにする
 * - descriptionはサムネイル画像の直後のparagraphとして位置ベースで識別
 */
export function useDescriptionProtection({
  editor,
  editorState,
  isEnabled,
}: UseDescriptionProtectionParams) {
  const listenerInjectedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) return;
    if (editorState.isReady && !listenerInjectedRef.current) {
      const timer = setTimeout(() => {
        const jsCode = `
          (function() {
            var THUMBNAIL_ALT = "${THUMBNAIL_ALT}";

            // 既にリスナーが設定されている場合はスキップ
            if (window.__descriptionProtectionAdded) return;
            window.__descriptionProtectionAdded = true;

            // Backspaceでdescriptionノードが削除されるのを防止
            document.addEventListener('keydown', function(e) {
              if (e.key !== 'Backspace') return;

              // サムネイル画像を取得
              var thumbnailImg = document.querySelector('img[alt="' + THUMBNAIL_ALT + '"]');
              if (!thumbnailImg) return;

              // descriptionはサムネイルの直後のparagraph
              var descriptionNode = thumbnailImg.nextElementSibling;
              if (!descriptionNode || descriptionNode.tagName !== 'P') return;

              var proseMirror = document.querySelector('.ProseMirror');
              if (!proseMirror) return;

              var selection = window.getSelection();
              if (!selection || selection.rangeCount === 0) return;

              var range = selection.getRangeAt(0);
              if (!range.collapsed) return;

              // descriptionの次の要素（記事本文の最初の段落）を取得
              var nextElement = descriptionNode.nextElementSibling;
              if (!nextElement) return;

              var cursorNode = range.startContainer;
              var cursorOffset = range.startOffset;
              var isAtStartOfNext = false;

              // テキストノードの場合
              if (cursorNode.nodeType === 3 && cursorOffset === 0) {
                var parent = cursorNode.parentNode;
                while (parent && parent !== proseMirror) {
                  if (parent === nextElement) {
                    // 最初のテキストノードかチェック
                    var firstText = nextElement;
                    while (firstText && firstText.nodeType !== 3) {
                      firstText = firstText.firstChild;
                    }
                    if (firstText === cursorNode) {
                      isAtStartOfNext = true;
                    }
                    break;
                  }
                  parent = parent.parentNode;
                }
              }
              // 要素ノードの場合
              else if (cursorNode.nodeType === 1 && cursorOffset === 0) {
                if (cursorNode === nextElement || nextElement.contains(cursorNode)) {
                  isAtStartOfNext = true;
                }
              }

              // 記事本文の先頭からBackspaceでdescriptionが削除されるのを防止
              if (isAtStartOfNext) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }, true);
          })();
          true;
        `;
        editor.webviewRef?.current?.injectJavaScript(jsCode);
        listenerInjectedRef.current = true;
      }, 250); // サムネイルの後に実行されるよう少し遅延

      return () => clearTimeout(timer);
    }
  }, [editorState.isReady, editor, isEnabled]);
}
