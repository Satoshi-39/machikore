/**
 * サムネイルタップ検知・削除防止用カスタムフック
 *
 * WebView内のサムネイル画像に対して以下の機能を提供:
 * - タップ時にReact Native側でコールバックを実行
 * - Delete/Backspaceキーによる削除を防止
 * - 選択UI（青い選択状態）を無効化
 */

import { useEffect, useRef, useCallback } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';
import { THUMBNAIL_ALT } from './editor-nodes';

interface UseThumbnailTapParams {
  editor: EditorBridge;
  editorState: BridgeState;
  onThumbnailTap: () => void;
}

/**
 * サムネイル画像のタップ検知・削除防止フック
 *
 * - WebView内にJavaScriptを注入してサムネイル画像のクリックを監視
 * - MutationObserverで動的に追加されるサムネイルにも対応
 * - タップ時にonThumbnailTapコールバックを実行
 * - Delete/Backspaceキーでの削除を防止
 * - 選択時の青いハイライトを無効化
 */
export function useThumbnailTap({
  editor,
  editorState,
  onThumbnailTap,
}: UseThumbnailTapParams) {
  const listenerInjectedRef = useRef(false);

  // サムネイル画像タップ検知・削除防止用のJavaScriptを注入
  useEffect(() => {
    if (editorState.isReady && !listenerInjectedRef.current) {
      // 少し遅延させてDOMが準備できてから注入
      const timer = setTimeout(() => {
        // THUMBNAIL_ALTをJS内で使用するために変数として埋め込む
        const jsCode = `
          (function() {
            var THUMBNAIL_ALT = "${THUMBNAIL_ALT}";
            // 既にリスナーが設定されている場合はスキップ
            if (window.__thumbnailListenerAdded) return;
            window.__thumbnailListenerAdded = true;

            // サムネイル画像にリスナーを追加する関数
            function setupThumbnailListeners(thumbnailImg) {
              if (!thumbnailImg || thumbnailImg.__listenerAdded) return;
              thumbnailImg.__listenerAdded = true;
              thumbnailImg.style.cursor = 'pointer';

              // タップ時にReact Nativeにメッセージを送信
              thumbnailImg.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'THUMBNAIL_TAP'
                }));
              });
            }

            // MutationObserverでサムネイル画像の追加を監視
            var observer = new MutationObserver(function() {
              var thumbnailImg = document.querySelector('img[alt="' + THUMBNAIL_ALT + '"]');
              setupThumbnailListeners(thumbnailImg);
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // 初回チェック
            var thumbnailImg = document.querySelector('img[alt="' + THUMBNAIL_ALT + '"]');
            setupThumbnailListeners(thumbnailImg);

            // Delete/Backspaceキーでサムネイルが削除されるのを防止
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                var thumbnailImg = document.querySelector('img[alt="' + THUMBNAIL_ALT + '"]');
                if (!thumbnailImg) return;

                var proseMirror = document.querySelector('.ProseMirror');
                if (!proseMirror) return;

                // サムネイルが最初の子要素かチェック
                var isFirstChild = proseMirror.firstElementChild === thumbnailImg ||
                  (proseMirror.firstElementChild && proseMirror.firstElementChild.contains(thumbnailImg));

                // ProseMirrorのノード選択をチェック（青い選択状態）
                var selectedNode = document.querySelector('.ProseMirror-selectednode');
                if (selectedNode && (selectedNode === thumbnailImg || selectedNode.contains(thumbnailImg) || thumbnailImg.contains(selectedNode))) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }

                // Backspaceの場合、カーソルがサムネイル直後にあるかチェック
                if (e.key === 'Backspace' && isFirstChild) {
                  var selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);

                    // 選択範囲がない（カーソルのみ）の場合
                    if (range.collapsed) {
                      // カーソル位置の要素を取得
                      var cursorNode = range.startContainer;
                      var cursorOffset = range.startOffset;

                      // サムネイルの次の要素（通常は段落）を取得
                      var nextElement = thumbnailImg.nextElementSibling;

                      // カーソルがサムネイルの次の要素の先頭にある場合
                      if (nextElement) {
                        // カーソルがnextElement内にあり、先頭位置にある
                        var isAtStart = false;

                        // テキストノードの場合
                        if (cursorNode.nodeType === 3) {
                          // オフセット0で、親がnextElementまたはその子孫
                          if (cursorOffset === 0) {
                            var parent = cursorNode.parentNode;
                            while (parent && parent !== proseMirror) {
                              if (parent === nextElement) {
                                isAtStart = true;
                                break;
                              }
                              // 親内で最初のテキストノードかチェック
                              var firstText = parent.firstChild;
                              while (firstText && firstText.nodeType !== 3) {
                                firstText = firstText.nextSibling;
                              }
                              if (firstText !== cursorNode) break;
                              parent = parent.parentNode;
                            }
                          }
                        }
                        // 要素ノードの場合
                        else if (cursorNode.nodeType === 1) {
                          if (cursorOffset === 0 && (cursorNode === nextElement || nextElement.contains(cursorNode))) {
                            isAtStart = true;
                          }
                        }

                        if (isAtStart) {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                      }
                    }
                  }
                }

                // Deleteの場合、カーソルがサムネイル直前にあるかチェック（通常はないが念のため）
                if (e.key === 'Delete') {
                  var selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);
                    if (range.collapsed) {
                      var cursorNode = range.startContainer;
                      // カーソルがサムネイル画像の直前にある場合
                      if (cursorNode === thumbnailImg.parentNode || cursorNode.contains(thumbnailImg)) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }
                  }
                }
              }
            }, true);

            // サムネイル削除後に自動で再挿入するためのMutationObserver
            var contentObserver = new MutationObserver(function(mutations) {
              for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                for (var j = 0; j < mutation.removedNodes.length; j++) {
                  var node = mutation.removedNodes[j];
                  if (node.nodeType === 1 && node.tagName === 'IMG' && node.alt === THUMBNAIL_ALT) {
                    // サムネイルが削除された場合、React Nativeに通知
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'THUMBNAIL_DELETED'
                    }));
                  }
                }
              }
            });

            var proseMirror = document.querySelector('.ProseMirror');
            if (proseMirror) {
              contentObserver.observe(proseMirror, { childList: true, subtree: true });
            }
          })();
          true;
        `;
        editor.webviewRef?.current?.injectJavaScript(jsCode);
        listenerInjectedRef.current = true;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [editorState.isReady, editor]);

  // WebViewからのメッセージを処理するハンドラー
  const handleWebViewMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        if (message.type === 'THUMBNAIL_TAP') {
          onThumbnailTap();
        }
        // THUMBNAIL_DELETEDは現在は無視（将来的に再挿入ロジックを追加可能）
      } catch {
        // TenTapの内部メッセージは無視
      }
    },
    [onThumbnailTap]
  );

  return { handleWebViewMessage };
}
