/**
 * Map階層表示Widget（デフォルトマップ用）
 *
 * ドリルダウン方式で階層を掘り下げる
 * ホーム → 地方 → 都道府県 → 市区町村 → 街
 */

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui';
import {
  HierarchyListItem,
  type HierarchyItem,
  type HierarchyLevel,
} from './HierarchyListItem';
import { MachiCard } from '@/entities/machi';
import { useMapHierarchy } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';

export function MapHierarchy() {
  const router = useRouter();
  const [level, setLevel] = useState<HierarchyLevel>('home');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // データベースから階層データを取得
  const { data: hierarchyData, isLoading, error } = useMapHierarchy();

  // 現在表示するデータを取得（useMemoでパフォーマンス最適化）
  const getCurrentData = useMemo((): HierarchyItem[] => {
    if (!hierarchyData) return [];

    switch (level) {
      case 'home': {
        // 地方一覧を表示（配下の都道府県数をカウント）
        return hierarchyData.map((regionData) => ({
          id: regionData.region,
          name: regionData.region,
          count: regionData.prefectures.length,
        }));
      }
      case 'region': {
        // 選択された地方の都道府県一覧（配下の市区町村数をカウント）
        if (!selectedRegion) return [];
        const regionData = hierarchyData.find((r) => r.region === selectedRegion);
        if (!regionData) return [];

        return regionData.prefectures.map((prefData) => ({
          id: prefData.prefecture.id,
          name: prefData.prefecture.name,
          count: prefData.cities.length,
        }));
      }
      case 'prefecture': {
        // 選択された都道府県の市区町村一覧（配下の街数をカウント）
        if (!selectedRegion || !selectedPrefecture) return [];
        const regionData = hierarchyData.find((r) => r.region === selectedRegion);
        if (!regionData) return [];

        const prefData = regionData.prefectures.find(
          (p) => p.prefecture.id === selectedPrefecture
        );
        if (!prefData) return [];

        return prefData.cities.map((cityData) => ({
          id: cityData.city.id,
          name: cityData.city.name,
          count: cityData.machis.length,
        }));
      }
      case 'city': {
        // 選択された市区町村の街一覧
        if (!selectedRegion || !selectedPrefecture || !selectedCity) return [];
        const regionData = hierarchyData.find((r) => r.region === selectedRegion);
        if (!regionData) return [];

        const prefData = regionData.prefectures.find(
          (p) => p.prefecture.id === selectedPrefecture
        );
        if (!prefData) return [];

        const cityData = prefData.cities.find((c) => c.city.id === selectedCity);
        if (!cityData) return [];

        return cityData.machis.map((machi) => ({
          id: machi.id,
          name: machi.name,
          machi: machi, // MachiCardで使用する完全なデータ
        }));
      }
      default:
        return [];
    }
  }, [level, selectedRegion, selectedPrefecture, selectedCity, hierarchyData]);

  // パンくずリストを生成
  const getBreadcrumbs = useMemo((): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'ホーム',
        onPress: () => {
          setLevel('home');
          setSelectedRegion(null);
          setSelectedPrefecture(null);
          setSelectedCity(null);
        },
      },
    ];

    if (selectedRegion) {
      breadcrumbs.push({
        label: selectedRegion,
        onPress: () => {
          setLevel('region');
          setSelectedPrefecture(null);
          setSelectedCity(null);
        },
      });
    }

    if (selectedPrefecture && hierarchyData) {
      const regionData = hierarchyData.find((r) => r.region === selectedRegion);
      const prefData = regionData?.prefectures.find(
        (p) => p.prefecture.id === selectedPrefecture
      );
      if (prefData) {
        breadcrumbs.push({
          label: prefData.prefecture.name,
          onPress: () => {
            setLevel('prefecture');
            setSelectedCity(null);
          },
        });
      }
    }

    if (selectedCity && hierarchyData) {
      const regionData = hierarchyData.find((r) => r.region === selectedRegion);
      const prefData = regionData?.prefectures.find(
        (p) => p.prefecture.id === selectedPrefecture
      );
      const cityData = prefData?.cities.find((c) => c.city.id === selectedCity);
      if (cityData) {
        breadcrumbs.push({
          label: cityData.city.name,
        });
      }
    }

    return breadcrumbs;
  }, [selectedRegion, selectedPrefecture, selectedCity, hierarchyData]);

  // アイテムを選択した時の処理
  const handleItemPress = (item: HierarchyItem) => {
    switch (level) {
      case 'home':
        setSelectedRegion(item.id);
        setLevel('region');
        break;
      case 'region':
        setSelectedPrefecture(item.id);
        setLevel('prefecture');
        break;
      case 'prefecture':
        setSelectedCity(item.id);
        setLevel('city');
        break;
      case 'city':
        // 街が選択された（最下層） - 街詳細ページに遷移
        router.push(`/machi/${item.id}`);
        break;
    }
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={hierarchyData}
      loadingMessage="階層データを読み込み中..."
      emptyMessage="データがありません"
    >
      {() => (
        <FlatList
          data={getCurrentData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            level !== 'home' ? (
              <View className="bg-white border-b border-gray-200 px-5 py-3">
                <Breadcrumb items={getBreadcrumbs} />
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            // 街レベルの場合はMachiCardを使用
            if (level === 'city' && item.machi) {
              return (
                <View className="px-4">
                  <MachiCard
                    machi={item.machi}
                    onPress={() => router.push(`/machi/${item.machi!.id}`)}
                  />
                </View>
              );
            }
            // それ以外の階層はHierarchyListItemを使用
            return <HierarchyListItem item={item} level={level} onPress={handleItemPress} />;
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500">データがありません</Text>
            </View>
          }
        />
      )}
    </AsyncBoundary>
  );
}
