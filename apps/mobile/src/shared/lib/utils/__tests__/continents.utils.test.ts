/**
 * continents.utils.ts のテスト
 */

import { getContinentsData, getContinentById } from '../continents.utils';

describe('continents.utils', () => {
  describe('getContinentsData', () => {
    it('全ての大陸データを取得する', () => {
      const continents = getContinentsData();
      expect(continents.length).toBeGreaterThan(0);
    });

    it('各大陸にはidが設定されている', () => {
      const continents = getContinentsData();
      continents.forEach((continent) => {
        expect(continent.id).toBeDefined();
        expect(typeof continent.id).toBe('string');
        expect(continent.id.length).toBeGreaterThan(0);
      });
    });

    it('各大陸にはnameが設定されている', () => {
      const continents = getContinentsData();
      continents.forEach((continent) => {
        expect(continent.name).toBeDefined();
        expect(typeof continent.name).toBe('string');
      });
    });

    it('各大陸には緯度・経度が設定されている', () => {
      const continents = getContinentsData();
      continents.forEach((continent) => {
        expect(continent.latitude).toBeDefined();
        expect(typeof continent.latitude).toBe('number');
        expect(continent.longitude).toBeDefined();
        expect(typeof continent.longitude).toBe('number');
      });
    });

    it('各大陸にはdisplay_orderが設定されている', () => {
      const continents = getContinentsData();
      continents.forEach((continent) => {
        expect(continent.display_order).toBeDefined();
        expect(typeof continent.display_order).toBe('number');
      });
    });

    it('東アジアが含まれている', () => {
      const continents = getContinentsData();
      const eastAsia = continents.find((c) => c.id === 'east_asia');
      expect(eastAsia).toBeDefined();
      expect(eastAsia?.name).toBe('東アジア');
    });

    it('ヨーロッパが含まれている', () => {
      const continents = getContinentsData();
      const europe = continents.find((c) => c.id === 'europe');
      expect(europe).toBeDefined();
    });
  });

  describe('getContinentById', () => {
    it('東アジア（east_asia）を取得する', () => {
      const eastAsia = getContinentById('east_asia');
      expect(eastAsia).toBeDefined();
      expect(eastAsia?.id).toBe('east_asia');
      expect(eastAsia?.name).toBe('東アジア');
    });

    it('ヨーロッパ（europe）を取得する', () => {
      const europe = getContinentById('europe');
      expect(europe).toBeDefined();
      expect(europe?.id).toBe('europe');
    });

    it('北米（north_america）を取得する', () => {
      const northAmerica = getContinentById('north_america');
      expect(northAmerica).toBeDefined();
      expect(northAmerica?.id).toBe('north_america');
    });

    it('存在しない大陸IDはundefinedを返す', () => {
      const continent = getContinentById('invalid_continent');
      expect(continent).toBeUndefined();
    });

    it('空文字列はundefinedを返す', () => {
      const continent = getContinentById('');
      expect(continent).toBeUndefined();
    });
  });
});
