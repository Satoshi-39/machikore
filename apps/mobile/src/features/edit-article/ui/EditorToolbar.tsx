/**
 * エディタ用カスタムツールバー
 *
 * 10tap-editorのToolbarをラップし、プラスボタンを追加
 * - プラスボタン: 画像挿入などのメニューを開く
 * - その他: デフォルトのツールバーアイテム
 */

import { colors, iconSizeNum, borderWidthNum } from '@/shared/config';
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
  /** プラスボタンを無効化するかどうか */
  isPlusDisabled?: boolean;
}

export function EditorToolbar({ editor, onPlusPress, isPlusDisabled = false }: EditorToolbarProps) {
  const isDarkMode = useIsDarkMode();
  const { isKeyboardUp } = useKeyboard();

  // 不要なアイテムを除外し、キーボード表示時のみ活性化
  const filteredToolbarItems: ToolbarItem[] = useMemo(() => {
    return DEFAULT_TOOLBAR_ITEMS.filter(
      (_, index) => !EXCLUDED_ITEM_INDICES.includes(index)
    ).map((item) => ({
      ...item,
      // キーボードが上がっている時のみ活性化
      disabled: () => !isKeyboardUp,
    }));
  }, [isKeyboardUp]);

  // キーボードの表示/非表示を切り替え
  const handleKeyboardToggle = () => {
    if (isKeyboardUp) {
      editor.blur();
    } else {
      editor.focus();
    }
  };

  // ツールバー背景色（セマンティックトークンを使用）
  const toolbarBgColor = isDarkMode ? colors.dark.surface : colors.primitive.base.white;

  // ボーダー色（セマンティックトークンを使用）
  const borderColor = isDarkMode ? colors.dark['outline-variant'] : colors.light['outline-variant'];

  return (
    <View
      className="flex-row items-center"
      style={{
        backgroundColor: toolbarBgColor,
        borderTopWidth: borderWidthNum.hairline,
        borderTopColor: borderColor,
      }}
    >
      {/* プラスボタン */}
      <Pressable
        onPress={onPlusPress}
        disabled={isPlusDisabled}
        className="h-11 w-11 items-center justify-center"
        style={{
          backgroundColor: toolbarBgColor,
          opacity: isPlusDisabled ? 0.3 : 1,
        }}
      >
        <View className="h-7 w-7 items-center justify-center rounded">
          <Ionicons
            name="add"
            size={iconSizeNum.lg}
            color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
          />
        </View>
      </Pressable>

      {/* 区切り線 */}
      <View
        className="h-6 w-px"
        style={{
          backgroundColor: isDarkMode ? colors.dark.outline : colors.light.outline,
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
          backgroundColor: isDarkMode ? colors.dark.outline : colors.light.outline,
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
            size={iconSizeNum.md}
            color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
          />
        </View>
      </Pressable>
    </View>
  );
}
