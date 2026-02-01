/**
 * 記事編集へのフローティングアクションボタン
 *
 * スポット作成・編集ページで使用
 * 右上に固定表示され、タップで記事編集ページへ遷移
 */

import React from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface ArticleFabProps {
  /** ボタン押下時のコールバック */
  onPress: () => void;
  /** 記事が入力済みかどうか */
  hasContent?: boolean;
  /** 非活性状態（未保存の変更がある場合） */
  disabled?: boolean;
}

export function ArticleFab({ onPress, hasContent = false, disabled = false }: ArticleFabProps) {
  const { t } = useI18n();

  const handlePress = () => {
    if (disabled) {
      Alert.alert(
        t('spot.unsavedChanges'),
        t('spot.saveBeforeEditingArticle')
      );
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.8}
      className={`absolute items-center justify-center rounded-full shadow-lg ${
        disabled ? 'bg-gray-400' : 'bg-primary'
      }`}
      style={{
        right: 16,
        top: 16,
        width: 60,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: disabled ? 0.1 : 0.25,
        shadowRadius: 4,
        elevation: disabled ? 2 : 5,
      }}
    >
      <Ionicons
        name="pencil"
        size={iconSizeNum.md}
        color={disabled ? colors.primitive.gray[300] : colors.primitive.base.white}
      />
      <Text className={`text-xs mt-0.5 ${disabled ? 'text-gray-300' : 'text-on-primary'}`}>
        {t('spot.article')}
      </Text>
      {!hasContent && !disabled && (
        <View
          className="absolute w-3 h-3 rounded-full bg-orange-400 border-2 border-primary"
          style={{ top: 4, right: 4 }}
        />
      )}
    </TouchableOpacity>
  );
}
