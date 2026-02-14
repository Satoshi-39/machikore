/**
 * 記事エディタのコアロジック
 *
 * TenTapエディタの初期化、コンテンツ管理、保存処理を担当
 * Advanced Setupを使用してYouTube埋め込みなどのカスタム拡張をサポート
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  darkEditorTheme,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
  type EditorTheme,
} from '@10play/tentap-editor';
import { EmbedBridge } from './embed-bridge';
import { ThumbnailBridge } from './thumbnail-bridge';
import { DescriptionBridge } from './description-bridge';
import { TrailingNodeBridge } from './trailing-node-bridge';
import { ImageManagementBridge } from './image-management-bridge';
import { colors, borderRadiusNum } from '@/shared/config';
import { useEditorStyles, EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { ProseMirrorDoc } from '@/shared/types';
import {
  removeThumbnailFromDoc,
  insertThumbnailToDoc,
  insertEmptyThumbnailToDoc,
  insertDescriptionToDoc,
  removeDescriptionFromDoc,
  getDescriptionFromDoc,
  extractTextFromDoc,
} from './editor-nodes';
// Advanced Setup: カスタムビルドしたエディタHTML
// YouTube埋め込みなどのカスタム拡張を追加可能
import { editorHtml } from '@editor-web/build/editorHtml';

/** 空のドキュメント */
const EMPTY_DOC: ProseMirrorDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

/** カスタムライトテーマ（アイコン色を on-surface に統一） */
const customLightEditorTheme: EditorTheme = {
  toolbar: {
    toolbarBody: {
      // ボーダーはEditorToolbarで統一して設定するため、ここでは設定しない
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: colors.primitive.base.white,
    },
    toolbarButton: {
      backgroundColor: colors.primitive.base.white,
    },
    iconWrapper: {
      borderRadius: borderRadiusNum.sm,
      backgroundColor: colors.primitive.base.white,
    },
    iconWrapperActive: {
      backgroundColor: colors.light['surface-variant'],
    },
    iconWrapperDisabled: {
      opacity: 0.3,
    },
    // アイコン色を on-surface に統一
    icon: {
      height: 28,
      width: 28,
      tintColor: colors.light['on-surface'],
    },
    iconActive: {},
    iconDisabled: {
      tintColor: colors.light['on-surface-variant'],
    },
    hidden: {
      display: 'none',
    },
    keyboardAvoidingView: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    linkBarTheme: {
      addLinkContainer: {
        backgroundColor: colors.primitive.base.white,
        borderTopColor: colors.light.outline,
        borderBottomColor: colors.light.outline,
      },
      linkInput: {},
      doneButton: {},
      doneButtonText: {},
      linkToolbarButton: {},
    },
  },
  webview: {
    backgroundColor: colors.primitive.base.white,
  },
  webviewContainer: {},
};

/** カスタムダークテーマ（背景色を surface と統一） */
const customDarkEditorTheme: EditorTheme = {
  ...darkEditorTheme,
  toolbar: {
    ...darkEditorTheme.toolbar,
    toolbarBody: {
      // ボーダーはEditorToolbarで統一して設定するため、ここでは設定しない
      borderTopWidth: 0,
      borderBottomWidth: 0,
      backgroundColor: EDITOR_DARK_BG_COLOR,
    },
    toolbarButton: {
      backgroundColor: EDITOR_DARK_BG_COLOR,
    },
    iconWrapper: {
      borderRadius: borderRadiusNum.sm,
      backgroundColor: EDITOR_DARK_BG_COLOR,
    },
    iconWrapperActive: {
      backgroundColor: colors.dark['surface-variant'],
    },
    // アイコン色を on-surface に統一
    icon: {
      height: 28,
      width: 28,
      tintColor: colors.dark['on-surface'],
    },
    iconDisabled: {
      tintColor: colors.dark['on-surface-variant'],
    },
    linkBarTheme: {
      ...darkEditorTheme.toolbar.linkBarTheme,
      addLinkContainer: {
        backgroundColor: EDITOR_DARK_BG_COLOR,
        borderTopColor: colors.dark.outline,
        borderBottomColor: colors.dark.outline,
      },
    },
  },
  webview: {
    backgroundColor: EDITOR_DARK_BG_COLOR,
  },
};

/** サムネイルクロップ情報 */
type ThumbnailCropData = {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
} | null;

interface UseArticleEditorParams {
  initialArticleContent: ProseMirrorDoc | null;
  isLoading: boolean;
  onSave: (content: ProseMirrorDoc | null) => Promise<boolean>;
  /** サムネイル画像URL（初期コンテンツに含めるため） */
  thumbnailImageUrl?: string | null;
  /** サムネイルのクロップ情報 */
  thumbnailCrop?: ThumbnailCropData;
  /** サムネイル機能が有効かどうか */
  isThumbnailEnabled?: boolean;
  /** 初期description（スポットのひとこと） */
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
  thumbnailCrop,
  isThumbnailEnabled = false,
  initialDescription = '',
  onDescriptionChange,
}: UseArticleEditorParams) {
  const router = useRouter();
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const [initialContent, setInitialContent] = useState<ProseMirrorDoc | null>(null);
  // 保存済みのdescription（変更検知用）
  const [savedDescription, setSavedDescription] = useState(initialDescription);
  // コンテンツ設定済みフラグ（複数回のsetContentを防ぐ）
  const contentSetRef = useRef(false);

  // サムネイル機能の有無でbridgeExtensionsを切り替え
  // isThumbnailEnabled=falseの場合、ThumbnailBridgeとDescriptionBridgeを除外し、
  // エディタWeb側のCustomDocument（thumbnail description block+）が適用されないようにする
  const bridgeExtensions = useMemo(
    () =>
      isThumbnailEnabled
        ? [...TenTapStartKit, EmbedBridge, ThumbnailBridge, DescriptionBridge, ImageManagementBridge, TrailingNodeBridge]
        : [...TenTapStartKit, EmbedBridge, ImageManagementBridge, TrailingNodeBridge],
    [isThumbnailEnabled]
  );

  // エディタの初期化（Advanced Setup: customSourceでカスタムエディタを使用）
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: EMPTY_DOC,
    theme: isDarkMode ? customDarkEditorTheme : customLightEditorTheme,
    bridgeExtensions,
    customSource: editorHtml,
  });

  // エディタの状態を監視
  const editorState = useBridgeState(editor);

  // エディタのコンテンツをリアルタイムで取得（文字数カウント用）
  // JSON形式で取得し、description/thumbnailノードを除外して本文のみカウント
  const editorContentJson = useEditorContent(editor, { type: 'json', debounceInterval: 100 });
  const charCount = useMemo(() => {
    if (!editorContentJson) return 0;
    const doc = editorContentJson as ProseMirrorDoc;
    const bodyDoc = removeDescriptionFromDoc(removeThumbnailFromDoc(doc));
    return extractTextFromDoc(bodyDoc).replace(/\n/g, '').length;
  }, [editorContentJson]);

  // CSSを注入（パディングとダークモード）
  // サムネイル機能が有効な場合のみdescriptionプレースホルダーを表示
  const descriptionPlaceholder = isThumbnailEnabled ? t('editArticle.descriptionPlaceholder') : undefined;
  useEditorStyles({ editor, editorState, isDarkMode, descriptionPlaceholder });

  // コンテンツをエディタに設定（サムネイル含む）
  useEffect(() => {
    // 既にコンテンツ設定済みの場合はスキップ
    if (contentSetRef.current) return;
    if (!isLoading && editorState.isReady) {
      // フラグを先に立てて重複実行を防ぐ
      contentSetRef.current = true;

      let content: ProseMirrorDoc = initialArticleContent || EMPTY_DOC;

      // サムネイル機能が有効な場合、初期コンテンツにサムネイルを含める
      // スキーマ（thumbnail description block+）維持のため、ノードは常に挿入する
      if (isThumbnailEnabled) {
        if (thumbnailImageUrl) {
          content = insertThumbnailToDoc(content, thumbnailImageUrl, thumbnailCrop);
        } else {
          content = insertEmptyThumbnailToDoc(content);
        }
        // description（スポットのひとこと）をサムネイルの直後に挿入
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

  // 外部（スポット編集ページ）でdescriptionが更新された場合にエディタを同期
  const prevDescriptionRef = useRef(initialDescription);
  useEffect(() => {
    if (!contentSetRef.current || !editorState.isReady) return;
    if (initialDescription !== prevDescriptionRef.current) {
      prevDescriptionRef.current = initialDescription;
      setSavedDescription(initialDescription);
      editor.setDescription(initialDescription);
    }
  }, [initialDescription, editorState.isReady, editor]);

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
        // 保存済みdescriptionを更新（変更検知用）
        if (onDescriptionChange) {
          const description = getDescriptionFromDoc(doc);
          setSavedDescription(description);
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('editArticleAlert.saveFailed'));
    }
  }, [editor, onSave, isEmptyDoc, onDescriptionChange, removeSpecialNodes, t]);

  // 戻るボタン（変更検知付き）
  const handleBack = useCallback(async () => {
    const json = await editor.getJSON();
    const doc = json as ProseMirrorDoc;

    // descriptionの変更を検知
    const currentDescription = getDescriptionFromDoc(doc);
    const isDescriptionChanged = currentDescription !== savedDescription;

    const docWithoutSpecialNodes = removeSpecialNodes(doc);
    const currentIsEmpty = isEmptyDoc(docWithoutSpecialNodes);
    const originalIsEmpty = !initialContent || isEmptyDoc(initialContent);

    // 記事本文の変更を検知
    let isContentChanged = false;
    if (currentIsEmpty !== originalIsEmpty) {
      isContentChanged = true;
    } else if (!currentIsEmpty && !originalIsEmpty) {
      isContentChanged = JSON.stringify(docWithoutSpecialNodes) !== JSON.stringify(initialContent);
    }

    if (isDescriptionChanged || isContentChanged) {
      Alert.alert(t('editArticle.discardTitle'), t('editArticle.discardMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('editArticle.discard'), style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }

    router.back();
  }, [editor, initialContent, savedDescription, router, isEmptyDoc, removeSpecialNodes, t]);

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
