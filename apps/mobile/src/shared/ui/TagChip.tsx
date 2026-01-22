/**
 * タグチップコンポーネント
 *
 * FSD: shared/ui - 汎用的なタグ表示UI
 * タップするとタグ検索に遷移する
 */

import React from 'react';
import { Pressable, Text } from 'react-native';

interface TagChipProps {
  /** タグ名 */
  name: string;
  /** タップ時のコールバック */
  onPress?: (tagName: string) => void;
}

export function TagChip({ name, onPress }: TagChipProps) {
  return (
    <Pressable
      onPress={() => onPress?.(name)}
      className="mr-2 mb-1"
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      <Text className="text-sm text-primary">
        #{name}
      </Text>
    </Pressable>
  );
}
