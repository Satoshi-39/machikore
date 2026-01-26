/**
 * エディタ内サムネイル管理フック
 *
 * サムネイル画像の挿入・更新・変更検知を担当
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { EditorBridge, BridgeState } from '@10play/tentap-editor';
import type { ProseMirrorDoc } from '@/shared/types';
import { insertThumbnailToDoc, insertPlaceholderToDoc } from './editor-nodes';
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

    // サムネイルが変わったのでエディタを更新
    const updateThumbnail = async () => {
      const json = await editor.getJSON();
      let updatedDoc: ProseMirrorDoc;

      if (currentPath) {
        updatedDoc = insertThumbnailToDoc(json as ProseMirrorDoc, currentPath);
      } else {
        updatedDoc = insertPlaceholderToDoc(json as ProseMirrorDoc);
      }

      editor.setContent(updatedDoc);
      prevThumbnailRef.current = currentPath;
    };
    updateThumbnail();
  }, [currentThumbnailImage?.cloud_path, editorState.isReady, editor]);

  // サムネイル変更ハンドラー（モーダルからの選択時）
  const updateThumbnailInEditor = useCallback(async (imageId: string | null) => {
    const json = await editor.getJSON();
    let updatedDoc: ProseMirrorDoc;

    if (imageId) {
      const selectedImage = spotImages.find((img) => img.id === imageId);
      if (selectedImage?.cloud_path) {
        updatedDoc = insertThumbnailToDoc(json as ProseMirrorDoc, selectedImage.cloud_path);
      } else {
        // 画像が見つからない場合はプレースホルダーに
        updatedDoc = insertPlaceholderToDoc(json as ProseMirrorDoc);
      }
    } else {
      // nullの場合（サムネイルなし）はプレースホルダーに置き換え
      updatedDoc = insertPlaceholderToDoc(json as ProseMirrorDoc);
    }

    editor.setContent(updatedDoc);
  }, [editor, spotImages]);

  return {
    currentThumbnailImage,
    updateThumbnailInEditor,
  };
}
