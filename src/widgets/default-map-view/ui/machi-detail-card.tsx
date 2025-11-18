/**
 * デフォルトマップ上で選択された街の詳細情報カード
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { MachiVisitInfo } from '@/widgets/machi-visit-info';
// import { MachiSpotList } from './machi-spot-list'; // TODO: 街とマップの関係を再設計後に実装
// import { useVisitByMachi } from '@/entities/visit/api'; // TODO: 将来使用予定
import { useCurrentUserId } from '@/entities/user';
import type { MachiRow } from '@/shared/types/database.types';

interface MachiDetailCardProps {
  machi: MachiRow;
  onClose: () => void;
}

export function MachiDetailCard({ machi, onClose }: MachiDetailCardProps) {
  const currentUserId = useCurrentUserId();
  // const { data: visit } = useVisitByMachi(currentUserId || '', machi.id); // TODO: 将来使用予定

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
      <View className="px-4 py-4">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {machi.name}
            </Text>
            <Text className="text-sm text-gray-600">{machi.lines || ''}</Text>
          </View>
          <Pressable
            onPress={onClose}
            className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* 位置情報 */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-1">
            緯度: {machi.latitude.toFixed(4)}, 経度:{' '}
            {machi.longitude.toFixed(4)}
          </Text>
        </View>

        {/* 訪問記録（ログイン時のみ） */}
        {currentUserId && (
          <View className="mb-3">
            <MachiVisitInfo userId={currentUserId} machiId={machi.id} />
          </View>
        )}

        {/* スポットリスト（将来実装予定） */}
        {/* TODO: マップとスポットの関係を実装後に有効化 */}
        {/* {currentUserId && visit && (
          <View className="mb-3">
            <MachiSpotList mapId={???} />
          </View>
        )} */}

        {/* アクションボタン（将来実装予定） */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            詳細ページや訪問記録追加機能は今後実装予定です
          </Text>
        </View>
      </View>
    </View>
  );
}
