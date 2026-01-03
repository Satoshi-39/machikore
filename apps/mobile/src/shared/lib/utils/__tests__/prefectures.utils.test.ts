/**
 * prefectures.utils.ts のテスト
 */

import {
  getPrefecturesData,
  getPrefecturesByCountry,
  getAvailablePrefectureCountryCodes,
} from '../prefectures.utils';

describe('prefectures.utils', () => {
  describe('getPrefecturesData', () => {
    it('全ての都道府県データを取得する', () => {
      const prefectures = getPrefecturesData();
      expect(prefectures.length).toBeGreaterThan(0);
    });

    it('各都道府県にはidが設定されている', () => {
      const prefectures = getPrefecturesData();
      prefectures.forEach((prefecture) => {
        expect(prefecture.id).toBeDefined();
        expect(typeof prefecture.id).toBe('string');
        expect(prefecture.id.length).toBeGreaterThan(0);
      });
    });

    it('各都道府県にはnameが設定されている', () => {
      const prefectures = getPrefecturesData();
      prefectures.forEach((prefecture) => {
        expect(prefecture.name).toBeDefined();
        expect(typeof prefecture.name).toBe('string');
      });
    });

    it('各都道府県にはregion_idが設定されている', () => {
      const prefectures = getPrefecturesData();
      prefectures.forEach((prefecture) => {
        expect(prefecture.region_id).toBeDefined();
        expect(typeof prefecture.region_id).toBe('string');
      });
    });

    it('各都道府県には緯度・経度が設定されている', () => {
      const prefectures = getPrefecturesData();
      prefectures.forEach((prefecture) => {
        expect(prefecture.latitude).toBeDefined();
        expect(typeof prefecture.latitude).toBe('number');
        expect(prefecture.longitude).toBeDefined();
        expect(typeof prefecture.longitude).toBe('number');
      });
    });

    it('東京都が含まれている', () => {
      const prefectures = getPrefecturesData();
      const tokyo = prefectures.find((p) => p.id === 'jp_tokyo');
      expect(tokyo).toBeDefined();
      expect(tokyo?.name).toBe('東京都');
    });
  });

  describe('getPrefecturesByCountry', () => {
    it('日本の都道府県を取得する', () => {
      const prefectures = getPrefecturesByCountry('jp');
      expect(prefectures.length).toBeGreaterThan(0);
      // 日本の都道府県は47
      expect(prefectures.length).toBe(47);
    });

    it('日本の都道府県IDはjp_で始まる', () => {
      const prefectures = getPrefecturesByCountry('jp');
      prefectures.forEach((prefecture) => {
        expect(prefecture.id).toMatch(/^jp_/);
      });
    });

    it('アメリカの州を取得する', () => {
      const states = getPrefecturesByCountry('us');
      expect(states.length).toBeGreaterThan(0);
    });

    it('アメリカの州IDはus_で始まる', () => {
      const states = getPrefecturesByCountry('us');
      states.forEach((state) => {
        expect(state.id).toMatch(/^us_/);
      });
    });

    it('韓国の道を取得する', () => {
      const provinces = getPrefecturesByCountry('kr');
      expect(provinces.length).toBeGreaterThan(0);
    });

    it('存在しない国コードは空配列を返す', () => {
      const prefectures = getPrefecturesByCountry('invalid_country');
      expect(prefectures).toEqual([]);
    });

    it('空文字列は空配列を返す', () => {
      const prefectures = getPrefecturesByCountry('');
      expect(prefectures).toEqual([]);
    });
  });

  describe('getAvailablePrefectureCountryCodes', () => {
    it('国コードの一覧を取得する', () => {
      const countryCodes = getAvailablePrefectureCountryCodes();
      expect(countryCodes.length).toBeGreaterThan(0);
    });

    it('jpが含まれている', () => {
      const countryCodes = getAvailablePrefectureCountryCodes();
      expect(countryCodes).toContain('jp');
    });

    it('usが含まれている', () => {
      const countryCodes = getAvailablePrefectureCountryCodes();
      expect(countryCodes).toContain('us');
    });

    it('krが含まれている', () => {
      const countryCodes = getAvailablePrefectureCountryCodes();
      expect(countryCodes).toContain('kr');
    });

    it('twが含まれている', () => {
      const countryCodes = getAvailablePrefectureCountryCodes();
      expect(countryCodes).toContain('tw');
    });
  });
});
