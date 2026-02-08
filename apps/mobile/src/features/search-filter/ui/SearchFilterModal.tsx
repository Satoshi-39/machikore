/**
 * 検索フィルターモーダル
 *
 * フィルターボタンを押した時に表示されるボトムシートスタイルのモーダル
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, iconSizeNum } from '@/shared/config';
import { usePrefectures } from '@/entities/prefecture';
import { useI18n } from '@/shared/lib/i18n';
import type { CityRow } from '@/shared/types/database.types';
import type { DateRange, SortBy } from '@/shared/api/supabase';
import { DATE_RANGE_OPTIONS, SORT_BY_OPTIONS, type SearchFilters } from '../model';

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  cities: CityRow[];
  citiesLoading: boolean;
  onPrefectureChange: (id: string | null, name: string | null) => void;
  onCityChange: (id: string | null, name: string | null) => void;
  onDateRangeChange: (dateRange: DateRange) => void;
  onSortByChange: (sortBy: SortBy) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

type SelectionType = 'prefecture' | 'city' | 'dateRange' | 'sortBy' | null;

export function SearchFilterModal({
  visible,
  onClose,
  filters,
  cities,
  citiesLoading,
  onPrefectureChange,
  onCityChange,
  onDateRangeChange,
  onSortByChange,
  onReset,
  hasActiveFilters,
}: SearchFilterModalProps) {
  const insets = useSafeAreaInsets();
  const [selectionType, setSelectionType] = useState<SelectionType>(null);
  const { t } = useI18n();
  const { data: prefectures = [] } = usePrefectures();

  const closeSelection = () => setSelectionType(null);

  // 現在の期間ラベルを取得
  const dateRangeOpt = DATE_RANGE_OPTIONS.find(
    (opt) => opt.value === filters.dateRange
  );
  const currentDateRangeLabel = dateRangeOpt ? t(dateRangeOpt.labelKey) : t('filter.allPeriods');

  // 現在の並び替えラベルを取得
  const sortByOpt = SORT_BY_OPTIONS.find(
    (opt) => opt.value === filters.sortBy
  );
  const currentSortByLabel = sortByOpt ? t(sortByOpt.labelKey) : t('filter.newest');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end">
        {/* バックドロップ */}
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />

        {/* モーダル本体 */}
        <View
          className="bg-surface rounded-t-2xl"
          style={{ paddingBottom: insets.bottom }}
        >
          {/* ハンドル */}
          <View className="items-center pt-2 pb-1">
            <View className="w-10 h-1 rounded-full bg-secondary" />
          </View>

          {/* ヘッダー */}
          <View className="flex-row items-center justify-between px-4 pb-3 border-b-thin border-outline-variant">
            <View className="w-16" />
            <Text className="text-lg font-semibold text-on-surface">
              {t('filter.filter')}
            </Text>
            <View className="w-16 items-end">
              {hasActiveFilters && (
                <Pressable onPress={onReset} hitSlop={8}>
                  <Text className="text-base" style={{ color: colors.light.primary }}>
                    {t('filter.reset')}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* フィルター項目 */}
          <View>
            {/* 都道府県 */}
            <FilterRow
              label={t('filter.prefecture')}
              value={filters.prefectureName || t('common.all')}
              onPress={() => setSelectionType('prefecture')}
            />

            {/* 市区町村（都道府県選択時のみ） */}
            {filters.prefectureId && (
              <FilterRow
                label={t('filter.city')}
                value={filters.cityName || t('common.all')}
                onPress={() => setSelectionType('city')}
                loading={citiesLoading}
              />
            )}

            {/* 期間 */}
            <FilterRow
              label={t('filter.period')}
              value={currentDateRangeLabel}
              onPress={() => setSelectionType('dateRange')}
            />

            {/* 並び替え */}
            <FilterRow
              label={t('filter.sortBy')}
              value={currentSortByLabel}
              onPress={() => setSelectionType('sortBy')}
            />
          </View>

          {/* 適用ボタン */}
          <View className="px-4 py-4">
            <Pressable
              onPress={onClose}
              className="py-3 rounded-lg items-center"
              style={{ backgroundColor: colors.light.primary }}
            >
              <Text className="text-base font-semibold text-white">
                {t('filter.apply')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 都道府県選択モーダル */}
        <SelectionModal
          visible={selectionType === 'prefecture'}
          title={t('filter.selectPrefecture')}
          onClose={closeSelection}
          data={prefectures}
          keyExtractor={(item) => item.id}
          renderItem={(item) => item.name}
          selectedId={filters.prefectureId}
          onSelect={(item) => {
            onPrefectureChange(item?.id || null, item?.name || null);
            closeSelection();
          }}
          showAllOption
          allOptionLabel={t('filter.allPrefectures')}
        />

        {/* 市区町村選択モーダル */}
        <SelectionModal
          visible={selectionType === 'city'}
          title={t('filter.selectCity')}
          onClose={closeSelection}
          data={cities}
          keyExtractor={(item) => item.id}
          renderItem={(item) => item.name}
          selectedId={filters.cityId}
          onSelect={(item) => {
            onCityChange(item?.id || null, item?.name || null);
            closeSelection();
          }}
          showAllOption
          allOptionLabel={t('filter.allCities')}
          loading={citiesLoading}
        />

        {/* 期間選択モーダル */}
        <SelectionModal
          visible={selectionType === 'dateRange'}
          title={t('filter.selectPeriod')}
          onClose={closeSelection}
          data={DATE_RANGE_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={(item) => t(item.labelKey)}
          selectedId={filters.dateRange}
          onSelect={(item) => {
            if (item) onDateRangeChange(item.value);
            closeSelection();
          }}
        />

        {/* 並び替え選択モーダル */}
        <SelectionModal
          visible={selectionType === 'sortBy'}
          title={t('filter.sortBy')}
          onClose={closeSelection}
          data={SORT_BY_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={(item) => t(item.labelKey)}
          selectedId={filters.sortBy}
          onSelect={(item) => {
            if (item) onSortByChange(item.value);
            closeSelection();
          }}
        />
      </View>
    </Modal>
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
      className="flex-row items-center justify-between px-4 py-4"
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
// 選択モーダル
// ===============================

interface SelectionModalProps<T> {
  visible: boolean;
  title: string;
  onClose: () => void;
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => string;
  selectedId: string | null;
  onSelect: (item: T | null) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  loading?: boolean;
}

function SelectionModal<T>({
  visible,
  title,
  onClose,
  data,
  keyExtractor,
  renderItem,
  selectedId,
  onSelect,
  showAllOption,
  allOptionLabel,
  loading,
}: SelectionModalProps<T>) {
  const { t } = useI18n();
  const resolvedAllOptionLabel = allOptionLabel || t('common.all');
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-surface rounded-t-2xl max-h-[70%]">
          {/* ヘッダー */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline-variant">
            <Text className="text-lg font-semibold text-on-surface">
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={iconSizeNum.lg} className="text-gray-500" />
            </Pressable>
          </View>

          {/* ローディング */}
          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" className="text-primary" />
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              ListHeaderComponent={
                showAllOption ? (
                  <Pressable
                    onPress={() => onSelect(null)}
                    className="flex-row items-center justify-between px-4 py-3 border-b-thin border-outline-variant"
                  >
                    <Text className="text-base text-on-surface">
                      {resolvedAllOptionLabel}
                    </Text>
                    {selectedId === null && (
                      <Ionicons name="checkmark" size={iconSizeNum.md} className="text-primary" />
                    )}
                  </Pressable>
                ) : null
              }
              renderItem={({ item }) => {
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
          )}
        </View>
      </View>
    </Modal>
  );
}
