/**
 * 記事スポットセクション（メニュー付き）
 *
 * ArticleSpotSectionにブックマーク・共有・通報メニューを追加したラッパー
 * hookを使用するため別コンポーネントとして分離
 */

import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { shareSpot, showLoginRequiredAlert } from '@/shared/lib';
import { type PopupMenuItem } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotBookmarkMenu } from '@/features/spot-bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';
import type { SpotWithImages } from '@/shared/types';
import { ArticleSpotSection } from './ArticleSpotSection';

interface ArticleSpotSectionWithMenuProps {
  spot: SpotWithImages;
  index: number;
  isOwner: boolean;
  currentUserId: string | null;
  /** マップ所有者のusername（共有URL用） */
  mapOwnerUsername?: string;
  onSpotPress: (spotId: string) => void;
  onImagePress?: (imageUrls: string[], index: number) => void;
  onEditSpotPress?: (spotId: string) => void;
  onLayout?: (spotId: string, y: number) => void;
}

export function ArticleSpotSectionWithMenu({
  spot,
  index,
  isOwner,
  currentUserId,
  mapOwnerUsername,
  onSpotPress,
  onImagePress,
  onEditSpotPress,
  onLayout,
}: ArticleSpotSectionWithMenuProps) {
  const { t } = useI18n();
  const router = useRouter();

  // ブックマーク機能（hookで一元管理）
  const { menuItem: bookmarkMenuItem, modalProps: bookmarkModalProps } = useSpotBookmarkMenu({
    spotId: spot.id,
    currentUserId,
  });

  // 共有
  const handleShare = useCallback(async () => {
    await shareSpot(mapOwnerUsername || '', spot.map_id, spot.id);
  }, [mapOwnerUsername, spot.map_id, spot.id]);

  // 通報
  const handleReport = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(t('menu.report'));
      return;
    }
    router.push(`/report?targetType=spot&targetId=${spot.id}`);
  }, [router, spot.id, currentUserId, t]);

  // 非オーナー用メニュー（オーナーの場合は編集のみ、ArticleSpotSection内で追加される）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (isOwner) return [];
    return [
      bookmarkMenuItem,
      {
        id: 'share',
        label: t('common.share'),
        icon: 'share-outline',
        onPress: handleShare,
      },
      {
        id: 'report',
        label: t('menu.report'),
        icon: 'flag-outline',
        onPress: handleReport,
      },
    ];
  }, [isOwner, bookmarkMenuItem, handleShare, handleReport, t]);

  return (
    <>
      <View
        onLayout={onLayout ? (e) => onLayout(spot.id, e.nativeEvent.layout.y) : undefined}
      >
        <ArticleSpotSection
          spot={spot}
          index={index + 1}
          isOwner={isOwner}
          menuItems={menuItems}
          onPress={() => onSpotPress(spot.id)}
          onImagePress={onImagePress}
          onEditSpotPress={isOwner && onEditSpotPress ? () => onEditSpotPress(spot.id) : undefined}
        />
      </View>

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
    </>
  );
}
