/**
 * tile-cache-service.ts の純粋関数テスト
 *
 * データ変換ヘルパー関数のロジックテスト
 * （ファイル内でexportされていないため再定義）
 */

import { parseJsonField } from '@/shared/lib/utils/json.utils';

// jsonify関数の再定義
const jsonify = (value: unknown): string | null =>
  value ? JSON.stringify(value) : null;

// toSQLiteMachi関数の再定義
function toSQLiteMachi(machi: Record<string, unknown>) {
  const now = new Date().toISOString();
  return {
    ...machi,
    name_kana: (machi.name_kana as string) || (machi.name as string),
    name_translations: jsonify(machi.name_translations),
    prefecture_name_translations: jsonify(machi.prefecture_name_translations),
    city_name_translations: jsonify(machi.city_name_translations),
    prefecture_name: (machi.prefecture_name as string) || '',
    created_at: (machi.created_at as string) || now,
    updated_at: (machi.updated_at as string) || now,
  };
}

// fromSQLiteMachi関数の再定義
function fromSQLiteMachi(row: Record<string, unknown>) {
  return {
    ...row,
    name_translations: parseJsonField(row.name_translations as string | null),
    prefecture_name_translations: parseJsonField(row.prefecture_name_translations as string | null),
    city_name_translations: parseJsonField(row.city_name_translations as string | null),
  };
}

// toSQLiteCity関数の再定義
function toSQLiteCity(city: Record<string, unknown>) {
  const now = new Date().toISOString();
  return {
    ...city,
    name_kana: (city.name_kana as string) || (city.name as string),
    name_translations: jsonify(city.name_translations),
    created_at: (city.created_at as string) || now,
    updated_at: (city.updated_at as string) || now,
  };
}

// fromSQLiteCity関数の再定義
function fromSQLiteCity(row: Record<string, unknown>) {
  return {
    ...row,
    name_translations: parseJsonField(row.name_translations as string | null),
  };
}

// fromSQLiteTransportHub関数の再定義
function fromSQLiteTransportHub(row: Record<string, unknown>) {
  return {
    ...row,
    name_translations: parseJsonField(row.name_translations as string | null),
  };
}

describe('tile-cache-helpers', () => {
  describe('jsonify', () => {
    it('オブジェクトをJSON文字列に変換', () => {
      const result = jsonify({ en: 'Tokyo', cn: '东京' });
      expect(result).toBe('{"en":"Tokyo","cn":"东京"}');
    });

    it('配列をJSON文字列に変換', () => {
      const result = jsonify(['a', 'b', 'c']);
      expect(result).toBe('["a","b","c"]');
    });

    it('nullはnullを返す', () => {
      const result = jsonify(null);
      expect(result).toBeNull();
    });

    it('undefinedはnullを返す', () => {
      const result = jsonify(undefined);
      expect(result).toBeNull();
    });

    it('空オブジェクトはJSON文字列を返す', () => {
      const result = jsonify({});
      expect(result).toBe('{}');
    });

    it('空文字列はnullを返す（falsyなので）', () => {
      const result = jsonify('');
      expect(result).toBeNull();
    });

    it('文字列はJSON文字列として返す', () => {
      const result = jsonify('test');
      expect(result).toBe('"test"');
    });

    it('数値はJSON文字列として返す', () => {
      const result = jsonify(123);
      expect(result).toBe('123');
    });
  });

  describe('toSQLiteMachi', () => {
    it('基本的な変換ができる', () => {
      const machi = {
        id: 'machi-1',
        name: '渋谷',
        name_kana: 'しぶや',
        name_translations: { en: 'Shibuya' },
        prefecture_name: '東京都',
        prefecture_name_translations: { en: 'Tokyo' },
        city_name: '渋谷区',
        city_name_translations: { en: 'Shibuya City' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const result = toSQLiteMachi(machi);

      expect(result.id).toBe('machi-1');
      expect(result.name).toBe('渋谷');
      expect(result.name_kana).toBe('しぶや');
      expect(result.name_translations).toBe('{"en":"Shibuya"}');
      expect(result.prefecture_name).toBe('東京都');
      expect(result.prefecture_name_translations).toBe('{"en":"Tokyo"}');
      expect(result.city_name_translations).toBe('{"en":"Shibuya City"}');
    });

    it('name_kanaがない場合はnameをセット', () => {
      const machi = {
        id: 'machi-2',
        name: '新宿',
      };

      const result = toSQLiteMachi(machi);

      expect(result.name_kana).toBe('新宿');
    });

    it('prefecture_nameがない場合は空文字列', () => {
      const machi = {
        id: 'machi-3',
        name: 'テスト',
      };

      const result = toSQLiteMachi(machi);

      expect(result.prefecture_name).toBe('');
    });

    it('translationsがnullの場合はnull', () => {
      const machi = {
        id: 'machi-4',
        name: 'テスト',
        name_translations: null,
      };

      const result = toSQLiteMachi(machi);

      expect(result.name_translations).toBeNull();
    });

    it('created_at/updated_atがない場合は現在時刻', () => {
      const machi = {
        id: 'machi-5',
        name: 'テスト',
      };

      const before = new Date().toISOString();
      const result = toSQLiteMachi(machi);
      const after = new Date().toISOString();

      expect(result.created_at >= before).toBe(true);
      expect(result.created_at <= after).toBe(true);
      expect(result.updated_at >= before).toBe(true);
      expect(result.updated_at <= after).toBe(true);
    });
  });

  describe('fromSQLiteMachi', () => {
    it('JSON文字列をパースして変換', () => {
      const row = {
        id: 'machi-1',
        name: '渋谷',
        name_translations: '{"en":"Shibuya"}',
        prefecture_name_translations: '{"en":"Tokyo"}',
        city_name_translations: '{"en":"Shibuya City"}',
      };

      const result = fromSQLiteMachi(row);

      expect(result.id).toBe('machi-1');
      expect(result.name).toBe('渋谷');
      expect(result.name_translations).toEqual({ en: 'Shibuya' });
      expect(result.prefecture_name_translations).toEqual({ en: 'Tokyo' });
      expect(result.city_name_translations).toEqual({ en: 'Shibuya City' });
    });

    it('nullの場合はnullのまま', () => {
      const row = {
        id: 'machi-2',
        name: '新宿',
        name_translations: null,
        prefecture_name_translations: null,
        city_name_translations: null,
      };

      const result = fromSQLiteMachi(row);

      expect(result.name_translations).toBeNull();
      expect(result.prefecture_name_translations).toBeNull();
      expect(result.city_name_translations).toBeNull();
    });

    it('不正なJSONはnullを返す', () => {
      const row = {
        id: 'machi-3',
        name: 'テスト',
        name_translations: 'invalid json',
      };

      const result = fromSQLiteMachi(row);

      expect(result.name_translations).toBeNull();
    });
  });

  describe('toSQLiteCity', () => {
    it('基本的な変換ができる', () => {
      const city = {
        id: 'city-1',
        name: '渋谷区',
        name_kana: 'しぶやく',
        name_translations: { en: 'Shibuya City' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const result = toSQLiteCity(city);

      expect(result.id).toBe('city-1');
      expect(result.name).toBe('渋谷区');
      expect(result.name_kana).toBe('しぶやく');
      expect(result.name_translations).toBe('{"en":"Shibuya City"}');
    });

    it('name_kanaがない場合はnameをセット', () => {
      const city = {
        id: 'city-2',
        name: '新宿区',
      };

      const result = toSQLiteCity(city);

      expect(result.name_kana).toBe('新宿区');
    });
  });

  describe('fromSQLiteCity', () => {
    it('JSON文字列をパースして変換', () => {
      const row = {
        id: 'city-1',
        name: '渋谷区',
        name_translations: '{"en":"Shibuya City"}',
      };

      const result = fromSQLiteCity(row);

      expect(result.id).toBe('city-1');
      expect(result.name).toBe('渋谷区');
      expect(result.name_translations).toEqual({ en: 'Shibuya City' });
    });

    it('nullの場合はnullのまま', () => {
      const row = {
        id: 'city-2',
        name: '新宿区',
        name_translations: null,
      };

      const result = fromSQLiteCity(row);

      expect(result.name_translations).toBeNull();
    });
  });

  describe('fromSQLiteTransportHub', () => {
    it('JSON文字列をパースして変換', () => {
      const row = {
        id: 'hub-1',
        name: '渋谷駅',
        name_translations: '{"en":"Shibuya Station"}',
        type: 'station_jr',
      };

      const result = fromSQLiteTransportHub(row);

      expect(result.id).toBe('hub-1');
      expect(result.name).toBe('渋谷駅');
      expect(result.name_translations).toEqual({ en: 'Shibuya Station' });
      expect(result.type).toBe('station_jr');
    });

    it('nullの場合はnullのまま', () => {
      const row = {
        id: 'hub-2',
        name: '新宿駅',
        name_translations: null,
      };

      const result = fromSQLiteTransportHub(row);

      expect(result.name_translations).toBeNull();
    });
  });
});
