/**
 * リッチテキストエディタ
 *
 * @10play/tentap-editor を使用したWYSIWYGエディタ
 */

import React, { useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors } from '@/shared/config';

interface RichTextEditorProps {
  /** 初期コンテンツ（HTML形式） */
  initialContent?: string;
  /** コンテンツ変更時のコールバック */
  onContentChange?: (html: string) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** エディタの最小高さ */
  minHeight?: number;
  /** 自動フォーカス */
  autofocus?: boolean;
}

export function RichTextEditor({
  initialContent = '',
  onContentChange,
  placeholder: _placeholder = '記事を書いてみましょう...',
  minHeight = 200,
  autofocus = false,
}: RichTextEditorProps) {
  const isDarkMode = useIsDarkMode();

  // テーマカラーを取得
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const editor = useEditorBridge({
    autofocus,
    avoidIosKeyboard: true,
    initialContent: initialContent || '<p></p>',
    theme: {
      toolbar: {
        toolbarBody: {
          backgroundColor: themeColors.surface,
          borderTopWidth: 1,
          borderTopColor: themeColors.outline,
        },
        iconWrapper: {
          backgroundColor: 'transparent',
        },
        iconWrapperActive: {
          backgroundColor: themeColors.secondary,
        },
        icon: {
          tintColor: themeColors['on-surface'],
        },
        iconActive: {
          tintColor: colors.primary.DEFAULT,
        },
      },
      webview: {
        backgroundColor: themeColors.surface,
      },
    },
  });

  // コンテンツ変更ハンドラー
  const handleContentChange = useCallback(async () => {
    if (onContentChange) {
      const html = await editor.getHTML();
      onContentChange(html);
    }
  }, [editor, onContentChange]);

  return (
    <View style={[styles.container, { minHeight }]}>
      <View
        style={[
          styles.editorContainer,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.outline,
          },
        ]}
      >
        <RichText editor={editor} onBlur={handleContentChange} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
