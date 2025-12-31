/**
 * 検索トグルボタン
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchToggleProps {
  onPress: () => void;
}

export function SearchToggle({ onPress }: SearchToggleProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name="search"
        size={24}
        color="#374151"
      />
    </TouchableOpacity>
  );
}
