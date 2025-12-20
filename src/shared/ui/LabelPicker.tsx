/**
 * ラベルピッカー
 *
 * react-native-dropdown-pickerを使用したラベル選択コンポーネント
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '@/shared/config';

interface MapLabel {
  id: string;
  name: string;
  color: string;
}

interface LabelPickerProps {
  labels: MapLabel[];
  selectedLabelId: string | null;
  onLabelChange: (labelId: string | null) => void;
  isLoading?: boolean;
  placeholder?: string;
  zIndex?: number;
  zIndexInverse?: number;
}

export function LabelPicker({
  labels,
  selectedLabelId,
  onLabelChange,
  isLoading = false,
  placeholder = 'ラベルを選択（任意）',
  zIndex = 3000,
  zIndexInverse = 1000,
}: LabelPickerProps) {
  const [open, setOpen] = useState(false);

  // ラベルをドロップダウン用のアイテムに変換
  const items = [
    {
      label: 'ラベルなし',
      value: '__none__',
      // 斜線付き丸アイコン
      icon: () => (
        <View style={styles.noLabelIcon}>
          <View style={styles.noLabelLine} />
        </View>
      ),
    },
    ...labels.map((label) => ({
      label: label.name,
      value: label.id,
      icon: () => (
        <View
          style={[styles.colorDot, { backgroundColor: label.color }]}
        />
      ),
    })),
  ];

  const handleChange = useCallback((callback: (prev: string | null) => string | null) => {
    const newValue = callback(selectedLabelId);
    onLabelChange(newValue === '__none__' ? null : newValue);
  }, [selectedLabelId, onLabelChange]);

  if (isLoading) {
    return <ActivityIndicator size="small" color={colors.primary.DEFAULT} />;
  }

  if (labels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>ラベルがありません</Text>
        <Text style={styles.emptySubText}>マップ設定でラベルを追加できます</Text>
      </View>
    );
  }

  return (
    <DropDownPicker
      open={open}
      value={selectedLabelId ?? '__none__'}
      items={items}
      setOpen={setOpen}
      setValue={handleChange}
      placeholder={placeholder}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
      textStyle={styles.text}
      placeholderStyle={styles.placeholder}
      listItemContainerStyle={styles.listItem}
      selectedItemContainerStyle={styles.selectedItem}
    />
  );
}

const styles = StyleSheet.create({
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  noLabelIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  noLabelLine: {
    width: 16,
    height: 1.5,
    backgroundColor: '#9CA3AF',
    transform: [{ rotate: '45deg' }],
  },
  emptyContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    minHeight: 48,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  listItem: {
    height: 48,
  },
  selectedItem: {
    backgroundColor: '#EFF6FF',
  },
});
