/**
 * regions.utils.ts のテスト
 */

import {
  getRegionsData,
  getRegionsByCountry,
  getAvailableRegionCountryCodes,
} from '../regions.utils';

describe('regions.utils', () => {
  describe('getRegionsData', () => {
    it('全ての地方データを取得する', () => {
      const regions = getRegionsData();
      expect(regions.length).toBeGreaterThan(0);
    });

    it('各地方にはidが設定されている', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        expect(region.id).toBeDefined();
        expect(typeof region.id).toBe('string');
        expect(region.id.length).toBeGreaterThan(0);
      });
    });

    it('各地方にはnameが設定されている', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        expect(region.name).toBeDefined();
        expect(typeof region.name).toBe('string');
      });
    });

    it('各地方にはcountry_idが設定されている', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        expect(region.country_id).toBeDefined();
        expect(typeof region.country_id).toBe('string');
      });
    });

    it('各地方には緯度・経度が設定されている', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        expect(region.latitude).toBeDefined();
        expect(typeof region.latitude).toBe('number');
        expect(region.longitude).toBeDefined();
        expect(typeof region.longitude).toBe('number');
      });
    });

    it('各地方にはdisplay_orderが設定されている', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        expect(region.display_order).toBeDefined();
        expect(typeof region.display_order).toBe('number');
      });
    });

    it('関東地方が含まれている', () => {
      const regions = getRegionsData();
      const kanto = regions.find((r) => r.id === 'jp_kanto');
      expect(kanto).toBeDefined();
      expect(kanto?.name).toBe('関東地方');
    });
  });

  describe('getRegionsByCountry', () => {
    it('日本の地方を取得する', () => {
      const regions = getRegionsByCountry('jp');
      expect(regions.length).toBeGreaterThan(0);
    });

    it('日本の地方IDはjp_で始まる', () => {
      const regions = getRegionsByCountry('jp');
      regions.forEach((region) => {
        expect(region.id).toMatch(/^jp_/);
      });
    });

    it('日本の地方のcountry_idはjp', () => {
      const regions = getRegionsByCountry('jp');
      regions.forEach((region) => {
        expect(region.country_id).toBe('jp');
      });
    });

    it('アメリカの地方を取得する', () => {
      const regions = getRegionsByCountry('us');
      expect(regions.length).toBeGreaterThan(0);
    });

    it('アメリカの地方IDはus_で始まる', () => {
      const regions = getRegionsByCountry('us');
      regions.forEach((region) => {
        expect(region.id).toMatch(/^us_/);
      });
    });

    it('存在しない国コードは空配列を返す', () => {
      const regions = getRegionsByCountry('invalid_country');
      expect(regions).toEqual([]);
    });

    it('空文字列は空配列を返す', () => {
      const regions = getRegionsByCountry('');
      expect(regions).toEqual([]);
    });
  });

  describe('getAvailableRegionCountryCodes', () => {
    it('国コードの一覧を取得する', () => {
      const countryCodes = getAvailableRegionCountryCodes();
      expect(countryCodes.length).toBeGreaterThan(0);
    });

    it('jpが含まれている', () => {
      const countryCodes = getAvailableRegionCountryCodes();
      expect(countryCodes).toContain('jp');
    });

    it('usが含まれている', () => {
      const countryCodes = getAvailableRegionCountryCodes();
      expect(countryCodes).toContain('us');
    });

    it('krが含まれている', () => {
      const countryCodes = getAvailableRegionCountryCodes();
      expect(countryCodes).toContain('kr');
    });
  });

  describe('country_idの抽出ロジック', () => {
    it('地方IDから国コードが正しく抽出される', () => {
      const regions = getRegionsData();
      regions.forEach((region) => {
        // idの形式: {country}_{region}
        const expectedCountryId = region.id.split('_')[0];
        expect(region.country_id).toBe(expectedCountryId);
      });
    });
  });
});
