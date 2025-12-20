/**
 * ラベルチップバー
 *
 * マップ画面のヘッダー下に表示される横スクロール式のラベルチップ
 * タップでスポットをフィルタリング（トグル動作：再度タップで解除）
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { MapLabelBasicInfo } from '@/shared/types';

interface LabelChipsBarProps {
  /** ラベル一覧 */
  labels: MapLabelBasicInfo[];
  /** 現在選択中のラベルID（null = すべて表示） */
  selectedLabelId: string | null;
  /** ラベル選択時のコールバック */
  onLabelSelect: (labelId: string | null) => void;
}

export function LabelChipsBar({
  labels,
  selectedLabelId,
  onLabelSelect,
}: LabelChipsBarProps) {
  const isDarkMode = useIsDarkMode();

  // ラベルがない場合は何も表示しない
  if (labels.length === 0) {
    return null;
  }

  const handlePress = (labelId: string) => {
    // トグル動作: 同じラベルを再度押すと解除（nullに戻す）
    const newLabelId = selectedLabelId === labelId ? null : labelId;
    onLabelSelect(newLabelId);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      {labels.map((label) => {
        const isActive = selectedLabelId === label.id;
        return (
          <Pressable
            key={label.id}
            onPress={() => handlePress(label.id)}
            className={`flex-row items-center px-3 py-2 rounded-full active:opacity-80 ${
              isActive ? 'bg-primary' : 'bg-surface dark:bg-dark-surface-elevated'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.4 : 0.15,
              shadowRadius: isDarkMode ? 6 : 4,
              elevation: isDarkMode ? 6 : 3,
            }}
          >
            {/* カラードット */}
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: isActive ? 'white' : label.color }}
            />
            <Text
              className={`ml-1.5 text-sm font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-foreground-secondary dark:text-dark-foreground'
              }`}
            >
              {label.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
