/**
 * translate.ts のテスト
 *
 * DBデータの多言語翻訳ヘルパーのテスト
 */

import {
  getTranslatedName,
  getTranslatedFields,
  getTranslatedGeoData,
  type TranslationsData,
} from '../translate';

describe('translate', () => {
  describe('getTranslatedName', () => {
    describe('日本語ロケールの場合', () => {
      it('デフォルト名をそのまま返す', () => {
        const result = getTranslatedName(
          '渋谷',
          { en: 'Shibuya', cn: '涩谷' },
          'ja'
        );
        expect(result).toBe('渋谷');
      });

      it('翻訳データがnullでもデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', null, 'ja');
        expect(result).toBe('渋谷');
      });
    });

    describe('英語ロケールの場合', () => {
      it('英語翻訳を返す', () => {
        const result = getTranslatedName(
          '渋谷',
          { en: 'Shibuya', cn: '涩谷' },
          'en'
        );
        expect(result).toBe('Shibuya');
      });

      it('英語翻訳がなければデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', { cn: '涩谷' }, 'en');
        expect(result).toBe('渋谷');
      });
    });

    describe('中国語（簡体字）ロケールの場合', () => {
      it('中国語翻訳を返す', () => {
        const result = getTranslatedName(
          '渋谷',
          { en: 'Shibuya', cn: '涩谷' },
          'cn'
        );
        expect(result).toBe('涩谷');
      });

      it('中国語がなければ英語にフォールバック', () => {
        const result = getTranslatedName('渋谷', { en: 'Shibuya' }, 'cn');
        expect(result).toBe('Shibuya');
      });

      it('中国語も英語もなければデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', { tw: '澀谷' }, 'cn');
        expect(result).toBe('渋谷');
      });
    });

    describe('台湾語（繁体字）ロケールの場合', () => {
      it('台湾語翻訳を返す', () => {
        const result = getTranslatedName(
          '渋谷',
          { en: 'Shibuya', tw: '澀谷' },
          'tw'
        );
        expect(result).toBe('澀谷');
      });

      it('台湾語がなければ英語にフォールバック', () => {
        const result = getTranslatedName('渋谷', { en: 'Shibuya' }, 'tw');
        expect(result).toBe('Shibuya');
      });
    });

    describe('翻訳データが文字列（JSON）の場合', () => {
      it('JSONをパースして翻訳を返す', () => {
        const result = getTranslatedName(
          '渋谷',
          '{"en": "Shibuya", "cn": "涩谷"}',
          'en'
        );
        expect(result).toBe('Shibuya');
      });

      it('不正なJSONの場合はデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', 'invalid json', 'en');
        expect(result).toBe('渋谷');
      });

      it('空のJSON文字列の場合はデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', '{}', 'en');
        expect(result).toBe('渋谷');
      });

      it('nullのJSON文字列の場合はデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', 'null', 'en');
        expect(result).toBe('渋谷');
      });
    });

    describe('エッジケース', () => {
      it('翻訳データがnullの場合はデフォルト名を返す', () => {
        const result = getTranslatedName('渋谷', null, 'en');
        expect(result).toBe('渋谷');
      });

      it('翻訳が空文字列の場合はフォールバック', () => {
        const result = getTranslatedName('渋谷', { en: '' }, 'en');
        expect(result).toBe('渋谷');
      });

      it('undefinedの翻訳値はフォールバック', () => {
        const translations: TranslationsData = { en: undefined };
        const result = getTranslatedName('渋谷', translations, 'en');
        expect(result).toBe('渋谷');
      });
    });
  });

  describe('getTranslatedFields', () => {
    it('複数フィールドを一括翻訳する', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
        prefecture_name: '東京都',
        prefecture_name_translations: { en: 'Tokyo' },
      };

      const result = getTranslatedFields(
        data,
        {
          name: 'name_translations',
          prefecture_name: 'prefecture_name_translations',
        },
        'en'
      );

      expect(result.name).toBe('Shibuya');
      expect(result.prefecture_name).toBe('Tokyo');
    });

    it('翻訳データがないフィールドはデフォルト名を使用', () => {
      const data = {
        name: '渋谷',
        name_translations: null,
        description: '説明文',
        description_translations: null,
      };

      const result = getTranslatedFields(
        data,
        {
          name: 'name_translations',
          description: 'description_translations',
        },
        'en'
      );

      expect(result.name).toBe('渋谷');
      expect(result.description).toBe('説明文');
    });

    it('日本語ロケールではデフォルト名を返す', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
      };

      const result = getTranslatedFields(
        data,
        { name: 'name_translations' },
        'ja'
      );

      expect(result.name).toBe('渋谷');
    });

    it('デフォルト値が文字列でない場合はスキップ', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
        count: 123,
        count_translations: null,
      };

      const result = getTranslatedFields(
        data,
        {
          name: 'name_translations',
          count: 'count_translations',
        } as any,
        'en'
      );

      expect(result.name).toBe('Shibuya');
      expect(result.count).toBeUndefined();
    });
  });

  describe('getTranslatedGeoData', () => {
    it('地理データの全フィールドを翻訳する', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
        prefecture_name: '東京都',
        prefecture_name_translations: { en: 'Tokyo' },
        city_name: '渋谷区',
        city_name_translations: { en: 'Shibuya City' },
      };

      const result = getTranslatedGeoData(data, 'en');

      expect(result.name).toBe('Shibuya');
      expect(result.prefectureName).toBe('Tokyo');
      expect(result.cityName).toBe('Shibuya City');
    });

    it('prefecture_nameがない場合はundefined', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
      };

      const result = getTranslatedGeoData(data, 'en');

      expect(result.name).toBe('Shibuya');
      expect(result.prefectureName).toBeUndefined();
      expect(result.cityName).toBeUndefined();
    });

    it('city_nameがない場合はundefined', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
        prefecture_name: '東京都',
        prefecture_name_translations: { en: 'Tokyo' },
      };

      const result = getTranslatedGeoData(data, 'en');

      expect(result.name).toBe('Shibuya');
      expect(result.prefectureName).toBe('Tokyo');
      expect(result.cityName).toBeUndefined();
    });

    it('日本語ロケールではデフォルト名を返す', () => {
      const data = {
        name: '渋谷',
        name_translations: { en: 'Shibuya' },
        prefecture_name: '東京都',
        prefecture_name_translations: { en: 'Tokyo' },
        city_name: '渋谷区',
        city_name_translations: { en: 'Shibuya City' },
      };

      const result = getTranslatedGeoData(data, 'ja');

      expect(result.name).toBe('渋谷');
      expect(result.prefectureName).toBe('東京都');
      expect(result.cityName).toBe('渋谷区');
    });

    it('翻訳データがundefinedでも動作する', () => {
      const data = {
        name: '渋谷',
        prefecture_name: '東京都',
        city_name: '渋谷区',
      };

      const result = getTranslatedGeoData(data, 'en');

      expect(result.name).toBe('渋谷');
      expect(result.prefectureName).toBe('東京都');
      expect(result.cityName).toBe('渋谷区');
    });
  });
});
