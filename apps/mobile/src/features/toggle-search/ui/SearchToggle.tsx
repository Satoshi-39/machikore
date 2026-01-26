/**
 * 検索トグルボタン
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface SearchToggleProps {
  onPress: () => void;
}

export function SearchToggle({ onPress }: SearchToggleProps) {
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name="search"
        size={24}
        color={themeColors['on-surface']}
      />
    </TouchableOpacity>
  );
}
