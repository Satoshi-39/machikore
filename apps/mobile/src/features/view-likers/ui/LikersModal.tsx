/**
 * いいねしたユーザー一覧モーダル
 * マップといいねスポット両方に対応
 * Modal + @gorhom/bottom-sheetの組み合わせで実装
 */

import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useMapLikers, useSpotLikers } from '@/entities/like';
import { UserAvatar } from '@/shared/ui';

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
      className="flex-row items-center py-3 px-4 border-b border-outline-variant"
    >
      <UserAvatar
        url={user.avatar_url}
        alt={user.display_name || user.username || 'User'}
        className="w-10 h-10 mr-3"
        iconSize={iconSizeNum.md}
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-on-surface">
          {user.display_name || user.username}
        </Text>
        <Text className="text-sm text-on-surface-variant">
          @{user.username}
        </Text>
      </View>
    </Pressable>
  );
}

export function LikersModal({ visible, mapId, spotId, onClose, onUserPress }: LikersModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isDarkMode = useIsDarkMode();

  const { data: mapLikers, isLoading: isLoadingMap } = useMapLikers(visible && mapId ? mapId : null);
  const { data: spotLikers, isLoading: isLoadingSpot } = useSpotLikers(visible && spotId ? spotId : null);

  const likers = mapId ? mapLikers : spotLikers;
  const isLoading = mapId ? isLoadingMap : isLoadingSpot;

  // 画面の75%の高さをスナップポイントとして設定（コメントモーダルと統一）
  const snapPoints = useMemo(() => ['75%'], []);

  // シート変更時のハンドラー（閉じた時）
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // ユーザータップ時
  const handleUserPress = useCallback((userId: string) => {
    bottomSheetRef.current?.close();
    setTimeout(() => onUserPress?.(userId), 300);
  }, [onUserPress]);

  // 背景のレンダリング
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: isDarkMode ? colors.dark['surface-variant'] : colors.light.surface }}
          handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"] }}
        >
          {/* ヘッダー */}
          <View className="items-center pb-3 border-b border-outline">
            <Text className="text-base font-bold text-on-surface">
              いいねしたユーザー
            </Text>
          </View>

          {/* コンテンツ */}
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" className="text-primary" />
            </View>
          ) : likers && likers.length > 0 ? (
            <BottomSheetFlatList
              data={likers}
              keyExtractor={(item: typeof likers[number]) => item.likeId}
              renderItem={({ item }: { item: typeof likers[number] }) => (
                <UserItem
                  user={item.user}
                  onPress={() => handleUserPress(item.user.id)}
                />
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="heart-outline" size={iconSizeNum['3xl']} className="text-gray-400" />
              <Text className="text-base text-on-surface-variant mt-2">
                まだいいねがありません
              </Text>
            </View>
          )}
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
