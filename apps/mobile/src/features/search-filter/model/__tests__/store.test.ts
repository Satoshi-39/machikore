/**
 * 検索フィルターストアのテスト
 *
 * カスケードリセット（国→都道府県→市区町村の連動リセット）と
 * draft/applied フィルターの状態管理をテスト
 */

import { useSearchFiltersStore } from '../store';
import { DEFAULT_SEARCH_FILTERS } from '../types';

// テスト前にストアをリセット
beforeEach(() => {
  useSearchFiltersStore.setState({
    draftFilters: { ...DEFAULT_SEARCH_FILTERS },
    appliedFilters: { ...DEFAULT_SEARCH_FILTERS },
  });
});

describe('カスケードリセット', () => {
  it('国を変更すると都道府県と市区町村がリセットされる', () => {
    const { setCountry, setPrefecture, setCity } = useSearchFiltersStore.getState();

    // 東京都新宿区を選択
    setCountry('jp', '日本');
    setPrefecture('tokyo', '東京都');
    setCity('shinjuku', '新宿区');

    // 国を韓国に変更
    setCountry('kr', '韓国');

    const { draftFilters } = useSearchFiltersStore.getState();
    expect(draftFilters.countryId).toBe('kr');
    expect(draftFilters.countryName).toBe('韓国');
    expect(draftFilters.prefectureId).toBeNull();
    expect(draftFilters.prefectureName).toBeNull();
    expect(draftFilters.cityId).toBeNull();
    expect(draftFilters.cityName).toBeNull();
  });

  it('都道府県を変更すると市区町村がリセットされる', () => {
    const { setCountry, setPrefecture, setCity } = useSearchFiltersStore.getState();

    setCountry('jp', '日本');
    setPrefecture('tokyo', '東京都');
    setCity('shinjuku', '新宿区');

    // 都道府県を大阪に変更
    setPrefecture('osaka', '大阪府');

    const { draftFilters } = useSearchFiltersStore.getState();
    expect(draftFilters.countryId).toBe('jp'); // 国はそのまま
    expect(draftFilters.prefectureId).toBe('osaka');
    expect(draftFilters.cityId).toBeNull(); // 市区町村はリセット
    expect(draftFilters.cityName).toBeNull();
  });

  it('市区町村を変更しても上位はリセットされない', () => {
    const { setCountry, setPrefecture, setCity } = useSearchFiltersStore.getState();

    setCountry('jp', '日本');
    setPrefecture('tokyo', '東京都');
    setCity('shibuya', '渋谷区');

    const { draftFilters } = useSearchFiltersStore.getState();
    expect(draftFilters.countryId).toBe('jp');
    expect(draftFilters.prefectureId).toBe('tokyo');
    expect(draftFilters.cityId).toBe('shibuya');
  });
});

describe('draft/applied フロー', () => {
  it('applyFiltersでdraftがappliedにコピーされる', () => {
    const { setCountry, applyFilters } = useSearchFiltersStore.getState();

    setCountry('jp', '日本');
    applyFilters();

    const { appliedFilters } = useSearchFiltersStore.getState();
    expect(appliedFilters.countryId).toBe('jp');
  });

  it('initDraftFromAppliedでappliedがdraftにコピーされる', () => {
    const store = useSearchFiltersStore.getState();

    // draftを変更して適用
    store.setCountry('jp', '日本');
    store.applyFilters();

    // draftをリセット
    store.resetDraftFilters();
    expect(useSearchFiltersStore.getState().draftFilters.countryId).toBeNull();

    // モーダル再開時にappliedをdraftに復元
    store.initDraftFromApplied();
    expect(useSearchFiltersStore.getState().draftFilters.countryId).toBe('jp');
  });

  it('resetDraftFiltersはappliedに影響しない', () => {
    const store = useSearchFiltersStore.getState();

    store.setCountry('jp', '日本');
    store.applyFilters();
    store.resetDraftFilters();

    const state = useSearchFiltersStore.getState();
    expect(state.draftFilters.countryId).toBeNull();
    expect(state.appliedFilters.countryId).toBe('jp'); // appliedは維持
  });
});
