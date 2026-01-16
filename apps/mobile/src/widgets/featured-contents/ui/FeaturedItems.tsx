/**
 * 特集アイテムカルーセルWidget
 *
 * 発見タブに表示する特集バナーの横スワイプカルーセル
 * 無限ループスクロール対応
 */

import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useFeaturedItems } from '@/entities/featured-contents';
import type { FeaturedItem } from '@/entities/featured-contents/model';
import { colors, FEATURED_CAROUSEL } from '@/shared/config';

// レイアウト定数
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * FEATURED_CAROUSEL.CARD_WIDTH_RATIO;
const CARD_HEIGHT = FEATURED_CAROUSEL.CARD_HEIGHT;
const CARD_GAP = FEATURED_CAROUSEL.CARD_GAP;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

// ページインジケーター
function PageIndicator({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: index === current ? colors.primary.DEFAULT : '#D1D5DB',
          }}
        />
      ))}
    </View>
  );
}

// カルーセルカード
interface CarouselCardProps {
  item: FeaturedItem;
  onPress: () => void;
}

function CarouselCard({ item, onPress }: CarouselCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: CARD_GAP / 2,
      }}
      className="active:opacity-90"
    >
      <View
        className="flex-1 rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {/* バナー画像 */}
        <Image
          source={{ uri: item.image_url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* グラデーションオーバーレイ + テキスト */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 12,
          }}
        >
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-white/80 text-sm mt-1" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </LinearGradient>
      </View>
    </Pressable>
  );
}

// メインコンポーネント
interface FeaturedItemsProps {
  /**
   * カテゴリID
   * - 'all' または undefined: カテゴリ未設定（category_id=null）のアイテムを表示
   * - その他: 指定されたカテゴリのアイテムを表示
   */
  categoryId?: string;
}

export function FeaturedItems({ categoryId }: FeaturedItemsProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: items, isLoading, error } = useFeaturedItems(categoryId);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 無限ループ用：データを3倍に複製（前後に1セットずつ追加）
  const loopedItems = items && items.length > 1
    ? [...items, ...items, ...items]
    : items ?? [];
  const itemCount = items?.length ?? 0;

  // URLかどうかを検証
  const isValidUrl = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // カードタップ時の処理
  const handleCardPress = useCallback(
    (item: FeaturedItem) => {
      switch (item.link_type) {
        case 'magazine':
          // マガジンページに遷移
          if (item.magazine_id) {
            router.push(`/(tabs)/discover/magazines/${item.magazine_id}` as Href);
          }
          break;
        case 'url':
          // 有効なURLの場合のみ開く
          if (item.link_value && isValidUrl(item.link_value)) {
            Linking.openURL(item.link_value);
          }
          break;
      }
    },
    [router]
  );

  // スクロール終了時の処理（無限ループ）
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!items || items.length <= 1) return;

      const offsetX = event.nativeEvent.contentOffset.x;
      const rawIndex = Math.round(offsetX / ITEM_WIDTH);

      // 実際のインデックス（0〜itemCount-1）を計算
      const realIndex = ((rawIndex % itemCount) + itemCount) % itemCount;
      setCurrentIndex(realIndex);

      // 端に到達したら中央セットにジャンプ（アニメーションなし）
      if (rawIndex < itemCount) {
        // 左端に近づいた → 中央セットへ
        scrollViewRef.current?.scrollTo({
          x: (rawIndex + itemCount) * ITEM_WIDTH,
          animated: false,
        });
      } else if (rawIndex >= itemCount * 2) {
        // 右端に近づいた → 中央セットへ
        scrollViewRef.current?.scrollTo({
          x: (rawIndex - itemCount) * ITEM_WIDTH,
          animated: false,
        });
      }
    },
    [items, itemCount]
  );

  // 初期位置を中央セットに設定
  const handleLayout = useCallback(() => {
    if (items && items.length > 1) {
      scrollViewRef.current?.scrollTo({
        x: itemCount * ITEM_WIDTH,
        animated: false,
      });
    }
  }, [items, itemCount]);

  // ローディング中
  if (isLoading) {
    return (
      <View style={{ height: CARD_HEIGHT + 32 }} className="justify-center items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  // エラーまたはデータなし
  if (error || !items || items.length === 0) {
    return null;
  }

  // アイテムが1つの場合は無限ループなし
  if (items.length === 1 && items[0]) {
    const singleItem = items[0];
    return (
      <View className="py-4">
        <View style={{ paddingHorizontal: SIDE_SPACING - CARD_GAP / 2 }}>
          <CarouselCard
            item={singleItem}
            onPress={() => handleCardPress(singleItem)}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="py-4">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onLayout={handleLayout}
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACING - CARD_GAP / 2,
        }}
      >
        {loopedItems.map((item, index) => (
          <CarouselCard
            key={`${item.id}-${index}`}
            item={item}
            onPress={() => handleCardPress(item)}
          />
        ))}
      </ScrollView>
      <PageIndicator total={itemCount} current={currentIndex} />
    </View>
  );
}
