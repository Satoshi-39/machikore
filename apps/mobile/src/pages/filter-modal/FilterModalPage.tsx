/**
 * フィルターモーダル画面
 *
 * BottomSheetで表示され、横スライドで各フィルター設定画面に遷移
 */

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useCountries } from '@/entities/country';
import { SlideContainer } from '@/widgets/comment';
import {
  useSearchFilters,
  DATE_RANGE_OPTIONS,
  SORT_BY_OPTIONS,
} from '@/features/search-filter';

interface FilterModalPageProps {
  onClose: () => void;
}

type DetailView = 'country' | 'prefecture' | 'city' | 'dateRange' | 'sortBy' | null;

export function FilterModalPage({ onClose }: FilterModalPageProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isDarkMode = useIsDarkMode();
  const [detailView, setDetailView] = useState<DetailView>(null);
  const { data: countries = [] } = useCountries();

  // フィルター状態（Zustandストアから取得）
  const {
    draftFilters,
    setCountry,
    setPrefecture,
    setCity,
    setDateRange,
    setSortBy,
    resetDraftFilters,
    applyFilters,
    initDraftFromApplied,
    prefectures,
    prefecturesLoading,
    cities,
    citiesLoading,
  } = useSearchFilters();

  // モーダルを開いた時に適用済みフィルターをdraftにコピー
  useEffect(() => {
    initDraftFromApplied();
  }, [initDraftFromApplied]);

  // draftFiltersが有効かどうか（リセットボタン表示用）
  const hasDraftFilters = !!(
    draftFilters.countryId ||
    draftFilters.prefectureId ||
    draftFilters.cityId ||
    draftFilters.dateRange !== 'all'
  );

  // スナップポイント: 50%
  const snapPoints = useMemo(() => ['50%'], []);

  // 現在の期間ラベルを取得
  const currentDateRangeLabel = DATE_RANGE_OPTIONS.find(
    (opt) => opt.value === draftFilters.dateRange
  )?.label || 'すべての期間';

  // 現在の並び替えラベルを取得
  const currentSortByLabel = SORT_BY_OPTIONS.find(
    (opt) => opt.value === draftFilters.sortBy
  )?.label || '新着順';

  // BottomSheetの変更ハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // バックドロップレンダラー
  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
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

  // 詳細ビューから戻る
  const handleBack = useCallback(() => {
    setDetailView(null);
  }, []);

  // 閉じる
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // メインビュー（フィルター一覧）
  const renderMainView = () => (
    <View className="flex-1">
      <BottomSheetScrollView>
        {/* 国 */}
        <FilterRow
          label="国"
          value={draftFilters.countryName || 'すべて'}
          onPress={() => setDetailView('country')}
        />

        {/* 都道府県（国選択時のみ） */}
        {draftFilters.countryId && (
          <FilterRow
            label="都道府県"
            value={draftFilters.prefectureName || 'すべて'}
            onPress={() => setDetailView('prefecture')}
            loading={prefecturesLoading}
          />
        )}

        {/* 市区町村（都道府県選択時のみ） */}
        {draftFilters.prefectureId && (
          <FilterRow
            label="市区町村"
            value={draftFilters.cityName || 'すべて'}
            onPress={() => setDetailView('city')}
            loading={citiesLoading}
          />
        )}

        {/* 期間 */}
        <FilterRow
          label="期間"
          value={currentDateRangeLabel}
          onPress={() => setDetailView('dateRange')}
        />

        {/* 並び替え */}
        <FilterRow
          label="並び替え"
          value={currentSortByLabel}
          onPress={() => setDetailView('sortBy')}
        />
      </BottomSheetScrollView>

      {/* 適用ボタン */}
      <View className="px-4 pt-4 pb-8">
        <Pressable
          onPress={() => {
            applyFilters();
            handleClose();
          }}
          className="py-3 rounded-lg items-center"
          style={{ backgroundColor: colors.light.primary }}
        >
          <Text className="text-base font-semibold text-white">
            適用する
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // 詳細ビュー（選択リスト）
  const renderDetailView = () => {
    if (detailView === 'country') {
      return (
        <SelectionList
          data={countries}
          keyExtractor={(item) => item.id}
          renderItem={(item) => item.name}
          selectedId={draftFilters.countryId}
          onSelect={(item) => {
            setCountry(item?.id || null, item?.name || null);
            handleBack();
          }}
          showAllOption
          allOptionLabel="すべての国"
        />
      );
    }

    if (detailView === 'prefecture') {
      if (prefecturesLoading) {
        return (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        );
      }
      return (
        <SelectionList
          data={prefectures}
          keyExtractor={(item) => item.id}
          renderItem={(item) => item.name}
          selectedId={draftFilters.prefectureId}
          onSelect={(item) => {
            setPrefecture(item?.id || null, item?.name || null);
            handleBack();
          }}
          showAllOption
          allOptionLabel="すべての都道府県"
        />
      );
    }

    if (detailView === 'city') {
      if (citiesLoading) {
        return (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        );
      }
      return (
        <SelectionList
          data={cities}
          keyExtractor={(item) => item.id}
          renderItem={(item) => item.name}
          selectedId={draftFilters.cityId}
          onSelect={(item) => {
            setCity(item?.id || null, item?.name || null);
            handleBack();
          }}
          showAllOption
          allOptionLabel="すべての市区町村"
        />
      );
    }

    if (detailView === 'dateRange') {
      return (
        <SelectionList
          data={DATE_RANGE_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={(item) => item.label}
          selectedId={draftFilters.dateRange}
          onSelect={(item) => {
            if (item) setDateRange(item.value);
            handleBack();
          }}
        />
      );
    }

    if (detailView === 'sortBy') {
      return (
        <SelectionList
          data={SORT_BY_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={(item) => item.label}
          selectedId={draftFilters.sortBy}
          onSelect={(item) => {
            if (item) setSortBy(item.value);
            handleBack();
          }}
        />
      );
    }

    return null;
  };

  // ヘッダータイトル
  const getHeaderTitle = () => {
    switch (detailView) {
      case 'country':
        return '国';
      case 'prefecture':
        return '都道府県';
      case 'city':
        return '市区町村';
      case 'dateRange':
        return '期間';
      case 'sortBy':
        return '並び替え';
      default:
        return 'フィルター';
    }
  };

  return (
    <View className="flex-1 bg-transparent">
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.primitive.gray[400] }}
        backgroundStyle={{
          backgroundColor: isDarkMode ? colors.dark['surface-variant'] : colors.light.surface,
        }}
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 pb-3 border-b-thin border-outline">
          {/* 左側：戻るボタン または リセットボタン */}
          <View className="w-16 items-start">
            {detailView ? (
              <Pressable
                onPress={handleBack}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons
                  name="chevron-back"
                  size={iconSizeNum.lg}
                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
                />
              </Pressable>
            ) : hasDraftFilters ? (
              <Pressable onPress={resetDraftFilters} hitSlop={8}>
                <Text className="text-base" style={{ color: colors.light.primary }}>
                  リセット
                </Text>
              </Pressable>
            ) : (
              <View className="w-8" />
            )}
          </View>
          {/* 中央：タイトル */}
          <Text className="flex-1 text-center text-lg font-semibold text-on-surface">
            {getHeaderTitle()}
          </Text>
          {/* 右側：閉じるボタン */}
          <View className="w-16 items-end">
            {!detailView ? (
              <Pressable
                onPress={handleClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
              >
                <Ionicons name="close" size={iconSizeNum.md} className="text-on-surface-variant" />
              </Pressable>
            ) : (
              <View className="w-8" />
            )}
          </View>
        </View>

        {/* コンテンツ（横スライド） */}
        <SlideContainer
          showDetail={!!detailView}
          mainView={renderMainView()}
          detailView={renderDetailView()}
        />
      </BottomSheet>
    </View>
  );
}

// ===============================
// フィルター行
// ===============================

interface FilterRowProps {
  label: string;
  value: string;
  onPress: () => void;
  loading?: boolean;
}

function FilterRow({ label, value, onPress, loading }: FilterRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="flex-row items-center justify-between px-4 py-4 border-b-thin border-outline-variant"
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      <Text className="text-base text-on-surface">
        {label}
      </Text>
      <View className="flex-row items-center">
        {loading ? (
          <ActivityIndicator size="small" className="text-primary" />
        ) : (
          <>
            <Text className="text-base text-on-surface-variant mr-2">
              {value}
            </Text>
            <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-gray-400" />
          </>
        )}
      </View>
    </Pressable>
  );
}

// ===============================
// 選択リスト
// ===============================

interface SelectionListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => string;
  selectedId: string | null;
  onSelect: (item: T | null) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

function SelectionList<T>({
  data,
  keyExtractor,
  renderItem,
  selectedId,
  onSelect,
  showAllOption,
  allOptionLabel = 'すべて',
}: SelectionListProps<T>) {
  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        showAllOption ? (
          <Pressable
            onPress={() => onSelect(null)}
            className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline-variant"
          >
            <Text className="text-base text-on-surface">
              {allOptionLabel}
            </Text>
            {selectedId === null && (
              <Ionicons name="checkmark" size={iconSizeNum.md} className="text-primary" />
            )}
          </Pressable>
        ) : null
      }
      renderItem={({ item }: { item: T }) => {
        const id = keyExtractor(item);
        const isSelected = id === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(item)}
            className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline-variant"
          >
            <Text className="text-base text-on-surface">
              {renderItem(item)}
            </Text>
            {isSelected && (
              <Ionicons name="checkmark" size={iconSizeNum.md} className="text-primary" />
            )}
          </Pressable>
        );
      }}
    />
  );
}
