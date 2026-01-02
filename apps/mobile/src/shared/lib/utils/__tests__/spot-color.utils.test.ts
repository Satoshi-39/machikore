/**
 * spot-color.utils.ts のテスト
 */

import { getSpotColorKey } from '../spot-color.utils';
import { DEFAULT_SPOT_COLOR, SPOT_COLOR_LIST } from '@/shared/config/constants';

describe('spot-color.utils', () => {
  describe('getSpotColorKey', () => {
    it('map_labelが設定されていればラベル色を返す', () => {
      // SPOT_COLOR_LISTから最初の色を取得
      const firstColor = SPOT_COLOR_LIST[0];
      const spot = {
        map_label: { color: firstColor?.color },
        spot_color: 'blue', // 別の色が設定されていても無視される
      };
      expect(getSpotColorKey(spot)).toBe(firstColor?.key);
    });

    it('map_labelがnullでspot_colorがあればspot_colorを返す', () => {
      const spot = {
        map_label: null,
        spot_color: 'red',
      };
      expect(getSpotColorKey(spot)).toBe('red');
    });

    it('map_label.colorがnullでspot_colorがあればspot_colorを返す', () => {
      const spot = {
        map_label: { color: null },
        spot_color: 'green',
      };
      expect(getSpotColorKey(spot)).toBe('green');
    });

    it('map_labelもspot_colorもなければデフォルト色を返す', () => {
      const spot = {};
      expect(getSpotColorKey(spot)).toBe(DEFAULT_SPOT_COLOR);
    });

    it('map_labelがundefinedでspot_colorもundefinedならデフォルト色を返す', () => {
      const spot = {
        map_label: undefined,
        spot_color: undefined,
      };
      expect(getSpotColorKey(spot)).toBe(DEFAULT_SPOT_COLOR);
    });

    it('map_label.colorが不正な色の場合はspot_colorにフォールバック', () => {
      const spot = {
        map_label: { color: '#invalid_color' },
        spot_color: 'purple',
      };
      expect(getSpotColorKey(spot)).toBe('purple');
    });

    it('map_label.colorが不正でspot_colorもない場合はデフォルト色', () => {
      const spot = {
        map_label: { color: '#invalid_color' },
      };
      expect(getSpotColorKey(spot)).toBe(DEFAULT_SPOT_COLOR);
    });
  });
});
