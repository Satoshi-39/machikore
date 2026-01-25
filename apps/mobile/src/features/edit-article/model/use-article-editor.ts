/**
 * 記事エディタのコアロジック
 *
 * TenTapエディタの初期化、コンテンツ管理、保存処理を担当
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  darkEditorTheme,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
  type EditorTheme,
} from '@10play/tentap-editor';
import { useEditorStyles, EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import {
  removeThumbnailFromDoc,
  insertThumbnailToDoc,
  insertPlaceholderToDoc,
  insertDescriptionToDoc,
  removeDescriptionFromDoc,
  getDescriptionFromDoc,
} from './editor-nodes';

/** 空のドキュメント */
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

/** カスタムダークテーマ（背景色をツールバーと統一） */
const customDarkEditorTheme: EditorTheme = {
  ...darkEditorTheme,
  webview: {
    backgroundColor: EDITOR_DARK_BG_COLOR,
  },
};

interface UseArticleEditorParams {
  initialArticleContent: ProseMirrorDoc | null;
  isLoading: boolean;
  onSave: (content: ProseMirrorDoc | null) => Promise<boolean>;
  /** サムネイル画像URL（初期コンテンツに含めるため） */
  thumbnailImageUrl?: string | null;
  /** サムネイル機能が有効かどうか */
  isThumbnailEnabled?: boolean;
  /** 初期description（スポットの一言） */
  initialDescription?: string;
  /** description変更時のコールバック */
  onDescriptionChange?: (description: string) => void;
}

/**
 * 記事エディタのコアロジックを提供するフック
 */
export function useArticleEditor({
  initialArticleContent,
  isLoading,
  onSave,
  thumbnailImageUrl,
  isThumbnailEnabled = false,
  initialDescription = '',
  onDescriptionChange,
}: UseArticleEditorParams) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const [initialContent, setInitialContent] = useState<ProseMirrorDoc | null>(null);
  // コンテンツ設定済みフラグ（複数回のsetContentを防ぐ）
  const contentSetRef = useRef(false);

  // エディタの初期化
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: EMPTY_DOC,
    theme: isDarkMode ? customDarkEditorTheme : undefined,
  });

  // エディタの状態を監視
  const editorState = useBridgeState(editor);

  // エディタのコンテンツをリアルタイムで取得（文字数カウント用）
  const editorContent = useEditorContent(editor, { type: 'text', debounceInterval: 100 });
  const charCount = editorContent?.replace(/\n/g, '').length ?? 0;

  // CSSを注入（パディングとダークモード）
  useEditorStyles({ editor, editorState, isDarkMode });

  // コンテンツをエディタに設定（サムネイル含む）
  useEffect(() => {
    // 既にコンテンツ設定済みの場合はスキップ
    if (contentSetRef.current) return;
    if (!isLoading && editorState.isReady) {
      // フラグを先に立てて重複実行を防ぐ
      contentSetRef.current = true;

      let content: ProseMirrorDoc = initialArticleContent || EMPTY_DOC;

      // サムネイル機能が有効な場合、初期コンテンツにサムネイルを含める
      if (isThumbnailEnabled) {
        if (thumbnailImageUrl) {
          content = insertThumbnailToDoc(content, thumbnailImageUrl);
        } else {
          content = insertPlaceholderToDoc(content);
        }
        // description（スポットの一言）をサムネイルの直後に挿入
        content = insertDescriptionToDoc(content, initialDescription);
      }

      editor.setContent(content);

      // エディタが正規化した後のJSONを初期値として保存し、スクロール位置をリセット
      const saveInitialContent = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const normalizedJson = await editor.getJSON();
        // サムネイルとdescriptionを除外して初期値として保存
        let initialDoc = removeThumbnailFromDoc(normalizedJson as ProseMirrorDoc);
        initialDoc = removeDescriptionFromDoc(initialDoc);
        setInitialContent(initialDoc);

        // スクロール位置を先頭にリセット
        await new Promise((resolve) => setTimeout(resolve, 50));
        editor.focus('start');
      };
      saveInitialContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, editorState.isReady]);

  // JSONが空かどうかを判定
  const isEmptyDoc = useCallback((doc: ProseMirrorDoc): boolean => {
    if (!doc.content || doc.content.length === 0) return true;
    if (doc.content.length === 1) {
      const firstNode = doc.content[0];
      if (!firstNode) return true;
      if (
        firstNode.type === 'paragraph' &&
        (!firstNode.content || firstNode.content.length === 0)
      ) {
        return true;
      }
    }
    return false;
  }, []);

  /**
   * ドキュメントからサムネイルとdescriptionを除外
   * 保存時や変更検知時に使用
   */
  const removeSpecialNodes = useCallback((doc: ProseMirrorDoc): ProseMirrorDoc => {
    let result = removeThumbnailFromDoc(doc);
    result = removeDescriptionFromDoc(result);
    return result;
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    try {
      const json = await editor.getJSON();
      const doc = json as ProseMirrorDoc;

      // descriptionを抽出してコールバック
      if (onDescriptionChange) {
        const description = getDescriptionFromDoc(doc);
        onDescriptionChange(description);
      }

      // サムネイルとdescriptionを除外してコンテンツを保存
      const docWithoutSpecialNodes = removeSpecialNodes(doc);
      const content = isEmptyDoc(docWithoutSpecialNodes) ? null : docWithoutSpecialNodes;

      const success = await onSave(content);
      if (success) {
        setInitialContent(docWithoutSpecialNodes);
      }
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [editor, onSave, isEmptyDoc, onDescriptionChange, removeSpecialNodes]);

  // 戻るボタン（変更検知付き）
  const handleBack = useCallback(async () => {
    const json = await editor.getJSON();
    const docWithoutSpecialNodes = removeSpecialNodes(json as ProseMirrorDoc);
    const currentIsEmpty = isEmptyDoc(docWithoutSpecialNodes);
    const originalIsEmpty = !initialContent || isEmptyDoc(initialContent);

    // 両方空なら変更なし
    if (currentIsEmpty && originalIsEmpty) {
      router.back();
      return;
    }

    // どちらかが空でどちらかが空でない場合は変更あり
    if (currentIsEmpty !== originalIsEmpty) {
      Alert.alert('変更を破棄しますか？', '保存していない変更があります。', [
        { text: 'キャンセル', style: 'cancel' },
        { text: '破棄', style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }

    // 両方空でない場合は内容を比較
    const currentStr = JSON.stringify(docWithoutSpecialNodes);
    const originalStr = JSON.stringify(initialContent);

    if (currentStr !== originalStr) {
      Alert.alert('変更を破棄しますか？', '保存していない変更があります。', [
        { text: 'キャンセル', style: 'cancel' },
        { text: '破棄', style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }

    router.back();
  }, [editor, initialContent, router, isEmptyDoc, removeSpecialNodes]);

  return {
    editor,
    editorState,
    charCount,
    isDarkMode,
    initialContent,
    handleSave,
    handleBack,
    isEmptyDoc,
  };
}
