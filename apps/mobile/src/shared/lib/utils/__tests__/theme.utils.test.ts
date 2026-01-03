/**
 * theme.utils.ts のテスト
 */

import { getSpotColor } from '../theme.utils';
import { SPOT_COLORS, DEFAULT_SPOT_COLOR } from '@/shared/config/constants';

describe('theme.utils', () => {
  describe('getSpotColor', () => {
    it('有効なカラーキーはカラーコードを返す', () => {
      // SPOT_COLORSの各キーをテスト
      Object.keys(SPOT_COLORS).forEach((key) => {
        const color = getSpotColor(key);
        expect(color).toBe(SPOT_COLORS[key as keyof typeof SPOT_COLORS].color);
      });
    });

    it('blueはデフォルトの青色を返す', () => {
      const color = getSpotColor('blue');
      expect(color).toBe(SPOT_COLORS.blue.color);
    });

    it('redは赤色を返す', () => {
      const color = getSpotColor('red');
      expect(color).toBe(SPOT_COLORS.red.color);
    });

    it('greenは緑色を返す', () => {
      const color = getSpotColor('green');
      expect(color).toBe(SPOT_COLORS.green.color);
    });

    it('nullはデフォルト色を返す', () => {
      const color = getSpotColor(null);
      expect(color).toBe(SPOT_COLORS[DEFAULT_SPOT_COLOR].color);
    });

    it('undefinedはデフォルト色を返す', () => {
      const color = getSpotColor(undefined);
      expect(color).toBe(SPOT_COLORS[DEFAULT_SPOT_COLOR].color);
    });

    it('無効なカラーキーはデフォルト色を返す', () => {
      const color = getSpotColor('invalid_color');
      expect(color).toBe(SPOT_COLORS[DEFAULT_SPOT_COLOR].color);
    });

    it('空文字列はデフォルト色を返す', () => {
      const color = getSpotColor('');
      expect(color).toBe(SPOT_COLORS[DEFAULT_SPOT_COLOR].color);
    });

    it('返り値はカラーコード形式（#で始まる）', () => {
      const color = getSpotColor('blue');
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
