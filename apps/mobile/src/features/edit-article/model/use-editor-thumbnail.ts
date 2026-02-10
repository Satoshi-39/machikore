/**
 * エディタ内サムネイル管理フック
 *
 * サムネイル画像の更新・変更検知を担当
 * ThumbnailBridgeのsetThumbnail/removeThumbnailコマンドを使用してサムネイルを管理
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';
import type { SpotImage } from '../ui/InsertMenu';

interface UseEditorThumbnailParams {
  editor: EditorBridge;
  editorState: BridgeState;
  spotImages: SpotImage[];
  thumbnailImageId?: string | null;
  /** コンテンツ初期化が完了したかどうか */
  isContentReady: boolean;
  /** サムネイル機能が有効かどうか（onThumbnailChangeが渡されているか） */
  isThumbnailEnabled: boolean;
}

/**
 * エディタ内のサムネイル画像を管理するフック
 *
 * ThumbnailBridgeのコマンドを使用してサムネイルを更新
 * - editor.setThumbnail(src): サムネイル画像を設定
 * - editor.removeThumbnail(): サムネイルノードを削除
 */
export function useEditorThumbnail({
  editor,
  editorState,
  spotImages,
  thumbnailImageId,
  isContentReady,
  isThumbnailEnabled,
}: UseEditorThumbnailParams) {
  // サムネイル挿入フラグ（初期化時に一度だけ実行するため）
  const thumbnailInsertedRef = useRef(false);
  // 前回のサムネイルパス（変更検知用）
  const prevThumbnailRef = useRef<string | null | undefined>(undefined);

  // 現在のサムネイル画像を取得（thumbnailImageIdが設定されている場合のみ）
  const currentThumbnailImage = useMemo(() => {
    if (!thumbnailImageId || spotImages.length === 0) return null;
    return spotImages.find((img) => img.id === thumbnailImageId) || null;
  }, [spotImages, thumbnailImageId]);

  // 初期化完了フラグを設定（useArticleEditorで初期コンテンツにサムネイルが含まれている）
  useEffect(() => {
    if (editorState.isReady && isContentReady && !thumbnailInsertedRef.current && isThumbnailEnabled) {
      thumbnailInsertedRef.current = true;
    }
  }, [editorState.isReady, isContentReady, isThumbnailEnabled]);

  // currentThumbnailImageの変化を監視してエディタを更新
  useEffect(() => {
    if (!thumbnailInsertedRef.current || !editorState.isReady) return;

    const currentPath = currentThumbnailImage?.cloud_path ?? null;
    const prevPath = prevThumbnailRef.current;

    // 初回は記録のみ
    if (prevPath === undefined) {
      prevThumbnailRef.current = currentPath;
      return;
    }

    // 変化がない場合はスキップ
    if (prevPath === currentPath) return;

    // サムネイルが変わったのでエディタを更新（Bridgeコマンド使用）
    // 画像変更時はcropが新しい画像に対応しないのでnullにする
    if (currentPath) {
      editor.setThumbnail(currentPath, null);
    } else {
      editor.removeThumbnail();
    }
    prevThumbnailRef.current = currentPath;
  }, [currentThumbnailImage?.cloud_path, editorState.isReady, editor]);

  // サムネイル変更ハンドラー（モーダルからの選択時）
  const updateThumbnailInEditor = useCallback((imageId: string | null) => {
    if (imageId) {
      const selectedImage = spotImages.find((img) => img.id === imageId);
      if (selectedImage?.cloud_path) {
        editor.setThumbnail(selectedImage.cloud_path);
      } else {
        // 画像が見つからない場合はプレースホルダーに
        editor.removeThumbnail();
      }
    } else {
      // nullの場合（サムネイルなし）はプレースホルダーに置き換え
      editor.removeThumbnail();
    }
  }, [editor, spotImages]);

  return {
    currentThumbnailImage,
    updateThumbnailInEditor,
  };
}
