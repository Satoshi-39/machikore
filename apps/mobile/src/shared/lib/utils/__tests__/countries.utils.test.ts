/**
 * countries.utils.ts のテスト
 */

import {
  getCountriesData,
  getCountriesByContinent,
  getCountryByCode,
  getAvailableContinentIds,
  getAvailableCountryCodes,
} from '../countries.utils';

describe('countries.utils', () => {
  describe('getCountriesData', () => {
    it('全ての国データを取得する', () => {
      const countries = getCountriesData();
      expect(countries.length).toBeGreaterThan(0);
    });

    it('各国データにはidが設定されている', () => {
      const countries = getCountriesData();
      countries.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(typeof country.id).toBe('string');
        expect(country.id.length).toBeGreaterThan(0);
      });
    });

    it('各国データにはnameが設定されている', () => {
      const countries = getCountriesData();
      countries.forEach((country) => {
        expect(country.name).toBeDefined();
        expect(typeof country.name).toBe('string');
      });
    });

    it('各国データにはcontinent_idが設定されている', () => {
      const countries = getCountriesData();
      countries.forEach((country) => {
        expect(country.continent_id).toBeDefined();
        expect(typeof country.continent_id).toBe('string');
      });
    });

    it('日本（jp）が含まれている', () => {
      const countries = getCountriesData();
      const japan = countries.find((c) => c.id === 'jp');
      expect(japan).toBeDefined();
      expect(japan?.name).toBe('日本');
    });
  });

  describe('getCountriesByContinent', () => {
    it('東アジアの国を取得する', () => {
      const countries = getCountriesByContinent('east_asia');
      expect(countries.length).toBeGreaterThan(0);
      countries.forEach((country) => {
        expect(country.continent_id).toBe('east_asia');
      });
    });

    it('ヨーロッパの国を取得する', () => {
      const countries = getCountriesByContinent('europe');
      expect(countries.length).toBeGreaterThan(0);
      countries.forEach((country) => {
        expect(country.continent_id).toBe('europe');
      });
    });

    it('存在しない大陸IDは空配列を返す', () => {
      const countries = getCountriesByContinent('invalid_continent');
      expect(countries).toEqual([]);
    });

    it('空文字列は空配列を返す', () => {
      const countries = getCountriesByContinent('');
      expect(countries).toEqual([]);
    });
  });

  describe('getCountryByCode', () => {
    it('日本（jp）を取得する', () => {
      const japan = getCountryByCode('jp');
      expect(japan).toBeDefined();
      expect(japan?.id).toBe('jp');
      expect(japan?.name).toBe('日本');
    });

    it('韓国（kr）を取得する', () => {
      const korea = getCountryByCode('kr');
      expect(korea).toBeDefined();
      expect(korea?.id).toBe('kr');
    });

    it('存在しない国コードはundefinedを返す', () => {
      const country = getCountryByCode('invalid_code');
      expect(country).toBeUndefined();
    });

    it('空文字列はundefinedを返す', () => {
      const country = getCountryByCode('');
      expect(country).toBeUndefined();
    });
  });

  describe('getAvailableContinentIds', () => {
    it('大陸IDの一覧を取得する', () => {
      const continentIds = getAvailableContinentIds();
      expect(continentIds.length).toBeGreaterThan(0);
    });

    it('east_asiaが含まれている', () => {
      const continentIds = getAvailableContinentIds();
      expect(continentIds).toContain('east_asia');
    });

    it('europeが含まれている', () => {
      const continentIds = getAvailableContinentIds();
      expect(continentIds).toContain('europe');
    });

    it('north_americaが含まれている', () => {
      const continentIds = getAvailableContinentIds();
      expect(continentIds).toContain('north_america');
    });
  });

  describe('getAvailableCountryCodes', () => {
    it('国コードの一覧を取得する', () => {
      const countryCodes = getAvailableCountryCodes();
      expect(countryCodes.length).toBeGreaterThan(0);
    });

    it('jpが含まれている', () => {
      const countryCodes = getAvailableCountryCodes();
      expect(countryCodes).toContain('jp');
    });

    it('krが含まれている', () => {
      const countryCodes = getAvailableCountryCodes();
      expect(countryCodes).toContain('kr');
    });

    it('usが含まれている', () => {
      const countryCodes = getAvailableCountryCodes();
      expect(countryCodes).toContain('us');
    });
  });
});
