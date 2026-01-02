/**
 * json.utils.ts のテスト
 */

import { parseJsonField } from '../json.utils';

describe('json.utils', () => {
  describe('parseJsonField', () => {
    it('nullを渡すとnullを返す', () => {
      expect(parseJsonField(null)).toBeNull();
    });

    it('undefinedを渡すとnullを返す', () => {
      expect(parseJsonField(undefined)).toBeNull();
    });

    it('オブジェクトを渡すとそのまま返す', () => {
      const obj = { key: 'value', nested: { a: 1 } };
      expect(parseJsonField(obj)).toEqual(obj);
    });

    it('配列を渡すとそのまま返す', () => {
      const arr = [1, 2, 3];
      expect(parseJsonField(arr)).toEqual(arr);
    });

    it('有効なJSON文字列をパースする', () => {
      const jsonStr = '{"name":"test","value":123}';
      expect(parseJsonField(jsonStr)).toEqual({ name: 'test', value: 123 });
    });

    it('配列のJSON文字列をパースする', () => {
      const jsonStr = '[1, 2, 3, "four"]';
      expect(parseJsonField(jsonStr)).toEqual([1, 2, 3, 'four']);
    });

    it('ネストされたJSON文字列をパースする', () => {
      const jsonStr = '{"user":{"name":"太郎","age":25},"active":true}';
      expect(parseJsonField(jsonStr)).toEqual({
        user: { name: '太郎', age: 25 },
        active: true,
      });
    });

    it('無効なJSON文字列はnullを返す', () => {
      expect(parseJsonField('not valid json')).toBeNull();
    });

    it('不完全なJSON文字列はnullを返す', () => {
      expect(parseJsonField('{"incomplete": ')).toBeNull();
    });

    it('空文字列はnullを返す（JSONとしては無効）', () => {
      expect(parseJsonField('')).toBeNull();
    });

    it('数値のみの文字列はパースする', () => {
      expect(parseJsonField('123')).toBe(123);
    });

    it('boolean文字列はパースする', () => {
      expect(parseJsonField('true')).toBe(true);
      expect(parseJsonField('false')).toBe(false);
    });

    it('"null"文字列はパースしてnullを返す', () => {
      expect(parseJsonField('null')).toBeNull();
    });

    it('型パラメータで戻り値の型を指定できる', () => {
      interface User {
        id: number;
        name: string;
      }
      const jsonStr = '{"id":1,"name":"テスト"}';
      const result = parseJsonField<User>(jsonStr);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('テスト');
    });
  });
});
