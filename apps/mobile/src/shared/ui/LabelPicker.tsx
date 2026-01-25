/**
 * ラベルピッカー
 *
 * react-native-dropdown-pickerを使用したラベル選択コンポーネント
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';

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
  placeholder,
  zIndex = 3000,
  zIndexInverse = 1000,
}: LabelPickerProps) {
  const [open, setOpen] = useState(false);
  const isDarkMode = useIsDarkMode();
  const { t } = useI18n();

  // テーマに応じた色を取得
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // ラベルをドロップダウン用のアイテムに変換
  const items = [
    {
      label: t('label.noLabel'),
      value: '__none__',
      icon: () => (
        <View
          className="w-3 h-3 rounded-full border-[1.5px] mr-2 justify-center items-center overflow-hidden"
          style={{ borderColor: themeColors['on-surface-variant'] }}
        >
          <View
            className="w-4 h-[1.5px]"
            style={{
              backgroundColor: themeColors['on-surface-variant'],
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      ),
    },
    ...labels.map((label) => ({
      label: label.name,
      value: label.id,
      icon: () => (
        <View
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: label.color }}
        />
      ),
    })),
  ];

  const handleChange = useCallback((callback: (prev: string | null) => string | null) => {
    const newValue = callback(selectedLabelId);
    onLabelChange(newValue === '__none__' ? null : newValue);
  }, [selectedLabelId, onLabelChange]);

  if (isLoading) {
    return <ActivityIndicator size="small" className="text-primary" />;
  }

  if (labels.length === 0) {
    return (
      <View
        className="rounded-lg px-4 py-3"
        style={{ backgroundColor: themeColors['surface-variant'] }}
      >
        <Text
          className="text-sm text-center"
          style={{ color: themeColors['on-surface-variant'] }}
        >
          {t('label.noLabels')}
        </Text>
        <Text
          className="text-xs text-center mt-1"
          style={{ color: themeColors['on-surface-variant'] }}
        >
          {t('label.addFromMapSettings')}
        </Text>
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
      placeholder={placeholder || t('label.selectLabel')}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.outline,
        borderRadius: 8,
        minHeight: 48,
      }}
      dropDownContainerStyle={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.outline,
        borderRadius: 8,
      }}
      textStyle={{
        fontSize: 16,
        color: themeColors['on-surface'],
      }}
      placeholderStyle={{
        color: themeColors['on-surface-variant'],
      }}
      listItemContainerStyle={{
        height: 48,
      }}
      selectedItemContainerStyle={{
        backgroundColor: `${colors.light.primary}15`,
      }}
    />
  );
}
