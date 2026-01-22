/**
 * エディタ用カスタムツールバー
 *
 * 10tap-editorのToolbarをラップし、プラスボタンを追加
 * - プラスボタン: 画像挿入などのメニューを開く
 * - その他: デフォルトのツールバーアイテム
 */

import { colors } from '@/shared/config';
import { EDITOR_DARK_BG_COLOR } from '@/shared/lib/editor';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  Toolbar,
  DEFAULT_TOOLBAR_ITEMS,
  useKeyboard,
  type ToolbarItem,
  type EditorBridge,
} from '@10play/tentap-editor';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';

/** ツールバーから除外するアイテムのインデックス */
const EXCLUDED_ITEM_INDICES = [
  3, // TaskList - 記事には不要
  5, // Code - 技術記事向け
];

interface EditorToolbarProps {
  /** エディタインスタンス */
  editor: EditorBridge;
  /** プラスボタン押下時のコールバック */
  onPlusPress: () => void;
}

export function EditorToolbar({ editor, onPlusPress }: EditorToolbarProps) {
  const isDarkMode = useIsDarkMode();
  const { isKeyboardUp } = useKeyboard();

  // 不要なアイテムを除外したツールバーアイテム
  const filteredToolbarItems: ToolbarItem[] = useMemo(() => {
    return DEFAULT_TOOLBAR_ITEMS.filter(
      (_, index) => !EXCLUDED_ITEM_INDICES.includes(index)
    );
  }, []);

  // キーボードの表示/非表示を切り替え
  const handleKeyboardToggle = () => {
    if (isKeyboardUp) {
      editor.blur();
    } else {
      editor.focus();
    }
  };

  // 10tap-editorのToolbar背景色に合わせる
  // ダークモード: EDITOR_DARK_BG_COLOR、ライトモード: white
  const toolbarBgColor = isDarkMode ? EDITOR_DARK_BG_COLOR : colors.white;

  return (
    <View
      className="flex-row items-center"
      style={{
        borderTopWidth: 0.5,
        borderTopColor: isDarkMode ? '#939394' : '#DEE0E3',
      }}
    >
      {/* プラスボタン */}
      <Pressable
        onPress={onPlusPress}
        className="h-11 w-11 items-center justify-center"
        style={{ backgroundColor: toolbarBgColor }}
      >
        <View className="h-7 w-7 items-center justify-center rounded">
          <Ionicons
            name="add"
            size={24}
            color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
          />
        </View>
      </Pressable>

      {/* 区切り線 */}
      <View
        className="h-6 w-px"
        style={{
          backgroundColor: isDarkMode ? colors.dark.border : colors.light.border,
        }}
      />

      {/* デフォルトツールバー（フィルタ済み） */}
      <View className="flex-1">
        <Toolbar editor={editor} items={filteredToolbarItems} hidden={false} />
      </View>

      {/* 区切り線 */}
      <View
        className="h-6 w-px"
        style={{
          backgroundColor: isDarkMode ? colors.dark.border : colors.light.border,
        }}
      />

      {/* キーボード表示/非表示ボタン */}
      <Pressable
        onPress={handleKeyboardToggle}
        className="h-11 w-11 items-center justify-center"
        style={{ backgroundColor: toolbarBgColor }}
      >
        <View className="h-7 w-7 items-center justify-center rounded">
          <Ionicons
            name={isKeyboardUp ? 'chevron-down' : 'chevron-up'}
            size={22}
            color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
          />
        </View>
      </Pressable>
    </View>
  );
}
