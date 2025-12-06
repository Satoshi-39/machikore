/**
 * いいねしたユーザー一覧モーダル
 * マップといいねスポット両方に対応
 */

import React from 'react';
import { View, Text, Pressable, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useMapLikers, useSpotLikers } from '@/entities/like';
import { BottomSheet, useBottomSheet } from '@/widgets/bottom-sheet';

interface LikersModalProps {
  visible: boolean;
  mapId?: string | null;
  spotId?: string | null;
  onClose: () => void;
  onUserPress?: (userId: string) => void;
}

interface UserItemProps {
  user: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  onPress?: () => void;
}

function UserItem({ user, onPress }: UserItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 px-4 border-b border-border-light dark:border-dark-border-light"
    >
      {user.avatar_url ? (
        <Image
          source={{ uri: user.avatar_url }}
          className="w-10 h-10 rounded-full mr-3"
        />
      ) : (
        <View className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mr-3">
          <Ionicons name="person" size={20} color={colors.gray[500]} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
          {user.display_name || user.username}
        </Text>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
          @{user.username}
        </Text>
      </View>
    </Pressable>
  );
}

interface LikersContentProps {
  mapId?: string | null;
  spotId?: string | null;
  onUserPress?: (userId: string) => void;
}

function LikersContent({ mapId, spotId, onUserPress }: LikersContentProps) {
  const { close } = useBottomSheet();
  const { data: mapLikers, isLoading: isLoadingMap } = useMapLikers(mapId ?? null);
  const { data: spotLikers, isLoading: isLoadingSpot } = useSpotLikers(spotId ?? null);

  const likers = mapId ? mapLikers : spotLikers;
  const isLoading = mapId ? isLoadingMap : isLoadingSpot;
  const screenHeight = Dimensions.get('window').height;
  const sheetHeight = screenHeight * 0.6; // 画面の60%

  const handleUserPress = (userId: string) => {
    close();
    setTimeout(() => onUserPress?.(userId), 300);
  };

  return (
    <View className="bg-surface dark:bg-dark-surface rounded-t-3xl shadow-2xl" style={{ height: sheetHeight }}>
      {/* ドラッグハンドルバー */}
      <View className="items-center pt-3 pb-2">
        <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
      </View>

      {/* ヘッダー */}
      <View className="items-center pb-3 border-b border-border dark:border-dark-border">
        <Text className="text-base font-bold text-foreground dark:text-dark-foreground">
          いいねしたユーザー
        </Text>
      </View>

      {/* コンテンツ */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      ) : likers && likers.length > 0 ? (
        <FlatList
          data={likers}
          keyExtractor={(item) => item.likeId}
          renderItem={({ item }) => (
            <UserItem
              user={item.user}
              onPress={() => handleUserPress(item.user.id)}
            />
          )}
          className="flex-1"
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="heart-outline" size={48} color={colors.gray[400]} />
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary mt-2">
            まだいいねがありません
          </Text>
        </View>
      )}
    </View>
  );
}

export function LikersModal({ visible, mapId, spotId, onClose, onUserPress }: LikersModalProps) {
  if (!visible) return null;

  return (
    <BottomSheet onClose={onClose}>
      <LikersContent mapId={mapId} spotId={spotId} onUserPress={onUserPress} />
    </BottomSheet>
  );
}
