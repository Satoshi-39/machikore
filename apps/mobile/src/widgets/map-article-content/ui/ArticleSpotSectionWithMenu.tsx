/**
 * 記事スポットセクション（メニュー付き）
 *
 * ArticleSpotSectionにブックマーク・共有・通報メニューを追加したラッパー
 * hookを使用するため別コンポーネントとして分離
 */

import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { shareSpot, showLoginRequiredAlert, createGoogleMapsMenuItem } from '@/shared/lib';
import { type PopupMenuItem } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotBookmarkMenu } from '@/features/spot-bookmark';
import { useSpotDelete } from '@/features/spot-actions';
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

  // 削除（オーナー向け）
  const { handleDelete } = useSpotDelete();

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

  // Google Mapsメニュー項目
  const googleMapsMenuItem = useMemo(() => {
    const lat = spot.master_spot?.latitude ?? spot.latitude ?? 0;
    const lng = spot.master_spot?.longitude ?? spot.longitude ?? 0;
    if (!lat && !lng) return null;
    return createGoogleMapsMenuItem({
      latitude: lat,
      longitude: lng,
      googlePlaceId: spot.master_spot?.google_place_id,
      label: t('common.google'),
    });
  }, [spot, t]);

  // 非オーナー用メニュー（オーナーの場合は編集のみ、ArticleSpotSection内で追加される）
  const menuItems: PopupMenuItem[] = useMemo(() => {
    const items: PopupMenuItem[] = [];
    if (isOwner) {
      items.push({
        id: 'delete',
        label: t('common.delete'),
        icon: 'trash-outline',
        destructive: true,
        onPress: () => handleDelete(spot.id),
      });
      if (googleMapsMenuItem) items.push(googleMapsMenuItem);
      return items;
    }
    items.push(bookmarkMenuItem);
    if (googleMapsMenuItem) items.push(googleMapsMenuItem);
    return [
      ...items,
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
  }, [isOwner, googleMapsMenuItem, handleDelete, spot.id, bookmarkMenuItem, handleShare, handleReport, t]);

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
          onSpotPress={() => onSpotPress(spot.id)}
          onImagePress={onImagePress}
          onEditSpotPress={isOwner && onEditSpotPress ? () => onEditSpotPress(spot.id) : undefined}
        />
      </View>

      {/* ブックマークフォルダ選択モーダル */}
      {bookmarkModalProps && <SelectFolderModal {...bookmarkModalProps} />}
    </>
  );
}
