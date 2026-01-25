/**
 * FAB (Floating Action Button) コンポーネント
 *
 * X(Twitter)のような右下固定の浮動アクションボタン
 * 複数のアイコンライブラリに対応
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons';
import { colors } from '@/shared/config';

type IconLibrary = 'ionicons' | 'antdesign' | 'material' | 'fontawesome';

interface FABProps {
  onPress: () => void;
  icon?: string;
  iconLibrary?: IconLibrary;
  color?: string;
  testID?: string;
}

export function FAB({
  onPress,
  icon = 'add',
  iconLibrary = 'ionicons',
  color = colors.primitive.brand["400"],
  testID
}: FABProps) {
  // アイコンライブラリに応じたアイコンコンポーネントを選択
  const renderIcon = () => {
    const iconProps = { size: 24, color: 'white' };

    switch (iconLibrary) {
      case 'antdesign':
        return <AntDesign name={icon as any} {...iconProps} />;
      case 'material':
        return <MaterialCommunityIcons name={icon as any} {...iconProps} />;
      case 'fontawesome':
        return <FontAwesome5 name={icon as any} {...iconProps} />;
      case 'ionicons':
      default:
        return <Ionicons name={icon as any} {...iconProps} />;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className="w-14 h-14 rounded-full shadow-lg active:opacity-80"
      style={{ backgroundColor: color }}
    >
      <View className="w-full h-full items-center justify-center">
        {renderIcon()}
      </View>
    </Pressable>
  );
}
