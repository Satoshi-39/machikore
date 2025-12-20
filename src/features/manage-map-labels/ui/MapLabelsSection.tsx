/**
 * マップラベル管理セクション
 *
 * FSD: features/manage-map-labels/ui に配置
 * - ラベルの一覧表示、追加、編集、削除（ローカルステート）
 * - 実際の保存は親コンポーネントで行う
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  SPOT_COLOR_LIST,
  SPOT_COLORS,
  DEFAULT_SPOT_COLOR,
  type SpotColor,
} from '@/shared/config';

/** ラベルデータの型（ローカル管理用） */
export interface LocalMapLabel {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  /** 新規追加されたラベルかどうか */
  isNew?: boolean;
  /** 削除予定かどうか */
  isDeleted?: boolean;
  /** 変更されたかどうか */
  isModified?: boolean;
}

interface MapLabelsSectionProps {
  /** 現在のラベル一覧 */
  labels: LocalMapLabel[];
  /** ラベル変更時のコールバック */
  onLabelsChange: (labels: LocalMapLabel[]) => void;
}

export function MapLabelsSection({ labels, onLabelsChange }: MapLabelsSectionProps) {
  // 表示用のラベル（削除されていないもの）
  const visibleLabels = labels.filter((l) => !l.isDeleted);

  // 追加フォームの状態
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedLabelColor, setSelectedLabelColor] = useState<SpotColor>(DEFAULT_SPOT_COLOR);

  // 編集モーダルの状態
  const [editingLabel, setEditingLabel] = useState<LocalMapLabel | null>(null);
  const [editLabelName, setEditLabelName] = useState('');
  const [editLabelColor, setEditLabelColor] = useState<SpotColor>(DEFAULT_SPOT_COLOR);

  // ラベル追加ハンドラー
  const handleAddLabel = () => {
    const trimmedName = newLabelName.trim();
    if (!trimmedName) return;

    // 重複チェック（削除されていないラベルのみ）
    if (visibleLabels.some((l) => l.name === trimmedName)) {
      Alert.alert('エラー', '同じ名前のラベルが既に存在します');
      return;
    }

    const newLabel: LocalMapLabel = {
      id: `new_${Date.now()}`, // 一時的なID
      name: trimmedName,
      color: SPOT_COLORS[selectedLabelColor].color,
      sort_order: labels.length,
      isNew: true,
    };

    onLabelsChange([...labels, newLabel]);
    setNewLabelName('');
    setIsAddingLabel(false);
    setSelectedLabelColor(DEFAULT_SPOT_COLOR);
  };

  // 編集モーダルを開く
  const handleOpenEditModal = (label: LocalMapLabel) => {
    setEditingLabel(label);
    setEditLabelName(label.name);
    // 色をSpotColorキーに変換
    const colorKey = SPOT_COLOR_LIST.find((c) => c.color === label.color)?.key ?? DEFAULT_SPOT_COLOR;
    setEditLabelColor(colorKey);
  };

  // 編集保存ハンドラー
  const handleSaveEdit = () => {
    if (!editingLabel) return;

    const trimmedName = editLabelName.trim();
    if (!trimmedName) {
      Alert.alert('エラー', 'ラベル名を入力してください');
      return;
    }

    // 重複チェック（自分自身は除外、削除されていないラベルのみ）
    if (visibleLabels.some((l) => l.name === trimmedName && l.id !== editingLabel.id)) {
      Alert.alert('エラー', '同じ名前のラベルが既に存在します');
      return;
    }

    const updatedLabels = labels.map((l) =>
      l.id === editingLabel.id
        ? {
            ...l,
            name: trimmedName,
            color: SPOT_COLORS[editLabelColor].color,
            isModified: !l.isNew, // 新規でなければ変更フラグを立てる
          }
        : l
    );

    onLabelsChange(updatedLabels);
    setEditingLabel(null);
  };

  // ラベル削除ハンドラー（確認なしで即削除、実際のDB反映は保存時）
  const handleDeleteLabel = (labelId: string) => {
    const targetLabel = labels.find((l) => l.id === labelId);
    if (!targetLabel) return;

    if (targetLabel.isNew) {
      // 新規追加されたラベルは配列から削除
      onLabelsChange(labels.filter((l) => l.id !== labelId));
    } else {
      // 既存ラベルは削除フラグを立てる
      onLabelsChange(
        labels.map((l) =>
          l.id === labelId ? { ...l, isDeleted: true } : l
        )
      );
    }
    setEditingLabel(null);
  };

  // 色選択コンポーネント
  const ColorPicker = ({
    selectedColor,
    onColorChange,
  }: {
    selectedColor: SpotColor;
    onColorChange: (color: SpotColor) => void;
  }) => (
    <View className="flex-row flex-wrap gap-2">
      {SPOT_COLOR_LIST.map((colorOption) => {
        const isSelected = selectedColor === colorOption.key;
        return (
          <TouchableOpacity
            key={colorOption.key}
            onPress={() => onColorChange(colorOption.key)}
            className={`w-8 h-8 rounded-full items-center justify-center ${
              isSelected ? 'border-2 border-foreground dark:border-dark-foreground' : ''
            }`}
            style={{ backgroundColor: colorOption.color }}
          >
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={16}
                color={colorOption.key === 'white' ? '#000000' : '#FFFFFF'}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
          ラベル
        </Text>
        {!isAddingLabel && (
          <TouchableOpacity
            onPress={() => setIsAddingLabel(true)}
            className="flex-row items-center"
          >
            <Ionicons name="add-circle" size={24} color={colors.primary.DEFAULT} />
            <Text className="text-sm text-primary ml-1">追加</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 既存のラベル一覧 */}
      {visibleLabels.length > 0 ? (
        <View className="mb-3">
          {visibleLabels.map((label) => (
            <TouchableOpacity
              key={label.id}
              onPress={() => handleOpenEditModal(label)}
              className="flex-row items-center justify-between bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-3 py-2 mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: label.color }}
                />
                <Text className="text-base text-foreground dark:text-dark-foreground">
                  {label.name}
                </Text>
                {label.isNew && (
                  <Text className="text-xs text-blue-500 ml-2">（新規）</Text>
                )}
                {label.isModified && (
                  <Text className="text-xs text-orange-500 ml-2">（変更）</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>
      ) : !isAddingLabel ? (
        <View className="bg-muted dark:bg-dark-muted rounded-lg px-4 py-3">
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
            ラベルがありません
          </Text>
        </View>
      ) : null}

      {/* 新しいラベル追加フォーム */}
      {isAddingLabel && (
        <View className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-medium text-foreground dark:text-dark-foreground">
              新しいラベル
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddingLabel(false);
                setNewLabelName('');
                setSelectedLabelColor(DEFAULT_SPOT_COLOR);
              }}
              className="p-1"
            >
              <Ionicons name="close" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <TextInput
              value={newLabelName}
              onChangeText={setNewLabelName}
              placeholder="ラベル名"
              maxLength={20}
              autoFocus
              className="flex-1 bg-muted dark:bg-dark-muted border border-border dark:border-dark-border rounded-lg px-3 py-2 text-base text-foreground dark:text-dark-foreground mr-2"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={handleAddLabel}
              disabled={!newLabelName.trim()}
              className={`px-4 py-2 rounded-lg ${
                !newLabelName.trim() ? 'bg-blue-300' : 'bg-blue-500'
              }`}
            >
              <Text className="text-white font-medium">追加</Text>
            </TouchableOpacity>
          </View>

          <ColorPicker selectedColor={selectedLabelColor} onColorChange={setSelectedLabelColor} />
        </View>
      )}

      {/* 編集モーダル */}
      <Modal
        visible={editingLabel !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingLabel(null)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setEditingLabel(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="bg-surface dark:bg-dark-surface rounded-2xl mx-6 w-[85%] max-w-sm"
          >
            <View className="px-4 py-3 border-b border-border dark:border-dark-border flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
                ラベルを編集
              </Text>
              <TouchableOpacity onPress={() => setEditingLabel(null)} className="p-1">
                <Ionicons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
                ラベル名
              </Text>
              <TextInput
                value={editLabelName}
                onChangeText={setEditLabelName}
                placeholder="ラベル名"
                maxLength={20}
                autoFocus
                className="bg-muted dark:bg-dark-muted border border-border dark:border-dark-border rounded-lg px-3 py-2 text-base text-foreground dark:text-dark-foreground mb-4"
                placeholderTextColor="#9CA3AF"
              />

              <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
                色
              </Text>
              <ColorPicker selectedColor={editLabelColor} onColorChange={setEditLabelColor} />

              <View className="flex-row mt-6 gap-3">
                <TouchableOpacity
                  onPress={() => editingLabel && handleDeleteLabel(editingLabel.id)}
                  className="flex-1 py-3 rounded-lg border border-red-500 items-center"
                >
                  <Text className="text-red-500 font-medium">削除</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  disabled={!editLabelName.trim()}
                  className={`flex-1 py-3 rounded-lg items-center ${
                    !editLabelName.trim() ? 'bg-blue-300' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white font-medium">保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
