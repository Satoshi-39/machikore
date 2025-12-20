/**
 * ラベルチップバー
 *
 * マップ画面のヘッダー下に表示される横スクロール式のラベルチップ
 * タップでスポットをフィルタリング
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import type { MapLabelBasicInfo } from '@/shared/types';

interface LabelChipsBarProps {
  /** ラベル一覧 */
  labels: MapLabelBasicInfo[];
  /** 現在選択中のラベルID（null = すべて） */
  selectedLabelId: string | null;
  /** ラベル選択時のコールバック */
  onLabelSelect: (labelId: string | null) => void;
}

export function LabelChipsBar({
  labels,
  selectedLabelId,
  onLabelSelect,
}: LabelChipsBarProps) {
  // ラベルがない場合は何も表示しない
  if (labels.length === 0) {
    return null;
  }

  const isAllSelected = selectedLabelId === null;

  return (
    <View
      className="bg-background/95 dark:bg-dark-background/95"
      style={{
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {/* 「すべて」チップ */}
        <Pressable
          onPress={() => onLabelSelect(null)}
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${
            isAllSelected
              ? 'bg-primary/10 border-primary'
              : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              isAllSelected
                ? 'text-primary'
                : 'text-foreground dark:text-dark-foreground'
            }`}
          >
            すべて
          </Text>
        </Pressable>

        {/* 各ラベルチップ */}
        {labels.map((label) => {
          const isSelected = selectedLabelId === label.id;
          return (
            <Pressable
              key={label.id}
              onPress={() => onLabelSelect(label.id)}
              className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
              }`}
            >
              {/* カラードット */}
              <View
                className="w-3 h-3 rounded-full mr-1.5"
                style={{ backgroundColor: label.color }}
              />
              <Text
                className={`text-sm font-medium ${
                  isSelected
                    ? 'text-primary'
                    : 'text-foreground dark:text-dark-foreground'
                }`}
              >
                {label.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
