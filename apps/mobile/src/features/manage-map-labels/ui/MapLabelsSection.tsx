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
  iconSizeNum,
} from '@/shared/config';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

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
  const { t } = useI18n();
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
      Alert.alert(t('common.error'), t('mapLabel.duplicateError'));
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
      Alert.alert(t('common.error'), t('mapLabel.emptyNameError'));
      return;
    }

    // 重複チェック（自分自身は除外、削除されていないラベルのみ）
    if (visibleLabels.some((l) => l.name === trimmedName && l.id !== editingLabel.id)) {
      Alert.alert(t('common.error'), t('mapLabel.duplicateError'));
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
              isSelected ? 'border-2 border-foreground' : ''
            }`}
            style={{ backgroundColor: colorOption.color }}
          >
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={iconSizeNum.sm}
                color={colorOption.key === 'white' ? colors.light['on-surface'] : colors.light.surface}
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
        <Text className="text-base font-semibold text-on-surface">
          {t('mapLabel.heading')}
        </Text>
        {!isAddingLabel && (
          <TouchableOpacity
            onPress={() => setIsAddingLabel(true)}
            className="flex-row items-center"
          >
            <Ionicons name="add-circle-outline" size={iconSizeNum.lg} className="text-gray-500" />
            <Text className="text-sm text-on-surface-variant ml-1">{t('mapLabel.add')}</Text>
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
              className="flex-row items-center justify-between bg-surface border-thin border-outline rounded-lg px-3 py-2 mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: label.color }}
                />
                <Text className="text-base text-on-surface">
                  {label.name}
                </Text>
                {label.isNew && (
                  <Text className="text-xs text-blue-500 ml-2">{t('mapLabel.badgeNew')}</Text>
                )}
                {label.isModified && (
                  <Text className="text-xs text-orange-500 ml-2">{t('mapLabel.badgeModified')}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-gray-400" />
            </TouchableOpacity>
          ))}
        </View>
      ) : !isAddingLabel ? (
        <View className="bg-secondary rounded-lg px-4 py-3">
          <Text className="text-sm text-on-surface-variant text-center">
            {t('mapLabel.empty')}
          </Text>
        </View>
      ) : null}

      {/* 新しいラベル追加フォーム */}
      {isAddingLabel && (
        <View className="bg-surface border-thin border-outline rounded-lg p-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-medium text-on-surface">
              {t('mapLabel.newLabel')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddingLabel(false);
                setNewLabelName('');
                setSelectedLabelColor(DEFAULT_SPOT_COLOR);
              }}
              className="p-1"
            >
              <Ionicons name="close" size={iconSizeNum.md} className="text-gray-400" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <TextInput
              value={newLabelName}
              onChangeText={setNewLabelName}
              placeholder={t('mapLabel.labelNamePlaceholder')}
              maxLength={20}
              autoFocus
              className="flex-1 bg-secondary border-thin border-outline rounded-lg px-3 py-2 text-base text-on-surface mr-2"
              placeholderTextColor={colors.light['on-surface-variant']}
            />
            <Button
              onPress={handleAddLabel}
              disabled={!newLabelName.trim()}
              size="sm"
            >
              <ButtonText className={buttonTextVariants({ size: 'sm' })}>{t('mapLabel.add')}</ButtonText>
            </Button>
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
            className="bg-surface rounded-2xl mx-6 w-[85%] max-w-sm"
          >
            <View className="px-4 py-3 border-b-thin border-outline flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-on-surface">
                {t('mapLabel.editLabel')}
              </Text>
              <TouchableOpacity onPress={() => setEditingLabel(null)} className="p-1">
                <Ionicons name="close" size={iconSizeNum.lg} className="text-gray-500" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <Text className="text-sm font-medium text-on-surface-variant mb-2">
                {t('mapLabel.labelName')}
              </Text>
              <TextInput
                value={editLabelName}
                onChangeText={setEditLabelName}
                placeholder={t('mapLabel.labelNamePlaceholder')}
                maxLength={20}
                autoFocus
                className="bg-secondary border-thin border-outline rounded-lg px-3 py-2 text-base text-on-surface mb-4"
                placeholderTextColor={colors.light['on-surface-variant']}
              />

              <Text className="text-sm font-medium text-on-surface-variant mb-2">
                {t('mapLabel.color')}
              </Text>
              <ColorPicker selectedColor={editLabelColor} onColorChange={setEditLabelColor} />

              <View className="flex-row mt-6 gap-3">
                <Button
                  onPress={() => editingLabel && handleDeleteLabel(editingLabel.id)}
                  variant="outline"
                  className="flex-1 border-red-500"
                >
                  <ButtonText className={`${buttonTextVariants({ variant: 'outline' })} text-error`}>{t('common.delete')}</ButtonText>
                </Button>
                <Button
                  onPress={handleSaveEdit}
                  disabled={!editLabelName.trim()}
                  className="flex-1"
                >
                  <ButtonText className={buttonTextVariants()}>{t('common.save')}</ButtonText>
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
